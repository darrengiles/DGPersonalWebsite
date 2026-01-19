'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import '@/styles/chat.css';

const MAX_QUESTIONS = 5;

const INITIAL_MESSAGE = {
  id: 'initial',
  role: 'assistant' as const,
  parts: [
    {
      type: 'text' as const,
      text: "Yooo what's up brah! 🤙|||Stoked to help you find the perfect board.|||So like, what kinda terrain are you vibin' with? All-mountain, powder, park, or a mix?",
    },
  ],
};

export default function SnowboardRecommenderPage() {
  const [questionCount, setQuestionCount] = useState(1);
  const [input, setInput] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    messages: [INITIAL_MESSAGE],
    onFinish: () => {
      if (questionCount < MAX_QUESTIONS) {
        setQuestionCount((prev) => prev + 1);
      }
    },
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  // Scroll within the messages container only, not the page
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    await sendMessage(
      { text: userMessage },
      { body: { questionCount } }
    );
  };

  return (
    <>
      <header className="hero"></header>
      <main className="page-container">
        <Link href="/projects" className="chat-back-link">
          ← Back to Projects
        </Link>

        <div className="chat-container terminal-theme">
          <div className="chat-header">
            <h1 className="chat-title">🏂 Snowboard Recommender</h1>
            <span className="question-counter">
              {questionCount <= MAX_QUESTIONS
                ? `Question ${questionCount}/${MAX_QUESTIONS}`
                : 'Recommendation ready'}
            </span>
          </div>

          <div className="chat-messages" ref={messagesContainerRef}>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading && (
              <div className="chat-loading">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>Thinking...</span>
              </div>
            )}
          </div>

          <div className="chat-input-container">
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </>
  );
}
