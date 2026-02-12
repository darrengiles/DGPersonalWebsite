'use client';

import type { UIMessage } from '@ai-sdk/react';
import styles from '@/styles/chat.module.css';

interface ChatMessageProps {
  message: UIMessage;
}

// Parse markdown links [text](url) into clickable links
function parseLinks(text: string): React.ReactNode[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add the link
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className={styles['chat-link']}
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

// Single message bubble component
function MessageBubble({
  text,
  isUser,
  showAvatar
}: {
  text: string;
  isUser: boolean;
  showAvatar: boolean;
}) {
  return (
    <div className={`${styles['chat-message']} ${isUser ? styles['user'] : styles['assistant']}`}>
      <div className={styles['message-avatar']}>
        {showAvatar ? (isUser ? '👤' : '🏂') : ''}
      </div>
      <div className={styles['message-content']}>
        {showAvatar && (
          <div className={styles['message-role']}>
            {isUser ? 'You' : 'Snowboard Advisor'}
          </div>
        )}
        <div className={styles['message-text']}>
          {parseLinks(text.trim())}
        </div>
      </div>
    </div>
  );
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  // Extract text content from parts array
  const textContent = message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('');

  // Split on ||| delimiter for multiple messages
  const messageParts = textContent.split('|||').filter(part => part.trim());

  return (
    <>
      {messageParts.map((part, index) => (
        <MessageBubble
          key={`${message.id}-${index}`}
          text={part}
          isUser={isUser}
          showAvatar={index === 0}
        />
      ))}
    </>
  );
}
