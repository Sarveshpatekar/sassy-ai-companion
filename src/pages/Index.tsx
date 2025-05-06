
import React from 'react';
import Jarvis from '@/components/Jarvis';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen w-full">
      <Alert className="max-w-3xl mx-auto my-4 bg-blue-950/40 text-white border-blue-800">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Backend Setup Required</AlertTitle>
        <AlertDescription className="text-sm">
          For full AI functionality, start the Python backend:<br />
          <code className="bg-blue-900/40 p-1 rounded">pip install -r requirements.txt</code><br />
          <code className="bg-blue-900/40 p-1 rounded">python app.py</code>
        </AlertDescription>
      </Alert>
      <Jarvis />
    </div>
  );
};

export default Index;
