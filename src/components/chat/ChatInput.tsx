'use client';

import { FormEvent, KeyboardEvent } from 'react';
import styles from '@/styles/chat.module.css';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  disabled = false,
}: ChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading && !disabled) {
        onSubmit(e as unknown as FormEvent<HTMLFormElement>);
      }
    }
  };

  return (
    <form className={styles['chat-input-form']} onSubmit={onSubmit}>
      <textarea
        className={styles['chat-input']}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? 'Chat complete' : 'Type your message...'}
        disabled={isLoading || disabled}
        rows={1}
      />
      <button
        type="submit"
        className={styles['chat-send-button']}
        disabled={!value.trim() || isLoading || disabled}
      >
        {isLoading ? '...' : 'Send'}
      </button>
    </form>
  );
}
