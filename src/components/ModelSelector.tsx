
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ApiService from '@/services/apiService';

interface ModelOption {
  name: string;
  value: string;
  description: string;
}

interface ModelSelectorProps {
  currentModel?: string;
  onModelChange?: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  currentModel,
  onModelChange
}) => {
  const [selectedModel, setSelectedModel] = useState<string>(currentModel || '');
  const [isChanging, setIsChanging] = useState(false);
  const { toast } = useToast();

  const models: ModelOption[] = [
    { 
      name: "TinyLlama Chat", 
      value: "TinyLlama/TinyLlama-1.1B-Chat-v1.0", 
      description: "1.1B parameter model, fast but less capable" 
    },
    { 
      name: "Mistral 7B Instruct", 
      value: "mistralai/Mistral-7B-Instruct-v0.2", 
      description: "7B parameter model, good balance of quality and speed" 
    },
    { 
      name: "Phi-2", 
      value: "microsoft/phi-2", 
      description: "2.7B parameter model from Microsoft" 
    },
    { 
      name: "OpenChat 3.5", 
      value: "openchat/openchat-3.5-0106", 
      description: "Advanced 7B model with great conversational abilities" 
    }
  ];

  const handleChangeModel = async () => {
    if (!selectedModel || selectedModel === currentModel) return;
    
    setIsChanging(true);
    try {
      const result = await ApiService.changeModel(selectedModel);
      
      if (result.success) {
        toast({
          title: "Model Changed",
          description: `Now using ${selectedModel.split('/').pop()}`,
        });
        
        if (onModelChange) {
          onModelChange(selectedModel);
        }
      } else {
        toast({
          title: "Error Changing Model",
          description: result.error || "Failed to change model",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Model change error:", error);
      toast({
        title: "Error",
        description: "Failed to change the model. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="jarvis-card">
      <div className="flex items-center gap-2 mb-3">
        <Settings className="h-5 w-5 text-jarvis-primary" />
        <h3 className="text-sm font-semibold text-gray-300">AI Model</h3>
      </div>
      
      <div className="space-y-3">
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="bg-jarvis-dark border-jarvis-muted/50 text-white">
            <SelectValue placeholder="Select AI model" />
          </SelectTrigger>
          <SelectContent className="bg-jarvis-dark border-jarvis-muted/50 text-white">
            {models.map((model) => (
              <SelectItem 
                key={model.value} 
                value={model.value}
                className="focus:bg-jarvis-muted/50"
              >
                <div>
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-gray-400">{model.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          onClick={handleChangeModel} 
          disabled={isChanging || !selectedModel || selectedModel === currentModel}
          className="w-full bg-jarvis-primary hover:bg-jarvis-primary/90"
        >
          {isChanging ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Changing Model...
            </>
          ) : (
            <>Apply Change</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ModelSelector;
