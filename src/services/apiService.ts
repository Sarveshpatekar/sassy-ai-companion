
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface ScrapeResponse {
  title: string;
  description: string;
  headings: string[];
  content: string[];
  links: { text: string; url: string }[];
}

export interface ChatResponse {
  response: string;
  source?: string;
  url?: string;
}

export interface TextAnalysisResponse {
  analysis: {
    sentiment: string;
    length: number;
    words: number;
    summary: string;
  };
}

export interface ModelChangeResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const ApiService = {
  // Health check to see if the backend is running
  checkHealth: async (): Promise<{ status: string; message: string; model?: {loaded: boolean; name: string} }> => {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  },
  
  // Web scraping
  scrapeWebsite: async (url: string): Promise<ScrapeResponse> => {
    const response = await axios.post(`${API_BASE_URL}/scrape`, { url });
    return response.data;
  },
  
  // Text analysis
  analyzeText: async (text: string): Promise<TextAnalysisResponse> => {
    const response = await axios.post(`${API_BASE_URL}/analyze-text`, { text });
    return response.data;
  },
  
  // Chat with Jarvis AI
  sendChatMessage: async (message: string): Promise<ChatResponse> => {
    const response = await axios.post(`${API_BASE_URL}/chat`, { message });
    return response.data;
  },
  
  // Change the AI model
  changeModel: async (model: string): Promise<ModelChangeResponse> => {
    const response = await axios.post(`${API_BASE_URL}/change-model`, { model });
    return response.data;
  }
};

export default ApiService;
