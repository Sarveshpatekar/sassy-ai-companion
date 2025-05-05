
import React, { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WebScraperProps {
  onDataReceived?: (data: string) => void;
  className?: string;
}

const WebScraper: React.FC<WebScraperProps> = ({ 
  onDataReceived,
  className 
}) => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScrape = async () => {
    if (!url) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // We use a CORS proxy service to access external websites
      const corsProxy = 'https://corsproxy.io/?';
      const response = await axios.get(`${corsProxy}${encodeURIComponent(url)}`);
      
      // Extract the HTML content
      const htmlContent = response.data;
      setResult(htmlContent);
      
      // If a callback was provided, pass the data to the parent component
      if (onDataReceived) {
        onDataReceived(htmlContent);
      }
    } catch (err) {
      console.error('Error scraping website:', err);
      setError('Failed to scrape the website. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("jarvis-card", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Globe className="h-5 w-5 text-jarvis-primary" />
        <h3 className="text-sm font-semibold text-gray-300">Web Scraper</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Enter website URL to scrape"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-jarvis-dark border-jarvis-muted/50 text-white"
          />
          <Button 
            onClick={handleScrape} 
            disabled={isLoading || !url}
            className="bg-jarvis-primary hover:bg-jarvis-primary/90"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Scrape
          </Button>
        </div>
        
        {error && (
          <div className="p-2 text-red-400 bg-red-900/20 border border-red-800/50 rounded text-sm">
            {error}
          </div>
        )}
        
        {result && (
          <div className="mt-2">
            <div className="text-sm text-gray-400 mb-2">HTML content retrieved successfully!</div>
            <div className="p-2 bg-jarvis-muted/20 border border-jarvis-muted/50 rounded text-xs text-gray-300 h-32 overflow-auto">
              <pre>{result.slice(0, 500)}... (showing first 500 characters)</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebScraper;
