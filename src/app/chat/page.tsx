'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingIllustration from '@/components/FloatingIllustration';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UserData {
  email: string;
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
  plan: string;
}

const suggestions = [
  'What does Mercury retrograde mean for me?',
  'Will I find love this year?',
  'What career path suits my chart?',
  'What does my moon sign reveal?',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'The planets have been expecting you. What weighs on your mind?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        setCheckedAuth(true);
      })
      .catch(() => setCheckedAuth(true));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowSuggestions(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setShowSuggestions(false);
    setMessageCount((c) => c + 1);

    if (typeof window !== 'undefined' && 'mixpanel' in window) {
      (window as unknown as { mixpanel: { track: (event: string, props?: Record<string, unknown>) => void } }).mixpanel.track('chat_message');
    }

    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', timestamp: new Date() },
    ]);

    try {
      const body: Record<string, unknown> = { message: content };
      if (user) {
        body.birthData = {
          date: user.birthDate,
          time: user.birthTime,
          place: user.birthPlace,
        };
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('API error');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m))
        );
      }

      if (!accumulated) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: 'The stars are momentarily quiet. Please try asking again.' }
              : m
          )
        );
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: 'The cosmic connection is temporarily disrupted. Please try again.' }
            : m
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showAuthPrompt = checkedAuth && !user && messageCount >= 2;

  return (
    <div className="min-h-screen pt-20 pb-6 px-4 flex flex-col max-w-[640px] mx-auto">
      {/* Minimal header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center py-4"
      >
        <FloatingIllustration
          src="/illustrations/stella-chat-illustration.png"
          alt="Stella the AI astrologer"
          width={150}
          height={150}
          opacity={0.7}
          className="mb-3"
        />
        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Stella</p>
      </motion.div>

      {/* User badge */}
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 flex justify-center"
        >
          <span className="text-[10px] text-white/30 border border-white/10 px-3 py-1">
            Personalized for {user.email}
          </span>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-4">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'text-white/90'
                    : 'bg-white/[0.03] rounded-lg px-5 py-4'
                }`}
              >
                {msg.role === 'assistant' && (
                  <span className="text-white/30 text-[10px] uppercase tracking-wider block mb-2">Stella</span>
                )}
                <p className="text-white/70 whitespace-pre-wrap font-light">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && messages[messages.length - 1]?.content === '' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white/[0.03] rounded-lg px-5 py-4">
                <span className="text-white/30 text-[10px] uppercase tracking-wider block mb-2">Stella</span>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1 h-1 bg-white/30 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Sign-in prompt */}
      <AnimatePresence>
        {showAuthPrompt && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 overflow-hidden"
          >
            <div className="py-3 text-center border-t border-white/5">
              <p className="text-xs text-white/30">
                <a href="/birth-chart" className="text-gold hover:text-gold-light transition-colors">
                  Enter your birth details
                </a>
                {' '}for personalized readings
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestion chips */}
      <AnimatePresence>
        {showSuggestions && messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-4 justify-center"
          >
            {suggestions.map((s, i) => (
              <motion.button
                key={s}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                onClick={() => handleSend(s)}
                className="text-xs px-4 py-2 border border-white/10 text-white/30 hover:text-white/60 hover:border-gold/20 transition-all duration-200 cursor-pointer"
              >
                {s}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input — minimal, bottom border only */}
      <div className="flex items-end gap-3 border-b border-white/15 pb-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask the stars anything..."
          rows={1}
          className="flex-1 bg-transparent border-none resize-none text-sm placeholder:text-white/20 p-2 max-h-32"
          style={{ outline: 'none', boxShadow: 'none' }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="p-2 text-white/30 hover:text-gold disabled:opacity-20 transition-all duration-200 shrink-0 cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M14 2L7 9M14 2L10 14L7 9M14 2L2 6L7 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <p className="text-center text-[10px] text-white/20 mt-3">
        3 free questions per day · Upgrade for unlimited
      </p>
    </div>
  );
}
