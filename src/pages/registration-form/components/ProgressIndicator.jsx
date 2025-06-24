import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, title: 'Profession', icon: 'User' },
    { number: 2, title: 'Details', icon: 'FileText' },
    { number: 3, title: 'Photo', icon: 'Camera' },
    { number: 4, title: 'Preferences', icon: 'Settings' },
    { number: 5, title: 'Review', icon: 'Check' }
  ];

  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white';
      case 'current':
        return 'bg-primary text-white';
      case 'upcoming':
        return 'bg-border text-text-muted';
      default:
        return 'bg-border text-text-muted';
    }
  };

  const getConnectorColor = (stepNumber) => {
    return stepNumber < currentStep ? 'bg-success' : 'bg-border';
  };

  return (
    <div className="mb-8">
      {/* Mobile Progress Bar */}
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-text-secondary">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Step Indicator */}
      <div className="hidden md:flex justify-center">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step.number);
            const isLast = index === steps.length - 1;

            return (
              <div key={step.number} className="flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                      ${getStepColor(status)}
                      ${status === 'current' ? 'border-primary shadow-lg' : 'border-transparent'}
                    `}
                  >
                    {status === 'completed' ? (
                      <Icon name="Check" size={20} color="white" />
                    ) : (
                      <Icon 
                        name={step.icon} 
                        size={20} 
                        color={status === 'current' ? 'white' : 'currentColor'} 
                      />
                    )}
                  </div>
                  
                  {/* Step Title */}
                  <span 
                    className={`
                      mt-2 text-xs font-medium
                      ${status === 'current' ? 'text-primary' : 'text-text-secondary'}
                    `}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={`
                      w-16 h-0.5 mx-4 transition-all duration-300
                      ${getConnectorColor(step.number)}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Info */}
      <div className="text-center mt-6">
        <h3 className="text-lg font-semibold text-text-primary">
          {steps.find(step => step.number === currentStep)?.title}
        </h3>
        <div className="flex items-center justify-center mt-2">
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${index + 1 <= currentStep ? 'bg-primary' : 'bg-border'}
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;