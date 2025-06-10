import React, { useState, useCallback, useEffect } from 'react';
import { Camera, Bot, Settings, Maximize2, Activity } from 'lucide-react';
import CameraFeed from './components/CameraFeed';
import RobotFace from './components/RobotFace';
import ExpressionControls from './components/ExpressionControls';
import ConfidenceSettings from './components/ConfidenceSettings';
import { useAudioAlert } from './hooks/useAudioAlert';

function App() {
  const [currentExpression, setCurrentExpression] = useState('neutral');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(50);
  const [currentConfidence, setCurrentConfidence] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [detectionHistory, setDetectionHistory] = useState<number[]>([]);
  const [successfulDetections, setSuccessfulDetections] = useState(0);
  const [totalDetections, setTotalDetections] = useState(0);
  
  const { playAlertSound } = useAudioAlert();

  const handleExpressionChange = useCallback((expression: string, confidence?: number) => {
    setCurrentExpression(expression);
    if (confidence !== undefined) {
      setCurrentConfidence(confidence);
      setDetectionHistory(prev => [...prev.slice(-19), confidence]);
      setTotalDetections(prev => prev + 1);
      
      if (confidence >= confidenceThreshold) {
        setSuccessfulDetections(prev => prev + 1);
      }
    }
    
    if (soundEnabled) {
      playAlertSound(expression);
    }
  }, [soundEnabled, playAlertSound, confidenceThreshold]);

  const handleSoundToggle = useCallback((enabled: boolean) => {
    setSoundEnabled(enabled);
  }, []);

  const handleThresholdChange = useCallback((threshold: number) => {
    setConfidenceThreshold(threshold);
  }, []);

  // Calculate statistics
  const averageConfidence = detectionHistory.length > 0 
    ? detectionHistory.reduce((sum, conf) => sum + conf, 0) / detectionHistory.length 
    : 0;

  const detectionAccuracy = totalDetections > 0 
    ? (successfulDetections / totalDetections) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Camera className="w-6 h-6 text-blue-400" />
                <Bot className="w-6 h-6 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold">CamBot Mirror</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Live Feed Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Robot Responsive</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">
                  Accuracy: {detectionAccuracy.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-300">Expression:</span>
              <span className="text-sm font-medium text-white capitalize">{currentExpression}</span>
              <span className="text-xs text-gray-400">
                ({currentConfidence.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-300">Threshold:</span>
              <span className="text-sm font-medium text-white">{confidenceThreshold}%</span>
            </div>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
          {/* Left Side - Camera Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                <Camera className="w-5 h-5 text-blue-400" />
                <span>Live Camera Feed</span>
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span>Recording</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span>Threshold: {confidenceThreshold}%</span>
                </div>
              </div>
            </div>
            <div className="h-full">
              <CameraFeed 
                onExpressionDetected={handleExpressionChange}
                confidenceThreshold={confidenceThreshold}
              />
            </div>
          </div>

          {/* Right Side - Robot Face */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                <Bot className="w-5 h-5 text-green-400" />
                <span>Robot Mirror</span>
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Mirroring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Detections: {successfulDetections}/{totalDetections}</span>
                </div>
              </div>
            </div>
            <div className="h-full">
              <RobotFace 
                currentExpression={currentExpression}
                onSoundToggle={handleSoundToggle}
                soundEnabled={soundEnabled}
                confidence={currentConfidence}
              />
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpressionControls 
            onExpressionChange={handleExpressionChange}
            currentExpression={currentExpression}
          />
          
          {showSettings && (
            <ConfidenceSettings
              confidenceThreshold={confidenceThreshold}
              onThresholdChange={handleThresholdChange}
              averageConfidence={averageConfidence}
              detectionAccuracy={detectionAccuracy}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
