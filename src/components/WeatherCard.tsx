
import React from 'react';
import { Cloud, CloudRain, Sun, CloudSun, CloudLightning, Thermometer, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'partly cloudy' | 'thunderstorm' | 'clear';

interface WeatherCardProps {
  temperature: number;
  condition: WeatherCondition;
  location: string;
  className?: string;
  isLoading?: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  condition,
  location,
  className,
  isLoading = false
}) => {
  const getWeatherIcon = () => {
    switch (condition) {
      case 'sunny':
      case 'clear':
        return <Sun className="h-8 w-8 text-yellow-400" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-300" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-300" />;
      case 'partly cloudy':
        return <CloudSun className="h-8 w-8 text-gray-300" />;
      case 'thunderstorm':
        return <CloudLightning className="h-8 w-8 text-blue-300" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-400" />;
    }
  };

  return (
    <div className={cn("jarvis-card flex flex-col", className)}>
      <div className="flex justify-between items-center mb-2 z-10">
        <h3 className="text-sm font-semibold text-gray-300">Weather</h3>
        {isLoading ? <Loader2 className="h-8 w-8 text-jarvis-secondary animate-spin" /> : getWeatherIcon()}
      </div>

      <div className="flex items-center gap-2 z-10">
        <Thermometer className="h-5 w-5 text-jarvis-secondary" />
        <span className="text-2xl font-bold">{temperature}°C</span>
      </div>
      
      <p className="text-sm text-gray-400 mt-1 z-10">
        {isLoading ? "Getting location..." : location}
      </p>
    </div>
  );
};

export default WeatherCard;
