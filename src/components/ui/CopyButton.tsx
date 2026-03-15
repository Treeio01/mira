import { useCallback, useEffect, useState } from 'react';
import { CopyIcon } from '../icons/CopyIcon';

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(
      () => setCopied(true),
      () => { /* clipboard unavailable */ },
    );
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      aria-label="Копировать"
      className="flex-shrink-0 active:scale-90 transition-transform duration-150"
    >
      {copied ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 10.5L8 14.5L16 6.5" stroke="#661AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <CopyIcon />
      )}
    </button>
  );
}
