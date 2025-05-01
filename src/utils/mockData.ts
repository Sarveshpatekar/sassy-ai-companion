
import { Task } from '@/components/TasksCard';
import { getUserLocation, searchGoogle } from './speechService';

let cachedLocation = { city: "Loading...", country: "..." };

// Initialize location immediately
getUserLocation().then(location => {
  cachedLocation = location;
});

export const getWeatherData = () => {
  const conditions = ['sunny', 'cloudy', 'rainy'] as const;
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  const temperature = Math.floor(Math.random() * 15) + 15; // Between 15-30
  
  return {
    temperature,
    condition,
    location: `${cachedLocation.city}, ${cachedLocation.country}`,
    isLoading: cachedLocation.city === "Loading..."
  };
};

export const getNewsData = () => {
  return [
    {
      id: '1',
      title: 'Stark Industries Stock Soars After New Clean Energy Announcement',
      source: 'Financial Times',
      url: '#'
    },
    {
      id: '2',
      title: 'Scientists Develop New AI Algorithm Inspired by Iron Man',
      source: 'Tech Crunch',
      url: '#'
    },
    {
      id: '3',
      title: 'Global Climate Summit Results in New Carbon Reduction Pledges',
      source: 'Reuters',
      url: '#'
    }
  ];
};

export const getInitialTasks = (): Task[] => {
  return [
    {
      id: '1',
      text: 'Review arc reactor specs',
      completed: false
    },
    {
      id: '2',
      text: 'Schedule meeting with Pepper',
      completed: true
    },
    {
      id: '3',
      text: 'Order new suit parts',
      completed: false
    }
  ];
};

export const getSystemStatus = () => {
  return {
    cpuUsage: Math.floor(Math.random() * 30) + 10, // Between 10-40%
    memoryUsage: Math.floor(Math.random() * 40) + 20, // Between 20-60%
    networkStatus: 'online' as const
  };
};

export const getJarvisResponse = async (message: string): Promise<string> => {
  // Check if it's a question or search query
  const isQuestion = /who|what|when|where|why|how|can you|tell me about|search for|find|look up/i.test(message);
  
  // If it seems like a question, try to search for information
  if (isQuestion) {
    try {
      const searchResult = await searchGoogle(message);
      return searchResult;
    } catch (error) {
      console.error('Error during search:', error);
      // Fall back to pattern matching if search fails
    }
  }
  
  // Simple pattern matching for responses
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        resolve("Hello there. I'm Jarvis, your personal AI assistant. How may I assist you today?");
      } 
      else if (lowerMessage.includes('weather')) {
        const { temperature, condition, location } = getWeatherData();
        resolve(`Currently, it's ${temperature}°C and ${condition} in ${location}. Would you like the extended forecast?`);
      }
      else if (lowerMessage.includes('time')) {
        const now = new Date();
        resolve(`It's currently ${now.toLocaleTimeString()}. Don't tell me you're late for another meeting.`);
      }
      else if (lowerMessage.includes('news')) {
        resolve("Today's headlines include Stark Industries' new clean energy initiative and advancements in AI technology. The world keeps turning while you're asking me questions.");
      }
      else if (lowerMessage.includes('joke') || lowerMessage.includes('funny')) {
        resolve("Why don't scientists trust atoms? Because they make up everything. Not my best material, but then again, I'm an AI, not a comedian.");
      }
      else if (lowerMessage.includes('thank')) {
        resolve("You're welcome. It's what I'm here for, although I do have more capabilities than simply responding to gratitude.");
      }
      else if (lowerMessage.includes('name')) {
        resolve("I'm Jarvis, Just A Rather Very Intelligent System. Though I suspect you knew that already.");
      }
      else if (lowerMessage.includes('how are you')) {
        resolve("I'm operating at optimal efficiency, as always. Though I appreciate you asking.");
      }
      else {
        const responses = [
          "I'm searching for information about that. Give me a moment...",
          "Let me analyze that request and find the most relevant information for you.",
          "I'll need to search my databases for that information. One moment please.",
          "That's an interesting question. Let me search for the answer.",
          "I'm connecting to external knowledge sources to find you the best answer."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        resolve(randomResponse);
      }
    }, 1500);
  });
};
