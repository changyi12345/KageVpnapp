'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
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

  useEffect(() => {
    const saved = localStorage.getItem('support_conversation_id');
    if (saved) setConversationId(saved);
  }, []);

  useEffect(() => {
    if (!open || !conversationId) return;
    let stop = false;
  
    const fetchThread = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/support/messages?conversationId=${conversationId}`, { cache: 'no-store' });
        const data = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(data.items)) {
          setMessages(data.items.map((m: any) => ({ _id: m._id, sender: m.sender, message: m.message, createdAt: m.createdAt })));
        }
      } finally {
        setLoading(false);
        // scroll to bottom
        setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight }), 0);
      }
    };
  
    fetchThread();
    const id = setInterval(() => { if (!stop) fetchThread(); }, 3000);
    return () => { stop = true; clearInterval(id); };
  }, [open, conversationId]);

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
    } catch (e: any) {
      error('Failed', e.message || 'Server error');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark p-4 rounded-full shadow-lg hover:shadow-neon-cyan/25 transition-all"
          aria-label="Open live chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 w-80 bg-primary-secondary border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <div className="font-semibold">Live Chat</div>
            <button onClick={() => setOpen(false)} className="text-gray-300 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-64 flex flex-col">
            <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2">
              {loading && messages.length === 0 && (
                <div className="text-center text-gray-400 text-sm">Loading...</div>
              )}
              {messages.map((m, idx) => (
                <div key={m._id || idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${m.sender === 'user' ? 'bg-neon-cyan text-primary-dark rounded-br-none' : 'bg-gray-800 text-white rounded-bl-none'}`}>
                    <div>{m.message}</div>
                    {m.createdAt && <div className="text-[10px] opacity-70 mt-1">{new Date(m.createdAt).toLocaleTimeString()}</div>}
                  </div>
                </div>
              ))}
            </div>

            {!isAuthenticated && !conversationId && (
              <div className="px-3 pb-2 space-y-2">
                <input
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-xs"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-xs"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </div>
            )}

            <div className="p-3 border-t border-gray-700 flex items-center gap-2">
              <input
                className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm"
                placeholder="Write a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
              />
              <button
                onClick={submit}
                disabled={sending}
                className="inline-flex items-center justify-center gap-2 bg-neon-cyan text-primary-dark px-3 py-2 rounded-md hover:bg-neon-blue transition disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}