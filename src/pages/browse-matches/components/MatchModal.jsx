import React, { useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import AppImage from '../../../components/AppImage';

const MatchModal = ({ matchedProfile, onClose, onMessage, theme }) => {
  useEffect(() => {
    // Confetti animation or celebration effect could be added here
    const timer = setTimeout(() => {
      // Auto-close after 5 seconds if no action
      // onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-sm w-full mx-auto relative overflow-hidden">
        {/* Background Pattern */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-10`} />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center z-10 hover:bg-opacity-100 transition-all"
        >
          <Icon name="X" size={16} className="text-gray-600" />
        </button>

        <div className="relative p-6 text-center">
          {/* Celebration Icon */}
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 bg-gradient-to-br ${theme.gradient} rounded-full flex items-center justify-center animate-pulse`}>
              <Icon name="Heart" size={32} className="text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            It's a Match! 🎉
          </h2>
          <p className="text-text-secondary mb-6">
            You and {matchedProfile?.full_name} liked each other
          </p>

          {/* Profile Images */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <AppImage
                src="/assets/images/no_image.png" // Current user avatar would come from auth context
                alt="You"
                className="w-full h-full object-cover"
                fallback="/assets/images/no_image.png"
              />
            </div>
            
            <div className={`w-8 h-8 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center animate-bounce`}>
              <Icon name="Heart" size={16} className="text-white" />
            </div>
            
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <AppImage
                src={matchedProfile?.avatar_url}
                alt={matchedProfile?.full_name}
                className="w-full h-full object-cover"
                fallback="/assets/images/no_image.png"
              />
            </div>
          </div>

          {/* Match Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <div className="flex items-center">
                <Icon 
                  name={
                    matchedProfile?.profession === 'developer' ? 'Code' :
                    matchedProfile?.profession === 'doctor' ? 'Stethoscope' :
                    matchedProfile?.profession === 'founder' ? 'TrendingUp' : 'User'
                  } 
                  size={16} 
                  className={`mr-2 text-${theme.primary}`}
                />
                <span className="text-sm font-medium text-text-primary">
                  {matchedProfile?.profession?.charAt(0)?.toUpperCase() + matchedProfile?.profession?.slice(1)}
                </span>
              </div>
              <span className="mx-3 text-gray-300">•</span>
              <span className="text-sm text-text-secondary">
                {matchedProfile?.location}
              </span>
            </div>
            <div className="text-center">
              <span className={`text-lg font-bold text-${theme.primary}`}>
                {matchedProfile?.compatibility || 85}% compatibility
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onMessage}
              className={`w-full btn-primary bg-gradient-to-r ${theme.gradient} hover:opacity-90 transition-all transform hover:scale-105`}
            >
              <Icon name="MessageCircle" size={20} className="mr-2" />
              Send Message
            </button>
            
            <button
              onClick={onClose}
              className="w-full btn-outline border-gray-200 text-text-secondary hover:bg-gray-50"
            >
              Keep Browsing
            </button>
          </div>

          {/* Fun Message */}
          <p className="text-xs text-text-secondary mt-4 italic">
            Start a conversation and see where it leads! 💫
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;