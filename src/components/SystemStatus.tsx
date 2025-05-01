
import React from 'react';
import { Activity, Cpu, HardDrive, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemStatusProps {
  cpuUsage: number;
  memoryUsage: number;
  networkStatus: 'online' | 'offline' | 'limited';
  className?: string;
}

const SystemStatus: React.FC<SystemStatusProps> = ({
  cpuUsage,
  memoryUsage,
  networkStatus,
  className
}) => {
  const getNetworkIcon = () => {
    switch (networkStatus) {
      case 'online':
        return <Wifi className="h-4 w-4 text-jarvis-accent" />;
      case 'offline':
        return <Wifi className="h-4 w-4 text-jarvis-secondary" />;
      case 'limited':
        return <Wifi className="h-4 w-4 text-yellow-400" />;
    }
  };

  return (
    <div className={cn("jarvis-card", className)}>
      <div className="flex items-center gap-2 mb-3 z-10">
        <Activity className="h-5 w-5 text-jarvis-primary" />
        <h3 className="text-sm font-semibold text-gray-300">System Status</h3>
      </div>
      
      <div className="space-y-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-jarvis-primary" />
            <span className="text-xs text-gray-300">CPU</span>
          </div>
          <div className="w-2/3 bg-jarvis-muted/50 h-2 rounded-full">
            <div 
              className="bg-gradient-to-r from-jarvis-primary to-jarvis-secondary h-2 rounded-full"
              style={{ width: `${cpuUsage}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-400">{cpuUsage}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-jarvis-secondary" />
            <span className="text-xs text-gray-300">Memory</span>
          </div>
          <div className="w-2/3 bg-jarvis-muted/50 h-2 rounded-full">
            <div 
              className="bg-gradient-to-r from-jarvis-secondary to-jarvis-accent h-2 rounded-full"
              style={{ width: `${memoryUsage}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-400">{memoryUsage}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getNetworkIcon()}
            <span className="text-xs text-gray-300">Network</span>
          </div>
          <span className="text-xs capitalize text-gray-400">{networkStatus}</span>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
