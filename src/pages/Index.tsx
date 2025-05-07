
import React, { useState, useEffect } from 'react';
import Jarvis from '@/components/Jarvis';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import ApiService from '@/services/apiService';

const Index = () => {
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [checkingBackend, setCheckingBackend] = useState<boolean>(true);
  const [modelInfo, setModelInfo] = useState<{loaded: boolean; name: string | null}>({
    loaded: false,
    name: null
  });

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await ApiService.checkHealth();
        setBackendConnected(true);
        if (response.model) {
          setModelInfo(response.model);
        }
      } catch (error) {
        console.error('Backend connection failed:', error);
        setBackendConnected(false);
      } finally {
        setCheckingBackend(false);
      }
    };
    
    checkBackendStatus();

    // Check status periodically
    const interval = setInterval(checkBackendStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full">
      {!backendConnected && !checkingBackend && (
        <Alert className="max-w-3xl mx-auto my-4 bg-blue-950/40 text-white border-blue-800">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Backend Setup Required</AlertTitle>
          <AlertDescription className="text-sm">
            For full AI functionality, start the Python backend:<br />
            <code className="bg-blue-900/40 p-1 rounded">pip install -r requirements.txt</code><br />
            <code className="bg-blue-900/40 p-1 rounded">python app.py</code>
          </AlertDescription>
        </Alert>
      )}
      <Jarvis initialModelInfo={modelInfo} />
    </div>
  );
};

export default Index;
