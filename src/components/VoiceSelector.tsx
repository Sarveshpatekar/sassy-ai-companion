
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';

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
  const handleVoiceChange = (value: string) => {
    console.log("Voice changed to:", value);
    onVoiceChange(value as VoiceType);
  };

  return (
    <div className={cn("jarvis-card", className)}>
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Voice Settings</h3>
      
      <RadioGroup 
        value={currentVoice} 
        onValueChange={handleVoiceChange}
        className="flex flex-col space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="male" id="male-voice" className="cursor-pointer" />
          <Label htmlFor="male-voice" className="text-sm cursor-pointer">Male Voice (J.A.R.V.I.S)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="female" id="female-voice" className="cursor-pointer" />
          <Label htmlFor="female-voice" className="text-sm cursor-pointer">Female Voice (F.R.I.D.A.Y)</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default VoiceSelector;
