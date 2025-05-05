
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage, { ChatMessageProps, MessageType } from './ChatMessage';
import ChatInput from './ChatInput';
import ArcReactor from './ArcReactor';
import WeatherCard from './WeatherCard';
import NewsCard from './NewsCard';
import TasksCard, { Task } from './TasksCard';
import SystemStatus from './SystemStatus';
import ShareButton from './ShareButton';
import VoiceSelector, { VoiceType } from './VoiceSelector';
import { 
  getWeatherData, 
  getNewsData, 
  getInitialTasks, 
  getSystemStatus,
  getJarvisResponse 
} from '@/utils/mockData';
import {
  speak, 
  initSpeechRecognition, 
  startListening, 
  stopListening,
  getUserLocation,
  VoiceType as SpeechVoiceType
} from '@/utils/speechService';

const Jarvis: React.FC = () => {
  // State
  const [messages, setMessages] = useState<ChatMessageProps[]>([
    {
      type: 'system',
      content: 'Jarvis initialized. Ready to assist.',
      timestamp: new Date()
    },
    {
      type: 'assistant',
      content: "Hello, I'm Jarvis, your personal AI assistant. How may I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [weatherData, setWeatherData] = useState(getWeatherData());
  const [newsData, setNewsData] = useState(getNewsData());
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks());
  const [systemStatus, setSystemStatus] = useState(getSystemStatus());
  const [voiceType, setVoiceType] = useState<VoiceType>('female');
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Effects
  // Initialize speech recognition
  useEffect(() => {
    speechRecognitionRef.current = initSpeechRecognition(
      (transcript) => {
        handleUserMessage(transcript);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
    
    return () => {
      stopListening();
    };
  }, []);
  
  // Update system status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(getSystemStatus());
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Update weather data periodically to check for location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherData(getWeatherData());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Speak the latest assistant message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.type === 'assistant') {
      speak(lastMessage.content, voiceType);
    }
  }, [messages, voiceType]);
  
  // Event handlers
  const handleUserMessage = async (text: string) => {
    // Add user message
    const userMessage: ChatMessageProps = {
      type: 'user',
      content: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Add loading message
    const loadingId = uuidv4();
    setMessages(prev => [...prev, { 
      type: 'loading', 
      content: '', 
      timestamp: new Date() 
    }]);
    
    try {
      // Get AI response
      const response = await getJarvisResponse(text);
      
      // Update messages - replace loading with response
      setMessages(prev => prev.filter(msg => msg.type !== 'loading').concat({
        type: 'assistant',
        content: response,
        timestamp: new Date()
      }));
      
      // Update UI based on message content
      if (text.toLowerCase().includes('weather')) {
        setWeatherData(getWeatherData());
      }
      
      if (text.toLowerCase().includes('news')) {
        setNewsData(getNewsData());
      }
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages(prev => prev.filter(msg => msg.type !== 'loading').concat({
        type: 'assistant',
        content: "I apologize, but I'm having trouble processing your request at the moment.",
        timestamp: new Date()
      }));
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      const started = startListening();
      setIsListening(started);
      
      if (started) {
        setMessages(prev => [...prev, {
          type: 'system',
          content: 'Listening...',
          timestamp: new Date()
        }]);
      }
    }
  };
  
  const handleTaskToggle = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const handleTaskAdd = (text: string) => {
    setTasks(prev => [
      ...prev,
      { id: uuidv4(), text, completed: false }
    ]);
  };
  
  const handleTaskDelete = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };
  
  const handleVoiceChange = (newVoice: VoiceType) => {
    setVoiceType(newVoice);
    
    // Let the user know about the voice change
    const voiceDescription = newVoice === 'male' ? 'Deep' : 'Soft';
    const message = `Voice switched to ${voiceDescription} voice. How may I assist you?`;
    
    setMessages(prev => [...prev, {
      type: 'assistant',
      content: message,
      timestamp: new Date()
    }]);
  };
  
  return (
    <div className="flex flex-col h-screen bg-jarvis-dark text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-mesh-gradient z-0 opacity-90"></div>
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 border-b border-jarvis-muted/30 bg-jarvis-dark/80 backdrop-blur-sm">
        <div className="flex items-center">
          <ArcReactor className="mr-3" pulsate={true} />
          <div>
            <h1 className="text-xl font-bold jarvis-gradient-text">
              J.A.R.V.I.S.
            </h1>
            <p className="text-xs text-gray-400">Just A Rather Very Intelligent System</p>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Chat area */}
        <div className="flex-1 flex flex-col h-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-jarvis-muted scrollbar-track-transparent">
            <div className="max-w-3xl mx-auto space-y-3">
              {messages.map((message, index) => (
                <ChatMessage 
                  key={index} 
                  type={message.type} 
                  content={message.content} 
                  timestamp={message.timestamp} 
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Input area */}
          <div className="p-4 border-t border-jarvis-muted/30 bg-jarvis-dark/80 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto">
              <ChatInput 
                onSendMessage={handleUserMessage}
                isListening={isListening}
                onToggleListening={handleToggleListening}
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>
        
        {/* Side panel */}
        <aside className="w-80 border-l border-jarvis-muted/30 bg-jarvis-dark/80 backdrop-blur-sm hidden md:block overflow-y-auto p-4">
          <div className="space-y-4">
            <WeatherCard 
              temperature={weatherData.temperature}
              condition={weatherData.condition}
              location={weatherData.location}
              isLoading={weatherData.isLoading}
            />
            
            <VoiceSelector
              currentVoice={voiceType}
              onVoiceChange={handleVoiceChange}
            />
            
            <TasksCard 
              tasks={tasks}
              onTaskToggle={handleTaskToggle}
              onTaskAdd={handleTaskAdd}
              onTaskDelete={handleTaskDelete}
            />
            
            <NewsCard news={newsData} />
            
            <SystemStatus 
              cpuUsage={systemStatus.cpuUsage}
              memoryUsage={systemStatus.memoryUsage}
              networkStatus={systemStatus.networkStatus}
            />
          </div>
        </aside>
      </div>

      {/* Mobile bottom bar */}
      <div className="md:hidden flex justify-around items-center p-2 border-t border-jarvis-muted/30 bg-jarvis-dark/90 backdrop-blur-sm relative z-10">
        {messages.length > 1 && messages[messages.length - 1].type === 'assistant' && (
          <ShareButton messageToShare={messages[messages.length - 1].content} />
        )}
      </div>
    </div>
  );
};

export default Jarvis;
