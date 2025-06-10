import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Battery, Zap, Wifi } from 'lucide-react';

interface RobotFaceProps {
  currentExpression: string;
  onSoundToggle: (enabled: boolean) => void;
  soundEnabled: boolean;
  confidence: number;
}

const RobotFace: React.FC<RobotFaceProps> = ({ currentExpression, onSoundToggle, soundEnabled, confidence }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [eyeAnimation, setEyeAnimation] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isCharging, setIsCharging] = useState(false);
  const [powerConsumption, setPowerConsumption] = useState(12.5);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentExpression]);

  useEffect(() => {
    const eyeAnimations = ['blink', 'wink-left', 'wink-right', 'wide', 'squint'];
    const interval = setInterval(() => {
      const randomAnimation = eyeAnimations[Math.floor(Math.random() * eyeAnimations.length)];
      setEyeAnimation(randomAnimation);
      setTimeout(() => setEyeAnimation(''), 300);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Battery simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => {
        if (isCharging) {
          return Math.min(100, prev + 0.5);
        } else {
          // Higher power consumption during active expressions
          const consumptionRate = currentExpression !== 'neutral' ? 0.3 : 0.1;
          return Math.max(0, prev - consumptionRate);
        }
      });

      // Auto-charge when battery gets low
      if (batteryLevel <= 20 && !isCharging) {
        setIsCharging(true);
      } else if (batteryLevel >= 95 && isCharging) {
        setIsCharging(false);
      }

      // Update power consumption based on activity
      setPowerConsumption(prev => {
        const baseConsumption = 8.0;
        const expressionBonus = currentExpression !== 'neutral' ? 4.5 : 0;
        const chargingBonus = isCharging ? 15.0 : 0;
        return baseConsumption + expressionBonus + chargingBonus + (Math.random() * 2 - 1);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [batteryLevel, isCharging, currentExpression]);

  const getExpressionStyles = () => {
    switch (currentExpression) {
      case 'happy':
        return {
          eyeColor: '#10B981',
          mouthPath: 'M 30 45 Q 50 60 70 45',
          eyeSize: 12,
          glowColor: '#10B981'
        };
      case 'sad':
        return {
          eyeColor: '#3B82F6',
          mouthPath: 'M 30 55 Q 50 40 70 55',
          eyeSize: 10,
          glowColor: '#3B82F6'
        };
      case 'surprised':
        return {
          eyeColor: '#F59E0B',
          mouthPath: 'M 45 45 Q 50 55 55 45',
          eyeSize: 16,
          glowColor: '#F59E0B'
        };
      case 'angry':
        return {
          eyeColor: '#EF4444',
          mouthPath: 'M 35 50 L 65 50',
          eyeSize: 8,
          glowColor: '#EF4444'
        };
      case 'excited':
        return {
          eyeColor: '#8B5CF6',
          mouthPath: 'M 25 40 Q 50 70 75 40',
          eyeSize: 14,
          glowColor: '#8B5CF6'
        };
      default:
        return {
          eyeColor: '#6B7280',
          mouthPath: 'M 35 50 L 65 50',
          eyeSize: 12,
          glowColor: '#6B7280'
        };
    }
  };

  const styles = getExpressionStyles();

  const getEyeTransform = (isLeft: boolean) => {
    switch (eyeAnimation) {
      case 'blink':
        return 'scaleY(0.1)';
      case 'wink-left':
        return isLeft ? 'scaleY(0.1)' : 'scaleY(1)';
      case 'wink-right':
        return isLeft ? 'scaleY(1)' : 'scaleY(0.1)';
      case 'wide':
        return 'scale(1.3)';
      case 'squint':
        return 'scaleY(0.6) scaleX(0.8)';
      default:
        return 'scaleY(1)';
    }
  };

  const getBatteryColor = () => {
    if (batteryLevel > 60) return 'text-green-400';
    if (batteryLevel > 30) return 'text-yellow-400';
    if (batteryLevel > 15) return 'text-orange-400';
    return 'text-red-400';
  };

  const getBatteryBarColor = () => {
    if (batteryLevel > 60) return 'bg-green-400';
    if (batteryLevel > 30) return 'bg-yellow-400';
    if (batteryLevel > 15) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className="h-full bg-gray-800 rounded-xl flex flex-col relative overflow-hidden">
      {/* Robot Head Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900"></div>
      
      {/* Circuit Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <pattern id="circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20h40M20 0v40" stroke="#10B981" strokeWidth="0.5" fill="none"/>
              <circle cx="20" cy="20" r="2" fill="#10B981"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)"/>
        </svg>
      </div>

      {/* Top Controls Row */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
        {/* Battery Status */}
        <div className="bg-black bg-opacity-60 rounded-lg px-3 py-2">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {isCharging ? (
                <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
              ) : (
                <Battery className="w-4 h-4 text-gray-400" />
              )}
              <span className={`text-xs font-bold ${getBatteryColor()}`}>
                {batteryLevel.toFixed(1)}%
              </span>
            </div>
            <div className="w-12 h-2 bg-gray-600 rounded-full">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${getBatteryBarColor()}`}
                style={{ width: `${batteryLevel}%` }}
              ></div>
            </div>
          </div>
          <div className="text-xs text-gray-300 mt-1">
            {isCharging ? 'Charging' : `${powerConsumption.toFixed(1)}W`}
          </div>
        </div>

        {/* Sound Control */}
        <button
          onClick={() => onSoundToggle(!soundEnabled)}
          className="p-2 bg-black bg-opacity-60 rounded-full hover:bg-opacity-80 transition-colors text-white"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Expression and Confidence Display */}
      <div className="absolute top-16 left-4 z-10">
        <div className="bg-black bg-opacity-60 rounded-lg px-4 py-2">
          <div className="flex items-center space-x-3">
            <div>
              <span className="text-white text-sm font-medium capitalize">
                {currentExpression}
              </span>
              <div className="flex items-center space-x-2 mt-1">
                <Wifi className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-gray-300">
                  {confidence.toFixed(1)}% confidence
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Robot Face */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className={`relative transition-all duration-500 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
          {/* Head Glow Effect */}
          <div 
            className="absolute inset-0 rounded-full blur-xl opacity-30 transition-colors duration-500"
            style={{ backgroundColor: styles.glowColor }}
          ></div>
          
          {/* Main Head */}
          <div className="relative w-64 h-64 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full border-4 border-gray-500 shadow-2xl">
            {/* Head Details */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gray-400 rounded-full"></div>
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
            
            {/* Eyes */}
            <div className="absolute top-20 left-16 right-16 flex justify-between">
              <div 
                className="relative transition-all duration-200"
                style={{ transform: getEyeTransform(true) }}
              >
                <div 
                  className="rounded-full transition-all duration-500 shadow-lg"
                  style={{ 
                    width: styles.eyeSize * 2, 
                    height: styles.eyeSize * 2, 
                    backgroundColor: styles.eyeColor,
                    boxShadow: `0 0 20px ${styles.eyeColor}` 
                  }}
                ></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
              </div>
              
              <div 
                className="relative transition-all duration-200"
                style={{ transform: getEyeTransform(false) }}
              >
                <div 
                  className="rounded-full transition-all duration-500 shadow-lg"
                  style={{ 
                    width: styles.eyeSize * 2, 
                    height: styles.eyeSize * 2, 
                    backgroundColor: styles.eyeColor,
                    boxShadow: `0 0 20px ${styles.eyeColor}` 
                  }}
                ></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Nose/Sensor */}
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-3 h-6 bg-gray-400 rounded-full"></div>

            {/* Mouth */}
            <div className="absolute top-40 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg width="100" height="40" className="overflow-visible">
                <path
                  d={styles.mouthPath}
                  stroke={styles.eyeColor}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className="transition-all duration-500"
                  style={{ filter: `drop-shadow(0 0 5px ${styles.eyeColor})` }}
                />
              </svg>
            </div>

            {/* Side Panels with Enhanced Indicators */}
            <div className="absolute top-24 -left-2 w-4 h-16 bg-gray-600 rounded-l-lg border-2 border-gray-500">
              <div className={`w-full h-2 rounded-full mt-2 ${batteryLevel > 75 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
              <div className={`w-full h-2 rounded-full mt-2 ${isCharging ? 'bg-yellow-400 animate-pulse' : 'bg-gray-500'}`}></div>
              <div className={`w-full h-2 rounded-full mt-2 ${confidence > 70 ? 'bg-blue-400 animate-pulse' : 'bg-gray-500'}`}></div>
            </div>
            
            <div className="absolute top-24 -right-2 w-4 h-16 bg-gray-600 rounded-r-lg border-2 border-gray-500">
              <div className={`w-full h-2 rounded-full mt-2 ${currentExpression !== 'neutral' ? 'bg-purple-400 animate-pulse' : 'bg-gray-500'}`}></div>
              <div className={`w-full h-2 rounded-full mt-2 ${soundEnabled ? 'bg-pink-400 animate-pulse' : 'bg-gray-500'}`}></div>
              <div className="w-full h-2 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Status Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-4 bg-black bg-opacity-60 rounded-full px-6 py-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-medium">ACTIVE</span>
          </div>
          <div className="w-px h-4 bg-gray-500"></div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isCharging ? 'bg-yellow-400 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-white text-xs font-medium">
              {isCharging ? 'CHARGING' : 'BATTERY'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotFace;
