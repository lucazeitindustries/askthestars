'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isFirst?: boolean;
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
      isFirst: true,
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

  // Check if user is logged in
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        setCheckedAuth(true);
      })
      .catch(() => setCheckedAuth(true));
  }, []);

  // Gradual revelation: show suggestions after a delay
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
            ? { ...m, content: 'The cosmic connection is temporarily disrupted. Please try again ✨' }
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

  // Sign-in prompt only after 2nd user message
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
        <p className="text-xs text-tertiary">✦ Stella</p>
      </motion.div>

      {/* User badge if logged in */}
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 flex justify-center"
        >
          <span className="text-[10px] text-gold/50 bg-gold/5 px-3 py-1 rounded-full border border-gold/10">
            ✦ Personalized for {user.email}
          </span>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`relative max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gold/15 text-white border border-gold/10'
                    : 'glass-card'
                }`}
              >
                {msg.role === 'assistant' && (
                  <span className="text-gold/60 text-xs block mb-2">✦ Stella</span>
                )}
                {/* First response shimmer effect */}
                {msg.isFirst && msg.role === 'assistant' && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(212,168,83,0.08)_0%,transparent_70%)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                    data-sound="shimmer"
                  />
                )}
                <p className="text-secondary whitespace-pre-wrap font-light relative z-10">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator — animated dots */}
        <AnimatePresence>
          {isTyping && messages[messages.length - 1]?.content === '' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="glass-card px-5 py-4 rounded-2xl">
                <span className="text-gold/60 text-xs block mb-2">✦ Stella</span>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 bg-gold/40 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
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

      {/* Sign-in prompt — only after 2nd message */}
      <AnimatePresence>
        {showAuthPrompt && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 overflow-hidden"
          >
            <div className="p-3 rounded-xl bg-gold/5 border border-gold/10 text-center">
              <p className="text-xs text-tertiary">
                <a href="/birth-chart" className="text-gold hover:text-gold-light transition-colors">
                  Enter your birth details
                </a>
                {' '}for personalized readings ✦
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestion chips — appear with delay (gradual revelation) */}
      <AnimatePresence>
        {showSuggestions && messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-4 justify-center"
          >
            {suggestions.map((s, i) => (
              <motion.button
                key={s}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                onClick={() => handleSend(s)}
                className="text-xs px-4 py-2 rounded-full border border-white/10 text-hint hover:text-white hover:border-gold/20 hover:bg-gold/5 transition-all duration-200"
              >
                {s}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="glass-card p-3 flex items-end gap-3">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask the stars anything..."
          rows={1}
          className="flex-1 bg-transparent border-none resize-none text-sm placeholder:text-hint focus:ring-0 focus:shadow-none p-2 max-h-32"
          style={{ outline: 'none', boxShadow: 'none' }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="p-3 rounded-xl bg-gold/10 text-gold hover:bg-gold/20 disabled:opacity-30 disabled:hover:bg-gold/10 transition-all duration-200 shrink-0"
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

      <p className="text-center text-[10px] text-hint mt-3">
        3 free questions per day · Upgrade for unlimited
      </p>
    </div>
  );
}
