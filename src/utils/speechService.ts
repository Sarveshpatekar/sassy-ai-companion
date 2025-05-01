
export const speak = (text: string, rate = 1, pitch = 1): Promise<void> => {
  return new Promise((resolve) => {
    // Cancel any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang === 'en-US' && voice.name.includes('Male')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Set parameters
    utterance.rate = rate;
    utterance.pitch = pitch;
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
