import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, Settings, Maximize2, Activity } from 'lucide-react';

interface CameraFeedProps {
  onExpressionDetected: (expression: string, confidence: number) => void;
  confidenceThreshold: number;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onExpressionDetected, confidenceThreshold }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConfidence, setCurrentConfidence] = useState(0);
  const [detectionCount, setDetectionCount] = useState(0);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Camera access denied or not available');
      setIsActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsActive(false);
    }
  };

  const toggleCamera = () => {
    if (isActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Enhanced expression detection simulation with confidence levels
  useEffect(() => {
    if (!isActive) return;

    const expressions = ['happy', 'sad', 'surprised', 'angry', 'neutral', 'excited'];
    const interval = setInterval(() => {
      const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
      const confidence = Math.random() * 100; // 0-100% confidence
      
      setCurrentConfidence(confidence);
      setDetectionCount(prev => prev + 1);
      
      // Only trigger if confidence meets threshold
      if (confidence >= confidenceThreshold) {
        onExpressionDetected(randomExpression, confidence);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, onExpressionDetected, confidenceThreshold]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    if (confidence >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getConfidenceBarColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-400';
    if (confidence >= 60) return 'bg-yellow-400';
    if (confidence >= 40) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className="h-full bg-gray-900 rounded-xl overflow-hidden relative group">
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center space-x-2 bg-black bg-opacity-60 rounded-full px-3 py-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-white text-sm font-medium">
            {isActive ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Confidence Level Display */}
      {isActive && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black bg-opacity-60 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-3">
              <Activity className="w-4 h-4 text-blue-400" />
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-white text-xs font-medium">Confidence:</span>
                  <span className={`text-xs font-bold ${getConfidenceColor(currentConfidence)}`}>
                    {currentConfidence.toFixed(1)}%
                  </span>
                </div>
                <div className="w-20 h-1 bg-gray-600 rounded-full mt-1">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${getConfidenceBarColor(currentConfidence)}`}
                    style={{ width: `${currentConfidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detection Counter */}
      {isActive && (
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-black bg-opacity-60 rounded-lg px-3 py-2">
            <div className="text-center">
              <span className="text-gray-300 text-xs">Detections</span>
              <div className="text-white text-lg font-bold">{detectionCount}</div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleCamera}
            className="p-2 bg-black bg-opacity-60 rounded-full hover:bg-opacity-80 transition-colors text-white"
          >
            {isActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
          </button>
          <button className="p-2 bg-black bg-opacity-60 rounded-full hover:bg-opacity-80 transition-colors text-white">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-2 bg-black bg-opacity-60 rounded-full hover:bg-opacity-80 transition-colors text-white">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <CameraOff className="w-16 h-16 text-red-400 mb-4 mx-auto" />
            <p className="text-red-400 text-lg font-medium mb-2">Camera Error</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Retry Camera Access
            </button>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      )}

      {!isActive && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center">
            <Camera className="w-16 h-16 text-gray-600 mb-4 mx-auto" />
            <p className="text-gray-400 text-lg">Camera Feed</p>
            <p className="text-gray-500 text-sm mt-2">Click the camera button to start</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraFeed;
