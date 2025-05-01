
import React from 'react';
import { ExternalLink, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
}

interface NewsCardProps {
  news: NewsItem[];
  className?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, className }) => {
  return (
    <div className={cn("jarvis-card", className)}>
      <div className="flex items-center gap-2 mb-3 z-10">
        <Newspaper className="h-5 w-5 text-jarvis-primary" />
        <h3 className="text-sm font-semibold text-gray-300">Latest News</h3>
      </div>
      
      <div className="space-y-2 z-10">
        {news.map((item) => (
          <div key={item.id} className="border-b border-jarvis-muted/50 pb-2 last:border-0">
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm hover:text-jarvis-primary transition-colors flex items-start gap-1"
            >
              <span className="flex-1">{item.title}</span>
              <ExternalLink className="h-3 w-3 flex-shrink-0 mt-1" />
            </a>
            <p className="text-xs text-gray-400">{item.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsCard;
