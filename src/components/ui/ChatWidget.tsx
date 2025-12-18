'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ _id?: string; sender: 'user'|'admin'; message: string; createdAt?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated, user } = useAuth();
  const { success, error } = useToast();
  // Additions
  const [status, setStatus] = useState<'idle'|'connecting'|'online'|'error'>('idle');
  const [pollDelay, setPollDelay] = useState(3000);
  const [unread, setUnread] = useState(0);
  const pollTimer = useRef<number | null>(null);
  const errorCount = useRef(0);
  const abortCtrl = useRef<AbortController | null>(null);
  const [isWindowFocused, setIsWindowFocused] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('support_conversation_id');
    if (saved) setConversationId(saved);
  }, []);

  // Persist guest info for autofill
  useEffect(() => {
    if (!isAuthenticated) {
      if (name) localStorage.setItem('support_guest_name', name);
      if (email) localStorage.setItem('support_guest_email', email);
    }
  }, [name, email, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      const n = localStorage.getItem('support_guest_name') || '';
      const e = localStorage.getItem('support_guest_email') || '';
      if (n) setName(n);
      if (e) setEmail(e);
    }
  }, [isAuthenticated]);

  // Helper: only scroll if near bottom
  const scrollToBottomIfNear = () => {
    const el = listRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.clientHeight - el.scrollTop;
    if (distance < 80) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!open || !conversationId) return;
    let stopped = false;
    setStatus('connecting');
    setUnread(0);

    const onVisibility = () => {
      const visible = !document.hidden;
      setIsWindowFocused(visible);
      if (!visible) {
        if (pollTimer.current) {
          window.clearTimeout(pollTimer.current);
          pollTimer.current = null;
        }
      } else {
        loop();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const fetchThread = async () => {
      try {
        setLoading(true);
        abortCtrl.current?.abort();
        abortCtrl.current = new AbortController();
        const res = await fetch(`/api/support/messages?conversationId=${conversationId}`, { cache: 'no-store', signal: abortCtrl.current.signal });
        const data = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(data.items)) {
          const prevLen = messages.length;
          setMessages(data.items.map((m: any) => ({ _id: m._id, sender: m.sender, message: m.message, createdAt: m.createdAt })));
          if (prevLen && data.items.length > prevLen && (!open || !isWindowFocused)) {
            setUnread((u) => u + (data.items.length - prevLen));
          }
          setStatus('online');
          errorCount.current = 0;
          setPollDelay(3000);
        } else {
          throw new Error('Bad response');
        }
      } catch {
        setStatus('error');
        errorCount.current += 1;
        const next = Math.min(15000, 3000 * Math.pow(2, Math.min(errorCount.current, 3)));
        setPollDelay(next);
      } finally {
        setLoading(false);
        setTimeout(() => scrollToBottomIfNear(), 0);
      }
    };

    const loop = () => {
      if (stopped || document.hidden) return;
      fetchThread().finally(() => {
        if (!stopped) {
          pollTimer.current = window.setTimeout(loop, pollDelay);
        }
      });
    };

    // initial
    loop();

    return () => {
      stopped = true;
      document.removeEventListener('visibilitychange', onVisibility);
      if (pollTimer.current) {
        window.clearTimeout(pollTimer.current);
        pollTimer.current = null;
      }
      abortCtrl.current?.abort();
    };
  }, [open, conversationId, pollDelay, messages.length]);

  const submit = async () => {
    if (!message.trim()) {
      error('Missing', 'Enter a message');
      return;
    }
    if (!name.trim() || !email.trim()) {
      error('Missing', 'Name and email are required');
      return;
    }
  
    setSending(true);
    try {
      const res = await fetch('/api/support/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: isAuthenticated ? undefined : name,
          email: isAuthenticated ? undefined : email,
          message,
          conversationId: conversationId || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed');
      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
        localStorage.setItem('support_conversation_id', data.conversationId);
      }
      setMessages(prev => [...prev, { sender: 'user', message }]);
      setMessage('');
      success('Sent', 'Your message has been sent to support');
      setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 0);
      setUnread(0);
      setStatus('online');
      errorCount.current = 0;
      setPollDelay(3000);
    } catch (e: any) {
      error('Failed', e.message || 'Server error');
      setStatus('error');
      errorCount.current += 1;
      const next = Math.min(15000, 3000 * Math.pow(2, Math.min(errorCount.current, 3)));
      setPollDelay(next);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => { setOpen(true); setUnread(0); }}
          className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark px-4 py-3 rounded-full shadow-lg hover:shadow-neon-cyan/25 transition-all relative flex items-center gap-2"
          aria-label="Open live chat"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="text-sm font-semibold">Chat</span>
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] leading-none rounded-full px-1.5 py-0.5">{unread}</span>
          )}
        </button>
      )}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 w-[22rem] sm:w-[24rem] bg-primary-secondary border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <div className="font-semibold flex items-center gap-2">
              Support
              <span className={`text-xs px-2 py-0.5 rounded ${
                status === 'online'
                  ? 'bg-green-600 text-white'
                  : status === 'connecting'
                  ? 'bg-yellow-600 text-white'
                  : status === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}>
                {status === 'online' ? 'Online' : status === 'connecting' ? 'Connecting' : status === 'error' ? 'Reconnecting' : 'Idle'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {conversationId && (
                <button
                  onClick={() => {
                    setConversationId(null);
                    localStorage.removeItem('support_conversation_id');
                    setMessages([]);
                    setUnread(0);
                    setStatus('idle');
                  }}
                  className="text-gray-300 hover:text-white text-xs"
                >
                  End
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-300 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="px-4 pt-2 text-[11px] text-gray-400">Typically replies within a few minutes</div>

          <div className="h-72 flex flex-col">
            <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2">
              {loading && messages.length === 0 && (
                <div className="text-center text-gray-400 text-sm">Loading...</div>
              )}
              {!loading && messages.length === 0 && (
                <div className="text-center text-gray-400 text-xs py-4">Start a conversation — we’re here to help.</div>
              )}
              {messages.map((m, idx) => (
                <div key={m._id || idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    m.sender === 'user' ? 'bg-neon-cyan text-primary-dark rounded-br-none' : 'bg-gray-800 text-white rounded-bl-none'
                  }`}>
                    <div>{m.message}</div>
                    {m.createdAt && (
                      <div className="text-[10px] opacity-70 mt-1">
                        {new Date(m.createdAt).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!isAuthenticated && !conversationId && (
              <div className="px-3 pb-2 space-y-2">
                <label className="block">
                  <span className="text-[11px] text-gray-400">Your name</span>
                  <input
                    className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-xs"
                    placeholder="e.g., John"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] text-gray-400">Your email</span>
                  <input
                    className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-xs"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                </label>
              </div>
            )}

            <div className="p-3 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
                />
                <button
                  onClick={submit}
                  disabled={sending}
                  className="inline-flex items-center justify-center gap-2 bg-neon-cyan text-primary-dark px-3 py-2 rounded-md hover:bg-neon-blue transition disabled:opacity-50"
                  aria-label="Send message"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
              <div className="pt-1 text-[10px] text-gray-500">Press Enter to send</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}