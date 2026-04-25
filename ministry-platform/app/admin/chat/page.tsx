'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FadeInUp } from '@/components/animations/page-transition';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';

interface Conversation {
  chat_id: string;
  last_message: string;
  last_sender: 'user' | 'admin';
  last_message_at: string;
  total_messages: number;
  user_messages: number;
}

interface Message {
  id: number;
  chat_id: string;
  text: string;
  sender: 'user' | 'admin';
  created_at: string;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [mobileShowMessages, setMobileShowMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const convoPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const msgPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/conversations');
      if (!res.ok) return;
      const json = await res.json();
      setConversations(json.data || []);
    } catch {
      // silently fail on poll
    }
  }, []);

  const fetchMessages = useCallback(async (chatId: string) => {
    try {
      const res = await fetch(`/api/chat/${encodeURIComponent(chatId)}`);
      if (!res.ok) return;
      const json = await res.json();
      setMessages(json.data || []);
    } catch {
      // silently fail on poll
    }
  }, []);

  useEffect(() => {
    setLoadingConvos(true);
    fetchConversations().finally(() => setLoadingConvos(false));

    convoPollRef.current = setInterval(fetchConversations, 5000);
    return () => {
      if (convoPollRef.current) clearInterval(convoPollRef.current);
    };
  }, [fetchConversations]);

  useEffect(() => {
    if (msgPollRef.current) {
      clearInterval(msgPollRef.current);
      msgPollRef.current = null;
    }

    if (!selectedChatId) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    fetchMessages(selectedChatId).finally(() => {
      setLoadingMessages(false);
      setTimeout(scrollToBottom, 100);
    });

    msgPollRef.current = setInterval(() => {
      fetchMessages(selectedChatId).then(() => setTimeout(scrollToBottom, 100));
    }, 5000);

    return () => {
      if (msgPollRef.current) clearInterval(msgPollRef.current);
    };
  }, [selectedChatId, fetchMessages, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSelectConversation = (chatId: string) => {
    setSelectedChatId(chatId);
    setMobileShowMessages(true);
  };

  const handleBackToList = () => {
    setMobileShowMessages(false);
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || sending || !selectedChatId) return;

    setInputValue('');
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: selectedChatId,
          text,
          sender: 'admin',
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setMessages(prev => [...prev, json.data]);
        fetchConversations();
      }
    } catch {
      setInputValue(text);
    } finally {
      setSending(false);
    }
  };

  const selectedConvo = conversations.find(c => c.chat_id === selectedChatId);

  let lastDateLabel = '';

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Chat Management' },
      ]} />

      <FadeInUp>
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
            Chat Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Communicate with visitors and respond to inquiries
          </p>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.1}>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 240px)', minHeight: '500px' }}>
          <div className="flex h-full">

            {/* Conversations sidebar */}
            <div className={`w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0 ${mobileShowMessages ? 'hidden md:flex' : 'flex'}`}>
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Conversations</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loadingConvos ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-7 h-7 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">No conversations yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {conversations.map((convo) => (
                      <button
                        key={convo.chat_id}
                        onClick={() => handleSelectConversation(convo.chat_id)}
                        className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                          selectedChatId === convo.chat_id ? 'bg-primary-50 dark:bg-primary-900/20 border-l-2 border-primary-600' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center space-x-2 min-w-0">
                            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
                              {convo.chat_id.substring(0, 16)}...
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatRelativeTime(convo.last_message_at)}
                            </span>
                            {convo.last_sender === 'user' && (
                              <span className="w-2.5 h-2.5 bg-primary-500 rounded-full" title="Awaiting reply" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate pl-10">
                          {convo.last_sender === 'admin' && <span className="text-gray-400 dark:text-gray-500">You: </span>}
                          {convo.last_message}
                        </p>
                        <div className="flex items-center space-x-3 mt-1 pl-10">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {convo.total_messages} message{convo.total_messages !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Messages panel */}
            <div className={`flex-1 flex flex-col min-w-0 ${!mobileShowMessages ? 'hidden md:flex' : 'flex'}`}>
              {selectedChatId ? (
                <>
                  {/* Chat header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center space-x-3 flex-shrink-0">
                    <button
                      onClick={handleBackToList}
                      className="md:hidden p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      aria-label="Back to conversations"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {selectedChatId.substring(0, 20)}...
                      </h3>
                      {selectedConvo && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedConvo.total_messages} messages &middot; Last active {formatRelativeTime(selectedConvo.last_message_at)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    {loadingMessages ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="flex space-x-1.5">
                          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No messages in this conversation</p>
                      </div>
                    ) : (
                      messages.map((message, idx) => {
                        const dateLabel = formatDate(message.created_at);
                        const showDate = dateLabel !== lastDateLabel;
                        lastDateLabel = dateLabel;

                        return (
                          <div key={message.id}>
                            {showDate && (
                              <div className="flex items-center justify-center my-4">
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500 dark:text-gray-400">
                                  {dateLabel}
                                </span>
                              </div>
                            )}
                            <div className={`flex mb-2 ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                              <div
                                className={`max-w-[75%] rounded-lg p-3 ${
                                  message.sender === 'admin'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                <div className="flex items-center justify-end mt-1">
                                  <span className="text-xs opacity-70">{formatTime(message.created_at)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Reply input */}
                  <div className="border-t border-gray-200 dark:border-gray-800 p-3 sm:p-4 flex-shrink-0">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder="Type a reply..."
                        disabled={sending}
                        className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm disabled:opacity-50"
                      />
                      <button
                        onClick={handleSend}
                        disabled={sending || !inputValue.trim()}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Send reply"
                      >
                        {sending ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Select a conversation</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose a conversation from the list to view and reply to messages
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </FadeInUp>
    </div>
  );
}
