
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isListening,
  onToggleListening,
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full items-center space-x-2">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className={cn(
          "flex-shrink-0 rounded-full",
          isListening && "bg-jarvis-secondary/20 text-jarvis-secondary animate-pulse"
        )}
        onClick={onToggleListening}
        disabled={disabled}
      >
        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>

      <input
        ref={inputRef}
        type="text"
        placeholder={isListening ? "Listening..." : "Type your message..."}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="jarvis-input"
        disabled={disabled || isListening}
      />

      <Button 
        type="submit"
        size="icon"
        className="flex-shrink-0 bg-gradient-to-r from-jarvis-primary to-jarvis-primary/80 hover:from-jarvis-primary/90 hover:to-jarvis-primary text-white rounded-full"
        disabled={!message.trim() || disabled}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
