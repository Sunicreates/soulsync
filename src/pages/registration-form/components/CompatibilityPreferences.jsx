import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CompatibilityPreferences = ({ register, errors, setValue, watch, profession }) => {
  const [ageRange, setAgeRange] = useState({
    min: watch('age_range')?.min || 25,
    max: watch('age_range')?.max || 45
  });
  const [locationRadius, setLocationRadius] = useState(watch('location_radius') || 50);
  const [selectedProfessions, setSelectedProfessions] = useState(watch('profession_preferences') || []);

  const professions = [
    { id: 'developer', label: 'Developers', icon: 'Code', color: 'primary' },
    { id: 'doctor', label: 'Doctors', icon: 'Stethoscope', color: 'secondary' },
    { id: 'founder', label: 'Founders', icon: 'TrendingUp', color: 'accent' }
  ];

  const handleAgeRangeChange = (type, value) => {
    const newRange = { ...ageRange, [type]: parseInt(value) };
    setAgeRange(newRange);
    setValue('age_range', newRange);
  };

  const handleLocationRadiusChange = (value) => {
    setLocationRadius(parseInt(value));
    setValue('location_radius', parseInt(value));
  };

  const toggleProfession = (professionId) => {
    const updated = selectedProfessions.includes(professionId)
      ? selectedProfessions.filter(p => p !== professionId)
      : [...selectedProfessions, professionId];
    
    setSelectedProfessions(updated);
    setValue('profession_preferences', updated);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Compatibility Preferences</h2>
        <p className="text-text-secondary">
          Set your preferences to find the most compatible matches
        </p>
      </div>

      {/* Age Range */}
      <div className="bg-surface rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <Icon name="Calendar" size={24} color="var(--color-primary)" className="mr-3" />
          <h3 className="text-lg font-semibold text-text-primary">Age Range</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Preferred age range:</span>
            <span className="font-semibold text-text-primary">
              {ageRange.min} - {ageRange.max} years
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Minimum Age
              </label>
              <input
                type="range"
                min="18"
                max="65"
                value={ageRange.min}
                onChange={(e) => handleAgeRangeChange('min', e.target.value)}
                className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>18</span>
                <span>65</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Maximum Age
              </label>
              <input
                type="range"
                min="18"
                max="65"
                value={ageRange.max}
                onChange={(e) => handleAgeRangeChange('max', e.target.value)}
                className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>18</span>
                <span>65</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Radius */}
      <div className="bg-surface rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <Icon name="MapPin" size={24} color="var(--color-secondary)" className="mr-3" />
          <h3 className="text-lg font-semibold text-text-primary">Location Radius</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Maximum distance:</span>
            <span className="font-semibold text-text-primary">
              {locationRadius === 500 ? 'Anywhere' : `${locationRadius} miles`}
            </span>
          </div>
          
          <div>
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={locationRadius}
              onChange={(e) => handleLocationRadiusChange(e.target.value)}
              className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>5 mi</span>
              <span>Anywhere</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {[10, 25, 50, 100].map((distance) => (
              <button
                key={distance}
                type="button"
                onClick={() => handleLocationRadiusChange(distance)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${locationRadius === distance
                    ? 'bg-secondary text-white' :'bg-background border border-border hover:border-secondary text-text-secondary'
                  }
                `}
              >
                {distance} mi
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Profession Preferences */}
      <div className="bg-surface rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <Icon name="Users" size={24} color="var(--color-accent)" className="mr-3" />
          <h3 className="text-lg font-semibold text-text-primary">Profession Preferences</h3>
        </div>
        
        <p className="text-text-secondary mb-4">
          Select the professions you're interested in connecting with
        </p>
        
        <div className="space-y-3">
          {professions.map((prof) => (
            <div
              key={prof.id}
              className={`
                cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                ${selectedProfessions.includes(prof.id)
                  ? `border-${prof.color} bg-${prof.color}-50`
                  : 'border-border bg-background hover:border-border-hover'
                }
                ${prof.id === profession ? 'opacity-50 pointer-events-none' : ''}
              `}
              onClick={() => prof.id !== profession && toggleProfession(prof.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mr-3
                    ${selectedProfessions.includes(prof.id) 
                      ? `bg-${prof.color}` 
                      : `bg-${prof.color}-100`}
                  `}>
                    <Icon 
                      name={prof.icon} 
                      size={20} 
                      color={selectedProfessions.includes(prof.id) ? 'white' : `var(--color-${prof.color})`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">{prof.label}</h4>
                    {prof.id === profession && (
                      <p className="text-xs text-text-muted">Your profession</p>
                    )}
                  </div>
                </div>
                
                {prof.id !== profession && (
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                    ${selectedProfessions.includes(prof.id)
                      ? `border-${prof.color} bg-${prof.color}`
                      : 'border-border-hover'
                    }
                  `}>
                    {selectedProfessions.includes(prof.id) && (
                      <Icon name="Check" size={14} color="white" />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {selectedProfessions.length === 0 && (
          <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
            <div className="flex items-center">
              <Icon name="Info" size={16} color="var(--color-warning)" className="mr-2" />
              <span className="text-warning text-sm">
                Select at least one profession to improve match quality
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Experience Level Preferences */}
      <div className="bg-surface rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <Icon name="Award" size={24} color="var(--color-primary)" className="mr-3" />
          <h3 className="text-lg font-semibold text-text-primary">Experience Level</h3>
        </div>
        
        <p className="text-text-secondary mb-4">
          Preferred experience range for potential matches
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { range: '0-2', label: 'Entry Level' },
            { range: '3-5', label: 'Mid Level' },
            { range: '6-10', label: 'Senior Level' },
            { range: '10+', label: 'Expert Level' }
          ].map((level) => (
            <button
              key={level.range}
              type="button"
              onClick={() => {
                const current = watch('experience_preferences') || [];
                const updated = current.includes(level.range)
                  ? current.filter(exp => exp !== level.range)
                  : [...current, level.range];
                setValue('experience_preferences', updated);
              }}
              className={`
                px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-center
                ${(watch('experience_preferences') || []).includes(level.range)
                  ? 'bg-primary text-white' :'bg-background border border-border hover:border-primary text-text-secondary hover:text-primary'
                }
              `}
            >
              <div>{level.label}</div>
              <div className="text-xs opacity-75">{level.range} years</div>
            </button>
          ))}
        </div>
      </div>

      {/* Matching Priorities */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <Icon name="Target" size={24} color="var(--color-accent)" className="mr-3" />
          <h3 className="text-lg font-semibold text-text-primary">Matching Priorities</h3>
        </div>
        
        <p className="text-text-secondary mb-4">
          What matters most to you in a potential match?
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Shared Profession', 'Similar Experience', 'Geographic Proximity',
            'Professional Values', 'Career Goals', 'Work-Life Balance',
            'Industry Knowledge', 'Networking Potential', 'Mentorship'
          ].map((priority) => (
            <button
              key={priority}
              type="button"
              onClick={() => {
                const current = watch('matching_priorities') || [];
                const updated = current.includes(priority)
                  ? current.filter(p => p !== priority)
                  : [...current, priority];
                setValue('matching_priorities', updated);
              }}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left
                ${(watch('matching_priorities') || []).includes(priority)
                  ? 'bg-accent text-white' :'bg-surface border border-border hover:border-accent text-text-secondary hover:text-accent'
                }
              `}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompatibilityPreferences;