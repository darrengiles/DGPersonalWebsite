"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CopyTooltipProps {
  text: string;
  message?: string;
  duration?: number;
  className?: string;
  children: React.ReactNode;
}

export const CopyTooltip: React.FC<CopyTooltipProps> = ({
  text,
  message = "Copied!",
  duration = 2000,
  className,
  children,
}) => {
  const [visible, setVisible] = useState(false);

  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(text);
    setVisible(true);
    setTimeout(() => setVisible(false), duration);
  }, [text, duration]);

  return (
    <span className={cn("relative inline-block", className)}>
      <button
        onClick={handleClick}
        className="pointer-events-auto underline text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors cursor-pointer"
      >
        {children}
      </button>
      <AnimatePresence>
        {visible && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.6 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 12,
              },
            }}
            exit={{ opacity: 0, y: 10, scale: 0.6 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-medium px-3 py-1 shadow-lg z-50 pointer-events-none"
          >
            {message}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};
