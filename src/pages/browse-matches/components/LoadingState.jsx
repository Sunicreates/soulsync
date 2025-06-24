import React from 'react';
import Icon from '../../../components/AppIcon';

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        {/* Loading Animation */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Icon name="Heart" size={32} className="text-white" />
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-ping absolute -top-2 -left-2" />
            <div className="w-2 h-2 bg-secondary rounded-full animate-ping absolute -bottom-2 -right-2 animation-delay-200" />
            <div className="w-2 h-2 bg-accent rounded-full animate-ping absolute top-0 -right-2 animation-delay-400" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-text-primary mb-2">
          Finding Your Perfect Matches
        </h2>
        <p className="text-text-secondary mb-6 max-w-sm mx-auto">
          We're curating the best professional connections based on your preferences...
        </p>

        {/* Loading Progress */}
        <div className="w-64 bg-surface-light rounded-full h-2 mx-auto mb-4">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>

        {/* Loading Steps */}
        <div className="space-y-2 text-sm text-text-secondary">
          <div className="flex items-center justify-center">
            <Icon name="Check" size={16} className="text-success mr-2" />
            <span>Analyzing compatibility...</span>
          </div>
          <div className="flex items-center justify-center">
            <Icon name="Loader2" size={16} className="text-primary mr-2 animate-spin" />
            <span>Loading profiles...</span>
          </div>
          <div className="flex items-center justify-center opacity-50">
            <Icon name="Clock" size={16} className="text-text-secondary mr-2" />
            <span>Preparing your feed...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;