import React from 'react';
import * as Icons from 'lucide-react';
import { iconMap } from '../utils/lucide-icons';
import { Challenge } from '../types';

interface ChallengeCardProps {
  challenge: Challenge;
  onComplete: (challengeId: string) => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  challenge, 
  onComplete 
}) => {
  const IconComponent = iconMap[challenge.icon as keyof typeof iconMap] as React.ComponentType<any>;
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Einfach': return 'bg-green-100 text-green-600';
      case 'Mittel': return 'bg-yellow-100 text-yellow-600';
      case 'Schwer': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className={`p-4 rounded-xl border transition-all duration-200 ${
      challenge.isCompleted 
        ? 'bg-green-50 border-green-200' 
        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
    }`}>
      <div className="flex items-start space-x-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          challenge.isCompleted 
            ? 'bg-green-100 text-green-600' 
            : 'bg-blue-100 text-blue-600'
        }`}>
          {challenge.isCompleted ? (
            <Icons.CheckCircle size={24} />
          ) : (
            <IconComponent size={24} />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-800">{challenge.title}</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="font-medium text-blue-600">{challenge.points} Punkte</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-green-600">{challenge.energySaving} kWh</span>
                <span className="text-gray-500"> gespart</span>
              </div>
            </div>
            
            {!challenge.isCompleted && (
              <button
                onClick={() => onComplete(challenge.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Starten
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};