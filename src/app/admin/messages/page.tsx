'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { MessageSquare, Check, Send } from 'lucide-react';
import Link from 'next/link';

interface SupportMessage {
  _id: string;
  conversationId?: string;
  sender?: 'user' | 'admin';
  name?: string;
  email?: string;
  message: string;
  status: 'new' | 'read';
  createdAt: string;
}

export default function AdminMessagesPage() {
  const { adminUser, isAdmin } = useAdminAuth();
  const router = useRouter();
  const { toasts, removeToast, success, error } = useToast();

  const [items, setItems] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [thread, setThread] = useState<SupportMessage[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!adminUser || !isAdmin) router.push('/admin/login');
  }, [adminUser, isAdmin, router]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/support/messages?limit=100', { cache: 'no-store' });
        const data = await res.json();
        if (res.ok) {
          // Deduplicate by conversation
          const unique: Record<string, SupportMessage> = {};
          (data.items as SupportMessage[]).forEach((m) => {
            const conv = m.conversationId || m._id;
            if (!unique[conv]) unique[conv] = m;
          });
          setItems(Object.values(unique));
        } else {
          error('Load failed', data.error || 'Server error');
        }
      } catch (e: any) {
        error('Load failed', e.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [error]);

  const loadThread = async (convId: string) => {
    setActiveConv(convId);
    try {
      const res = await fetch(`/api/support/messages?conversationId=${convId}`, { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setThread(data.items || []);
      } else {
        error('Thread load failed', data.error || 'Server error');
      }
    } catch (e: any) {
      error('Thread load failed', e.message || 'Network error');
    }
  };

  const sendReply = async () => {
    if (!activeConv || !reply.trim()) return;
    setSending(true);
    try {
      const token = localStorage.getItem('admin-token') || '';
      const res = await fetch('/api/admin/support/messages/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ conversationId: activeConv, message: reply }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed');
      setReply('');
      success('Replied', 'Message ပို့ပြီးပါပြီ');
      await loadThread(activeConv);
    } catch (e: any) {
      error('Send failed', e.message || 'Server error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-neon-cyan" />
          <h1 className="text-2xl font-orbitron font-bold">Support Inbox</h1>
        </div>
        <Link href="/admin" className="text-neon-cyan hover:underline">Back to Dashboard</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-primary-secondary border border-gray-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-6 text-gray-400">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-gray-400">No messages</div>
          ) : (
            <ul className="divide-y divide-gray-700">
              {items.map((m) => {
                const convId = m.conversationId || m._id;
                return (
                  <li key={convId} className={`p-4 cursor-pointer hover:bg-gray-800/40 ${activeConv === convId ? 'bg-gray-800/60' : ''}`} onClick={() => loadThread(convId)}>
                    <div className="text-sm text-gray-400">
                      {(m.name || 'Anonymous')} {m.email ? `• ${m.email}` : ''}
                      <span className="ml-2 text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="mt-1 line-clamp-1">{m.message}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="md:col-span-2 bg-primary-secondary border border-gray-700 rounded-xl flex flex-col">
          {!activeConv ? (
            <div className="p-6 text-gray-400">Conversation ကိုရွေးပါ</div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {thread.map((m) => (
                  <div key={m._id} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${m.sender === 'admin' ? 'bg-neon-cyan text-primary-dark rounded-br-none' : 'bg-gray-800 text-white rounded-bl-none'}`}>
                      <div>{m.message}</div>
                      <div className="text-[10px] opacity-70 mt-1">{new Date(m.createdAt).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-700 flex items-center gap-2">
                <input
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm"
                  placeholder="Reply..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                />
                <button
                  onClick={sendReply}
                  disabled={sending}
                  className="inline-flex items-center justify-center gap-2 bg-neon-cyan text-primary-dark px-3 py-2 rounded-md hover:bg-neon-blue transition disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}