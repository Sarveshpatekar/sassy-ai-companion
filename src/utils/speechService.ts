export type VoiceType = 'male' | 'female';

export const speak = (text: string, voiceType: VoiceType = 'male', rate = 1, pitch = 1): Promise<void> => {
  return new Promise((resolve) => {
    // Cancel any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice
    const voices = window.speechSynthesis.getVoices();
    
    // Find appropriate voice based on type
    const preferredVoice = voices.find(voice => {
      if (voiceType === 'male') {
        return voice.lang === 'en-US' && voice.name.includes('Male');
      } else {
        return voice.lang === 'en-US' && voice.name.includes('Female');
      }
    });
    
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
