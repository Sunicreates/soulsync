import React from 'react';
import Icon from '../../../components/AppIcon';

const DecisionButtons = ({ 
  onPass, 
  onLike, 
  onUndo, 
  canUndo, 
  theme, 
  disabled = false 
}) => {
  const handleButtonClick = (action) => {
    if (disabled) return;
    
    // Haptic feedback
    if (navigator?.vibrate) {
      navigator.vibrate(50);
    }
    
    action();
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      {/* Pass Button */}
      <button
        onClick={() => handleButtonClick(onPass)}
        disabled={disabled}
        className={`
          w-16 h-16 rounded-full bg-white shadow-lg border-2 border-gray-200
          flex items-center justify-center transition-all duration-200
          hover:shadow-xl hover:scale-110 active:scale-95
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-error hover:bg-error-50'}
        `}
      >
        <Icon 
          name="X" 
          size={28} 
          className={`${disabled ? 'text-gray-400' : 'text-error hover:text-error-dark'}`} 
        />
      </button>

      {/* Undo Button */}
      <button
        onClick={() => handleButtonClick(onUndo)}
        disabled={!canUndo || disabled}
        className={`
          w-12 h-12 rounded-full bg-white shadow-md border border-gray-200
          flex items-center justify-center transition-all duration-200
          ${canUndo && !disabled 
            ? 'hover:shadow-lg hover:scale-110 active:scale-95 hover:border-warning hover:bg-warning-50' 
            : 'opacity-30 cursor-not-allowed'
          }
        `}
      >
        <Icon 
          name="RotateCcw" 
          size={20} 
          className={canUndo && !disabled ? 'text-warning' : 'text-gray-400'} 
        />
      </button>

      {/* Like Button */}
      <button
        onClick={() => handleButtonClick(onLike)}
        disabled={disabled}
        className={`
          w-16 h-16 rounded-full bg-white shadow-lg border-2 border-gray-200
          flex items-center justify-center transition-all duration-200
          hover:shadow-xl hover:scale-110 active:scale-95
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-success hover:bg-success-50'}
        `}
      >
        <Icon 
          name="Heart" 
          size={28} 
          className={`${disabled ? 'text-gray-400' : 'text-success hover:text-success-dark'}`} 
        />
      </button>
    </div>
  );
};

export default DecisionButtons;