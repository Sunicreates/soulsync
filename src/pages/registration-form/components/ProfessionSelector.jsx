import React from 'react';
import Icon from '../../../components/AppIcon';

const ProfessionSelector = ({ selectedProfession, onSelect, register, errors }) => {
  const professions = [
    {
      id: 'developer',
      title: 'Developer',
      description: 'Software engineers, programmers, and tech professionals',
      icon: 'Code',
      color: 'primary',
      features: ['GitHub integration', 'Tech stack showcase', 'Project portfolio']
    },
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Medical professionals and healthcare workers',
      icon: 'Stethoscope',
      color: 'secondary',
      features: ['Specialty verification', 'Hospital networks', 'Medical interests']
    },
    {
      id: 'founder',
      title: 'Founder',
      description: 'Entrepreneurs and business leaders',
      icon: 'TrendingUp',
      color: 'accent',
      features: ['Industry focus', 'Startup stage', 'Investment status']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Choose Your Profession</h2>
        <p className="text-text-secondary">
          Select your professional category to customize your experience
        </p>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Full Name *
          </label>
          <input
            type="text"
            {...register('full_name', { required: 'Full name is required' })}
            className="input-field"
            placeholder="Enter your full name"
          />
          {errors?.full_name && (
            <p className="mt-1 text-sm text-error">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Email Address *
          </label>
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email format'
              }
            })}
            className="input-field"
            placeholder="Enter your email"
            disabled
          />
          {errors?.email && (
            <p className="mt-1 text-sm text-error">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Profession Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Select Your Profession</h3>
        <div className="grid grid-cols-1 gap-4">
          {professions.map((profession) => (
            <div
              key={profession.id}
              className={`
                relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200
                ${
                  selectedProfession === profession.id
                    ? `border-${profession.color} bg-${profession.color}-50`
                    : 'border-border bg-surface hover:border-border-hover'
                }
              `}
              onClick={() => onSelect(profession.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${selectedProfession === profession.id 
                    ? `bg-${profession.color}` 
                    : `bg-${profession.color}-100`}
                `}>
                  <Icon 
                    name={profession.icon} 
                    size={24} 
                    color={selectedProfession === profession.id ? 'white' : `var(--color-${profession.color})`}
                  />
                </div>
                
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-text-primary mb-2">
                    {profession.title}
                  </h4>
                  <p className="text-text-secondary mb-3">
                    {profession.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {profession.features.map((feature, index) => (
                      <span
                        key={index}
                        className={`
                          px-3 py-1 rounded-full text-sm font-medium
                          ${selectedProfession === profession.id
                            ? `bg-${profession.color}-100 text-${profession.color}-700`
                            : 'bg-background text-text-secondary'
                          }
                        `}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedProfession === profession.id && (
                  <div className={`w-6 h-6 rounded-full bg-${profession.color} flex items-center justify-center`}>
                    <Icon name="Check" size={16} color="white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!selectedProfession && (
        <p className="text-sm text-error text-center">
          Please select a profession to continue
        </p>
      )}
    </div>
  );
};

export default ProfessionSelector;