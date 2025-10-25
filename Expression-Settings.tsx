import React from 'react';
import { Smile, Frown, Zap, Angry, Meh, Heart } from 'lucide-react';

interface ExpressionControlsProps {
  onExpressionChange: (expression: string) => void;
  currentExpression: string;
}

const ExpressionControls: React.FC<ExpressionControlsProps> = ({ 
  onExpressionChange, 
  currentExpression 
}) => {
  const expressions = [
    { name: 'happy', icon: Smile, color: 'bg-green-500 hover:bg-green-600', label: 'Happy' },
    { name: 'sad', icon: Frown, color: 'bg-blue-500 hover:bg-blue-600', label: 'Sad' },
    { name: 'surprised', icon: Zap, color: 'bg-yellow-500 hover:bg-yellow-600', label: 'Surprised' },
    { name: 'angry', icon: Angry, color: 'bg-red-500 hover:bg-red-600', label: 'Angry' },
    { name: 'neutral', icon: Meh, color: 'bg-gray-500 hover:bg-gray-600', label: 'Neutral' },
    { name: 'excited', icon: Heart, color: 'bg-purple-500 hover:bg-purple-600', label: 'Excited' },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-white text-lg font-semibold mb-4 text-center">Expression Controls</h3>
      <div className="grid grid-cols-2 gap-3">
        {expressions.map((expr) => {
          const Icon = expr.icon;
          const isActive = currentExpression === expr.name;
          
          return (
            <button
              key={expr.name}
              onClick={() => onExpressionChange(expr.name)}
              className={`
                ${expr.color} 
                ${isActive ? 'ring-4 ring-white ring-opacity-50 scale-105' : ''}
                text-white p-4 rounded-lg transition-all duration-200 
                flex flex-col items-center space-y-2 shadow-lg
                transform hover:scale-105 active:scale-95
              `}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium">{expr.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gray-700 rounded-lg">
        <div className="text-center">
          <p className="text-gray-300 text-sm mb-2">Current Expression</p>
          <p className="text-white text-xl font-bold capitalize">{currentExpression}</p>
        </div>
      </div>
    </div>
  );
};

export default ExpressionControls;
