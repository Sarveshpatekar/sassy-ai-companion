
import React from 'react';
import { Cloud, CloudRain, Sun, Thermometer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherCardProps {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  location: string;
  className?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  condition,
  location,
  className
}) => {
  const getWeatherIcon = () => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-400" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-300" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-300" />;
    }
  };

  return (
    <div className={cn("jarvis-card flex flex-col", className)}>
      <div className="flex justify-between items-center mb-2 z-10">
        <h3 className="text-sm font-semibold text-gray-300">Weather</h3>
        {getWeatherIcon()}
      </div>

      <div className="flex items-center gap-2 z-10">
        <Thermometer className="h-5 w-5 text-jarvis-secondary" />
        <span className="text-2xl font-bold">{temperature}°C</span>
      </div>
      
      <p className="text-sm text-gray-400 mt-1 z-10">{location}</p>
    </div>
  );
};

export default WeatherCard;
