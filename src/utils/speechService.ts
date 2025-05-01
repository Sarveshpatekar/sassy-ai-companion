
export type VoiceType = 'male' | 'female';

export const speak = (text: string, voiceType: VoiceType = 'male', rate = 1, pitch = 1): Promise<void> => {
  return new Promise((resolve) => {
    // Cancel any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    
    // Find appropriate voice based on type
    const preferredVoice = voices.find(voice => {
      if (voiceType === 'male') {
        return voice.lang.includes('en') && (voice.name.includes('Male') || voice.name.includes('Google UK English Male'));
      } else {
        return voice.lang.includes('en') && (voice.name.includes('Female') || voice.name.includes('Google UK English Female'));
      }
    }) || voices.find(voice => voice.lang.includes('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Set parameters
    utterance.rate = rate;
    utterance.pitch = voiceType === 'female' ? pitch * 1.2 : pitch; // Slightly higher pitch for female voice
    utterance.volume = 1;
    
    // Add event listeners
    utterance.onend = () => {
      resolve();
    };
    
    utterance.onerror = () => {
      resolve();
    };
    
    // Speak
    window.speechSynthesis.speak(utterance);
  });
};

// Initialize speech recognition
let recognition: SpeechRecognition | null = null;

export const initSpeechRecognition = (
  onResult: (transcript: string) => void,
  onEnd: () => void
): SpeechRecognition | null => {
  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };
      
      recognition.onend = () => {
        onEnd();
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        onEnd();
      };
      
      return recognition;
    }
  } catch (error) {
    console.error('Speech recognition not supported', error);
  }
  
  return null;
};

export const startListening = (): boolean => {
  if (recognition) {
    try {
      recognition.start();
      return true;
    } catch (error) {
      console.error('Error starting speech recognition', error);
      return false;
    }
  }
  return false;
};

export const stopListening = (): void => {
  if (recognition) {
    try {
      recognition.stop();
    } catch (error) {
      console.error('Error stopping speech recognition', error);
    }
  }
};

// Get user location
export const getUserLocation = (): Promise<{city: string, country: string}> => {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Use reverse geocoding to get location name
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
            );
            
            if (response.ok) {
              const data = await response.json();
              const city = data.address.city || 
                          data.address.town || 
                          data.address.village || 
                          data.address.suburb ||
                          "Unknown";
              const country = data.address.country || "Unknown";
              
              resolve({ city, country });
            } else {
              resolve({ city: "Unknown", country: "Location" });
            }
          } catch (error) {
            console.error("Error getting location name:", error);
            resolve({ city: "Unknown", country: "Location" });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          resolve({ city: "Unknown", country: "Location" });
        }
      );
    } else {
      resolve({ city: "Unknown", country: "Location" });
    }
  });
};

// Search Google for information
export const searchGoogle = async (query: string): Promise<string> => {
  try {
    // Using a free search API service
    const response = await fetch(`https://serpapi.com/search?q=${encodeURIComponent(query)}&api_key=demo`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }
    
    const data = await response.json();
    
    // Extract relevant information from search results
    if (data.organic_results && data.organic_results.length > 0) {
      const firstResult = data.organic_results[0];
      return `According to search results: ${firstResult.snippet || firstResult.title}`;
    } else if (data.knowledge_graph) {
      return `${data.knowledge_graph.title}: ${data.knowledge_graph.description}`;
    } else {
      return "I couldn't find specific information about that. Would you like me to try a different search?";
    }
  } catch (error) {
    console.error('Error searching for information:', error);
    return "I apologize, but I'm having trouble connecting to search services right now. Is there anything else I can help with?";
  }
};
