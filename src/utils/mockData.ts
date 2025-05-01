
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

// Knowledge base for common questions
const knowledgeBase = {
  greetings: [
    "Hello there. I'm Jarvis, your personal AI assistant. How may I assist you today?",
    "Greetings. Jarvis at your service. What can I do for you?",
    "Hello. I'm online and ready to assist you."
  ],
  weather: (temperature: number, condition: string, location: string) => 
    `Currently, it's ${temperature}°C and ${condition} in ${location}. Would you like the extended forecast?`,
  time: () => {
    const now = new Date();
    return `It's currently ${now.toLocaleTimeString()}. Don't tell me you're late for another meeting.`;
  },
  news: "Today's headlines include Stark Industries' new clean energy initiative and advancements in AI technology. The world keeps turning while you're asking me questions.",
  jokes: [
    "Why don't scientists trust atoms? Because they make up everything.",
    "Why did the AI go to therapy? It had too many deep learning issues.",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem."
  ],
  thanks: [
    "You're welcome. It's what I'm here for, although I do have more capabilities than simply responding to gratitude.",
    "My pleasure. Is there anything else I can assist you with?",
    "You're most welcome. I'm here to help."
  ],
  calculations: (expression: string) => {
    try {
      // Safely evaluate mathematical expressions
      const sanitizedExpression = expression
        .replace(/[^0-9+\-*/.() ]/g, '')
        .replace(/[^0-9+\-*/.() ]/g, '');
      
      // Using Function instead of eval for slightly better security
      const result = new Function(`return ${sanitizedExpression}`)();
      return `The result of ${expression} is ${result}.`;
    } catch (error) {
      return "I'm having trouble calculating that. Please check the expression and try again.";
    }
  },
  countries: {
    "usa": "The United States of America is a country consisting of 50 states, a federal district, and various territories. It has a population of about 331 million people and its capital is Washington, D.C.",
    "india": "India is the world's largest democracy with a population of over 1.3 billion. It's known for its diverse culture, cuisine, and is home to the Taj Mahal.",
    "uk": "The United Kingdom consists of England, Scotland, Wales, and Northern Ireland. It has a parliamentary monarchy and is known for its historical landmarks like Big Ben and Buckingham Palace.",
    "japan": "Japan is an island country in East Asia known for its technological innovation, distinctive culture, and is home to Tokyo, one of the world's largest metropolitan areas.",
    "australia": "Australia is both a country and a continent surrounded by the Pacific and Indian Oceans. It's known for unique wildlife like kangaroos and koalas, and landmarks such as the Sydney Opera House."
  },
  technology: {
    "ai": "Artificial Intelligence refers to systems or machines that mimic human intelligence. AI technologies include machine learning, natural language processing, computer vision, and robotics.",
    "blockchain": "Blockchain is a decentralized digital ledger technology that records transactions across many computers. It's the foundation for cryptocurrencies like Bitcoin.",
    "quantum computing": "Quantum computing uses quantum mechanics to process information. Quantum computers use qubits instead of classical bits and can potentially solve complex problems much faster than traditional computers.",
    "5g": "5G is the fifth generation of cellular network technology, offering higher speeds, lower latency, and the ability to connect more devices simultaneously compared to 4G.",
    "iot": "The Internet of Things (IoT) refers to the network of physical objects embedded with sensors, software, and connectivity, enabling them to connect and exchange data with other devices over the internet."
  }
};

export const getJarvisResponse = async (message: string): Promise<string> => {
  // Check if it's a calculation
  const calculationMatch = message.match(/calculate\s+([\d+\-*/().]+)/i);
  if (calculationMatch) {
    return knowledgeBase.calculations(calculationMatch[1]);
  }
  
  // Check if it's a country information request
  const lowerMessage = message.toLowerCase();
  for (const [country, info] of Object.entries(knowledgeBase.countries)) {
    if (lowerMessage.includes(country) && 
        (lowerMessage.includes("country") || 
         lowerMessage.includes("tell me about") || 
         lowerMessage.includes("what is") || 
         lowerMessage.includes("information"))) {
      return info;
    }
  }
  
  // Check if it's a technology information request
  for (const [tech, info] of Object.entries(knowledgeBase.technology)) {
    if (lowerMessage.includes(tech) && 
        (lowerMessage.includes("technology") || 
         lowerMessage.includes("tell me about") || 
         lowerMessage.includes("what is") || 
         lowerMessage.includes("information"))) {
      return info;
    }
  }
  
  // Check if it's a question or search query that needs external search
  const isQuestion = /who|what|when|where|why|how|can you|tell me about|search for|find|look up/i.test(message);
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
        const randomGreeting = knowledgeBase.greetings[Math.floor(Math.random() * knowledgeBase.greetings.length)];
        resolve(randomGreeting);
      } 
      else if (lowerMessage.includes('weather')) {
        const { temperature, condition, location } = getWeatherData();
        resolve(knowledgeBase.weather(temperature, condition, location));
      }
      else if (lowerMessage.includes('time')) {
        resolve(knowledgeBase.time());
      }
      else if (lowerMessage.includes('news')) {
        resolve(knowledgeBase.news);
      }
      else if (lowerMessage.includes('joke') || lowerMessage.includes('funny')) {
        const randomJoke = knowledgeBase.jokes[Math.floor(Math.random() * knowledgeBase.jokes.length)];
        resolve(randomJoke);
      }
      else if (lowerMessage.includes('thank')) {
        const randomThanks = knowledgeBase.thanks[Math.floor(Math.random() * knowledgeBase.thanks.length)];
        resolve(randomThanks);
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
