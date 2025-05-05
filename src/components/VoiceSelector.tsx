
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import { Volume2 } from 'lucide-react';

export type VoiceType = 'male' | 'female';

interface VoiceSelectorProps {
  currentVoice: VoiceType;
  onVoiceChange: (voice: VoiceType) => void;
  className?: string;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ 
  currentVoice, 
  onVoiceChange,
  className
}) => {
  // Make sure we're directly calling onVoiceChange
  const handleVoiceChange = (value: string) => {
    if (value === 'male' || value === 'female') {
      console.log("Voice changed to:", value);
      onVoiceChange(value as VoiceType);
    }
  };

  return (
    <div className={cn("jarvis-card", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Volume2 className="h-5 w-5 text-jarvis-primary" />
        <h3 className="text-sm font-semibold text-gray-300">Voice Settings</h3>
      </div>
      
      <RadioGroup 
        value={currentVoice} 
        onValueChange={handleVoiceChange}
        className="flex flex-col space-y-3"
      >
        <div 
          className="flex items-center space-x-2 w-full cursor-pointer p-2 rounded hover:bg-jarvis-muted/20 transition-colors" 
          onClick={() => handleVoiceChange('male')}
        >
          <RadioGroupItem value="male" id="male-voice" />
          <Label htmlFor="male-voice" className="text-sm cursor-pointer flex-1">
            Deep Voice (Jarvis)
          </Label>
        </div>
        
        <div 
          className="flex items-center space-x-2 w-full cursor-pointer p-2 rounded hover:bg-jarvis-muted/20 transition-colors"
          onClick={() => handleVoiceChange('female')}
        >
          <RadioGroupItem value="female" id="female-voice" />
          <Label htmlFor="female-voice" className="text-sm cursor-pointer flex-1">
            Soft Voice (Jarvis)
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default VoiceSelector;
