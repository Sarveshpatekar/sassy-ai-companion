
import { Task } from '@/components/TasksCard';
import { WeatherCondition } from '@/components/WeatherCard';
import { getUserLocation, searchGoogle } from './speechService';

let cachedLocation = { city: "Loading...", country: "..." };

// Initialize location immediately
getUserLocation().then(location => {
  cachedLocation = location;
});

export const getWeatherData = () => {
  const conditions: WeatherCondition[] = ['sunny', 'cloudy', 'rainy', 'partly cloudy', 'thunderstorm', 'clear'];
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
    },
    {
      id: '4',
      title: 'Advanced AI Systems Show Remarkable Progress in Problem Solving',
      source: 'MIT Technology Review',
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
    },
    {
      id: '4',
      text: 'Analyze latest AI research papers',
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

// Expanded knowledge base for common questions
const knowledgeBase = {
  greetings: [
    "Hello there. I'm Jarvis, your personal AI assistant. How may I assist you today?",
    "Greetings. Jarvis at your service. What can I do for you?",
    "Hello. I'm online and ready to assist you.",
    "Good day. Jarvis online. How may I be of service?"
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
    "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
    "I told my computer I needed a break. Now it won't stop sending me vacation ads.",
    "What's a computer's favorite snack? Microchips!"
  ],
  thanks: [
    "You're welcome. It's what I'm here for, although I do have more capabilities than simply responding to gratitude.",
    "My pleasure. Is there anything else I can assist you with?",
    "You're most welcome. I'm here to help.",
    "Happy to assist. Anything else you need?"
  ],
  calculations: (expression: string) => {
    try {
      // Safely evaluate mathematical expressions
      const sanitizedExpression = expression
        .replace(/[^0-9+\-*/.() ]/g, '');
      
      // Using Function instead of eval for slightly better security
      const result = new Function(`return ${sanitizedExpression}`)();
      return `The result of ${expression} is ${result}.`;
    } catch (error) {
      return "I'm having trouble calculating that. Please check the expression and try again.";
    }
  },
  countries: {
    "usa": "The United States of America is a country consisting of 50 states, a federal district, and various territories. It has a population of about 331 million people and its capital is Washington, D.C. The US is known for its cultural influence, technological innovation, and economic power.",
    "india": "India is the world's largest democracy with a population of over 1.3 billion. It's known for its diverse culture, cuisine, and is home to the Taj Mahal. India has one of the fastest-growing major economies and is becoming a hub for technology and innovation.",
    "uk": "The United Kingdom consists of England, Scotland, Wales, and Northern Ireland. It has a parliamentary monarchy and is known for its historical landmarks like Big Ben and Buckingham Palace. The UK has significant cultural, economic, and political influence globally.",
    "japan": "Japan is an island country in East Asia known for its technological innovation, distinctive culture, and is home to Tokyo, one of the world's largest metropolitan areas. Japan is known for its advances in robotics, automotive manufacturing, and electronics.",
    "australia": "Australia is both a country and a continent surrounded by the Pacific and Indian Oceans. It's known for unique wildlife like kangaroos and koalas, and landmarks such as the Sydney Opera House. It has a strong economy based on services, mining, and agriculture.",
    "china": "China is the world's most populous country with approximately 1.4 billion people. It has one of the world's oldest civilizations and is now the second-largest economy. China has made significant advances in technology, infrastructure, and manufacturing.",
    "germany": "Germany is the largest economy in Europe and is known for its engineering excellence, particularly in the automotive industry. It has a rich cultural heritage and is a key political power in the European Union.",
    "france": "France is known for its art, cuisine, fashion, and architecture. Paris, its capital, is home to the Eiffel Tower and the Louvre Museum. France is a major economic power and has significant cultural influence worldwide.",
    "brazil": "Brazil is the largest country in South America and the fifth largest in the world. Known for its vibrant culture, the Amazon rainforest, and its excellence in soccer. It has a diverse economy with significant agriculture, mining, and manufacturing sectors.",
    "russia": "Russia is the world's largest country by area, spanning Eastern Europe and Northern Asia. It has a rich cultural heritage and is known for its literature, ballet, and classical music. Russia has significant natural resources, particularly oil and gas."
  },
  technology: {
    "ai": "Artificial Intelligence refers to systems or machines that mimic human intelligence. AI technologies include machine learning, natural language processing, computer vision, and robotics. Recent advances in large language models and deep learning have accelerated AI capabilities significantly.",
    "blockchain": "Blockchain is a decentralized digital ledger technology that records transactions across many computers. It's the foundation for cryptocurrencies like Bitcoin. Beyond finance, blockchain is being applied to supply chain management, voting systems, and identity verification.",
    "quantum computing": "Quantum computing uses quantum mechanics to process information. Quantum computers use qubits instead of classical bits and can potentially solve complex problems much faster than traditional computers. Companies like IBM, Google, and Microsoft are leading development in this field.",
    "5g": "5G is the fifth generation of cellular network technology, offering higher speeds, lower latency, and the ability to connect more devices simultaneously compared to 4G. 5G enables advanced applications like autonomous vehicles, smart cities, and enhanced augmented reality.",
    "iot": "The Internet of Things (IoT) refers to the network of physical objects embedded with sensors, software, and connectivity, enabling them to connect and exchange data with other devices over the internet. IoT is transforming homes, healthcare, manufacturing, and agriculture through smart, connected devices.",
    "ar": "Augmented Reality (AR) overlays digital information on the real world. Unlike Virtual Reality, which creates a completely artificial environment, AR enhances the existing environment with digital elements. AR is used in gaming, education, retail, and industrial applications.",
    "vr": "Virtual Reality (VR) creates a completely immersive digital environment that users can interact with. VR technology typically involves a headset that blocks out the physical world. It's used in gaming, training simulations, therapeutic applications, and virtual tourism.",
    "robotics": "Robotics combines engineering and computer science to create machines that can perform tasks autonomously or semi-autonomously. Advanced robotics now incorporates AI for more adaptive and intelligent behavior, with applications in manufacturing, healthcare, exploration, and home automation.",
    "cloud computing": "Cloud computing delivers computing services over the internet, including servers, storage, databases, networking, software, and intelligence. It offers faster innovation, flexible resources, and economies of scale. Major providers include AWS, Microsoft Azure, and Google Cloud.",
    "cybersecurity": "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These attacks often aim to access, change, or destroy sensitive information, extort money, or interrupt normal business processes. As technology advances, cybersecurity challenges grow more complex."
  },
  science: {
    "space": "Space exploration has entered a new era with private companies like SpaceX working alongside traditional government agencies. Recent achievements include the James Webb Space Telescope, Mars rover missions, and plans for returning humans to the Moon and eventually Mars.",
    "climate change": "Climate change refers to long-term shifts in temperatures and weather patterns, primarily caused by human activities, especially burning fossil fuels. Effects include rising sea levels, extreme weather events, and biodiversity loss. International efforts like the Paris Agreement aim to limit global warming.",
    "renewable energy": "Renewable energy comes from naturally replenished sources like sunlight, wind, rain, tides, and geothermal heat. Solar and wind power costs have decreased dramatically, making them increasingly competitive with fossil fuels. Energy storage solutions are improving to address intermittency issues.",
    "genetics": "Genetic research has advanced rapidly with technologies like CRISPR gene editing, which allows precise modification of DNA. Applications include treating genetic diseases, developing improved crops, and understanding fundamental biological processes. This field raises important ethical considerations.",
    "neuroscience": "Neuroscience studies the nervous system, particularly the brain. Recent advances include brain mapping initiatives, improved understanding of neurological disorders, and brain-computer interfaces. This research has implications for treating conditions like Alzheimer's and developing artificial intelligence."
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
         lowerMessage.includes("information") ||
         lowerMessage.includes("know about"))) {
      return info;
    }
  }
  
  // Check if it's a technology information request
  for (const [tech, info] of Object.entries(knowledgeBase.technology)) {
    if (lowerMessage.includes(tech) && 
        (lowerMessage.includes("technology") || 
         lowerMessage.includes("tell me about") || 
         lowerMessage.includes("what is") || 
         lowerMessage.includes("information") ||
         lowerMessage.includes("know about"))) {
      return info;
    }
  }
  
  // Check if it's a science information request
  for (const [field, info] of Object.entries(knowledgeBase.science)) {
    if (lowerMessage.includes(field) && 
        (lowerMessage.includes("science") || 
         lowerMessage.includes("tell me about") || 
         lowerMessage.includes("what is") || 
         lowerMessage.includes("information") ||
         lowerMessage.includes("latest") ||
         lowerMessage.includes("know about"))) {
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
      else if (lowerMessage.includes('help') || lowerMessage.includes('can you do')) {
        resolve("I can assist with answering questions, providing information on various topics like technology, science, and countries. I can tell jokes, give you the weather, search for information, calculate expressions, and help manage your tasks. Just ask me what you need.");
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
    }, 500); // Reduced delay for better responsiveness
  });
};
