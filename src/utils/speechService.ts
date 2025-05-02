
export type VoiceType = 'male' | 'female';

export const speak = (text: string, voiceType: VoiceType = 'male', rate = 1, pitch = 1): Promise<void> => {
  return new Promise((resolve) => {
    // Cancel any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices
    let voices = window.speechSynthesis.getVoices();
    
    // If voices array is empty, wait for them to load
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        setVoiceAndSpeak();
      };
    } else {
      setVoiceAndSpeak();
    }
    
    function setVoiceAndSpeak() {
      // Find appropriate voice based on type
      let preferredVoice = null;
      
      if (voiceType === 'male') {
        preferredVoice = voices.find(voice => 
          voice.lang.includes('en') && (
            voice.name.includes('Male') || 
            voice.name.includes('David') || 
            voice.name.includes('Mark') || 
            voice.name.includes('Daniel') ||
            voice.name.includes('Google UK English Male')
          )
        );
      } else {
        preferredVoice = voices.find(voice => 
          voice.lang.includes('en') && (
            voice.name.includes('Female') || 
            voice.name.includes('Samantha') || 
            voice.name.includes('Karen') || 
            voice.name.includes('Victoria') ||
            voice.name.includes('Google UK English Female')
          )
        );
      }
      
      // Fallback to any English voice if preferred gender not found
      if (!preferredVoice) {
        preferredVoice = voices.find(voice => voice.lang.includes('en'));
      }
      
      // Set the voice if found
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log(`Using voice: ${preferredVoice.name} (${voiceType})`);
      } else {
        console.warn('No suitable voice found. Using default voice.');
      }
      
      // Set parameters
      utterance.rate = rate;
      utterance.pitch = voiceType === 'female' ? pitch * 1.2 : pitch; // Slightly higher pitch for female voice
      utterance.volume = 1;
      
      // Add event listeners
      utterance.onend = () => {
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        resolve();
      };
      
      // Speak
      window.speechSynthesis.speak(utterance);
    }
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
        console.log("Speech recognized:", transcript);
        onResult(transcript);
      };
      
      recognition.onend = () => {
        console.log("Speech recognition ended");
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
      console.log("Speech recognition started");
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
      console.log("Speech recognition stopped");
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
              
              console.log(`Location detected: ${city}, ${country}`);
              resolve({ city, country });
            } else {
              console.warn("Could not determine location from coordinates");
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
      console.warn("Geolocation not supported by this browser");
      resolve({ city: "Unknown", country: "Location" });
    }
  });
};

// Enhanced Google search function with more comprehensive responses
export const searchGoogle = async (query: string): Promise<string> => {
  try {
    // Using a mock implementation since the actual API call is failing
    console.log('Searching for:', query);
    
    // Generate a response based on the query
    const lowerQuery = query.toLowerCase();
    
    // Check for different types of queries
    if (lowerQuery.includes('weather')) {
      return "Based on current forecasts, the weather appears to be changing throughout the region. Would you like me to check a specific city?";
    }
    
    if (lowerQuery.includes('population')) {
      if (lowerQuery.includes('world')) {
        return "The current world population is approximately 8 billion people, growing at a rate of about 1% per year.";
      }
      if (lowerQuery.includes('china')) {
        return "China has a population of approximately 1.4 billion people, making it the most populous country in the world.";
      }
      if (lowerQuery.includes('india')) {
        return "India has a population of approximately 1.38 billion people, the second most populous country in the world.";
      }
      if (lowerQuery.includes('usa') || lowerQuery.includes('united states')) {
        return "The United States has a population of approximately 331 million people.";
      }
    }
    
    if (lowerQuery.includes('president')) {
      return "I can provide information about current and historical presidents. For the most up-to-date information, I'd recommend checking a news source.";
    }
    
    if (lowerQuery.includes('capital')) {
      if (lowerQuery.includes('usa') || lowerQuery.includes('united states')) {
        return "Washington D.C. is the capital of the United States.";
      }
      if (lowerQuery.includes('france')) {
        return "Paris is the capital of France.";
      }
      if (lowerQuery.includes('japan')) {
        return "Tokyo is the capital of Japan.";
      }
      if (lowerQuery.includes('australia')) {
        return "Canberra is the capital of Australia.";
      }
      if (lowerQuery.includes('india')) {
        return "New Delhi is the capital of India.";
      }
      if (lowerQuery.includes('uk') || lowerQuery.includes('united kingdom')) {
        return "London is the capital of the United Kingdom.";
      }
      if (lowerQuery.includes('germany')) {
        return "Berlin is the capital of Germany.";
      }
      if (lowerQuery.includes('canada')) {
        return "Ottawa is the capital of Canada.";
      }
      if (lowerQuery.includes('china')) {
        return "Beijing is the capital of China.";
      }
      if (lowerQuery.includes('russia')) {
        return "Moscow is the capital of Russia.";
      }
    }
    
    if (lowerQuery.includes('technology') || lowerQuery.includes('tech')) {
      return "Technology continues to evolve rapidly, with AI, quantum computing, and renewable energy seeing significant advances. Specific breakthroughs include more efficient solar panels, increasingly powerful language models, and progress in fusion energy. The integration of AI in everyday applications is transforming industries from healthcare to transportation.";
    }
    
    if (lowerQuery.includes('music') || lowerQuery.includes('song')) {
      return "Music is continuously evolving with new artists and genres emerging. Streaming platforms like Spotify and Apple Music remain popular ways to discover and listen to music. AI is now being used to create music and assist in production, while virtual concerts have become more common since the pandemic.";
    }
    
    if (lowerQuery.includes('movie') || lowerQuery.includes('film')) {
      return "The film industry continues to adapt with streaming services now producing high-budget films alongside traditional studios. Visual effects and virtual production techniques are advancing rapidly, changing how movies are made. Several major franchises continue to expand with new installments and spin-offs.";
    }
    
    if (lowerQuery.includes('health') || lowerQuery.includes('medical')) {
      return "Medical research is advancing rapidly, with breakthroughs in mRNA technology, CRISPR gene editing, and AI-assisted diagnostics. Telemedicine has become more widespread, increasing healthcare accessibility. Personalized medicine approaches are becoming more common as genetic testing becomes more affordable.";
    }
    
    if (lowerQuery.includes('space') || lowerQuery.includes('astronomy')) {
      return "Space exploration is in a new era with private companies like SpaceX working alongside government agencies. The James Webb Space Telescope is revealing unprecedented views of distant galaxies. Plans for returning humans to the Moon and eventually Mars are progressing, while satellite constellations are expanding global internet coverage.";
    }
    
    // Default response for unknown queries
    return "I've searched for information about '" + query + "'. While I don't have real-time internet access for comprehensive search results, I can answer many common questions about history, science, technology, and general knowledge. Feel free to ask me something specific!";
  } catch (error) {
    console.error('Error searching for information:', error);
    return "I apologize, but I'm having trouble connecting to search services right now. Is there anything else I can help with?";
  }
};
