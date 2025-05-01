
import React from 'react';
import { Share2, Twitter, Facebook, Link } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface ShareButtonProps {
  messageToShare: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ messageToShare }) => {
  const encodedMessage = encodeURIComponent(`Jarvis said: "${messageToShare}" - Try the Jarvis AI Assistant!`);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedMessage}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`Jarvis said: "${messageToShare}" - Try the Jarvis AI Assistant!`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => window.open(shareUrls.twitter, '_blank')}>
          <Twitter className="mr-2 h-4 w-4" />
          <span>Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(shareUrls.facebook, '_blank')}>
          <Facebook className="mr-2 h-4 w-4" />
          <span>Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard}>
          <Link className="mr-2 h-4 w-4" />
          <span>Copy link</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
