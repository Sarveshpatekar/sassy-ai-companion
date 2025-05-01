
import React from 'react';
import { cn } from '@/lib/utils';
import ArcReactor from './ArcReactor';
import { User, Bot } from 'lucide-react';

export type MessageType = 'user' | 'assistant' | 'system' | 'loading';

export interface ChatMessageProps {
  type: MessageType;
  content: string;
  timestamp?: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  content,
  timestamp = new Date()
}) => {
  const isUser = type === 'user';
  const isLoading = type === 'loading';
  const isSystem = type === 'system';
  
  return (
    <div className={cn(
      "group flex items-start gap-3 py-2 animate-fade-in",
      isUser ? "flex-row-reverse" : "",
    )}>
      <div className={cn(
        "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
        isUser ? "bg-jarvis-secondary/10 border-jarvis-secondary/20" : "bg-jarvis-primary/10 border-jarvis-primary/20"
      )}>
        {isUser ? (
          <User className="h-5 w-5 text-jarvis-secondary" />
        ) : isLoading ? (
          <ArcReactor size="sm" />
        ) : (
          <Bot className="h-5 w-5 text-jarvis-primary" />
        )}
      </div>
      
      <div className={cn(
        "flex-1 rounded-lg px-4 py-2 shadow-sm",
        isUser ? "bg-jarvis-secondary/10 border border-jarvis-secondary/20" : 
        isSystem ? "bg-jarvis-muted border border-jarvis-muted/50 text-jarvis-accent" : 
        isLoading ? "bg-jarvis-muted border border-jarvis-primary/20" :
        "bg-jarvis-primary/10 border border-jarvis-primary/20"
      )}>
        {isLoading ? (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <div className="space-y-2">
            <p className={cn(
              "text-sm leading-relaxed",
              isSystem && "italic"
            )}>
              {content}
            </p>
            <p className="text-xs text-muted-foreground">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
