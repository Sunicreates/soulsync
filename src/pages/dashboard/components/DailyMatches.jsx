import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DailyMatches = ({ matches, onViewAll, theme }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextMatch = () => {
    setCurrentIndex((prev) => (prev + 1) % matches.length);
  };

  const prevMatch = () => {
    setCurrentIndex((prev) => (prev - 1 + matches.length) % matches.length);
  };

  const getProfessionIcon = (profession) => {
    switch (profession) {
      case 'developer':
        return 'Code';
      case 'doctor':
        return 'Stethoscope';
      case 'founder':
        return 'TrendingUp';
      default:
        return 'User';
    }
  };

  const getProfessionColor = (profession) => {
    switch (profession) {
      case 'developer':
        return 'primary';
      case 'doctor':
        return 'secondary';
      case 'founder':
        return 'accent';
      default:
        return 'primary';
    }
  };

  if (!matches || matches.length === 0) {
    return (
      <div className="bg-surface rounded-2xl p-8 mb-8 shadow-sm border border-border">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Users" size={32} color="var(--color-primary)" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            No matches yet
          </h3>
          <p className="text-text-secondary mb-6">
            Complete your profile to start discovering compatible professionals
          </p>
          <button 
            onClick={onViewAll}
            className="btn-primary"
          >
            <Icon name="Search" size={20} className="mr-2" />
            Start Browsing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl p-6 mb-8 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Daily Compatible Profiles
          </h2>
          <p className="text-text-secondary text-sm">
            Curated matches based on your preferences
          </p>
        </div>
        
        <button 
          onClick={onViewAll}
          className="btn-outline text-sm"
        >
          View All
          <Icon name="ArrowRight" size={16} className="ml-2" />
        </button>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        {matches.length > 1 && (
          <>
            <button
              onClick={prevMatch}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow duration-200"
            >
              <Icon name="ChevronLeft" size={20} color="var(--color-text-secondary)" />
            </button>
            
            <button
              onClick={nextMatch}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow duration-200"
            >
              <Icon name="ChevronRight" size={20} color="var(--color-text-secondary)" />
            </button>
          </>
        )}

        {/* Matches Carousel */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {matches.map((match, index) => {
              const professionColor = getProfessionColor(match.profession);
              
              return (
                <div 
                  key={match.id} 
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-background rounded-xl p-6 border border-border">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {match.avatar_url ? (
                          <img
                            src={match.avatar_url}
                            alt={match.full_name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                            <Icon name="User" size={24} color="var(--color-primary)" />
                          </div>
                        )}
                        
                        {/* Profession Badge */}
                        <div className={`
                          absolute -bottom-1 -right-1 w-6 h-6 bg-${professionColor} 
                          rounded-full flex items-center justify-center border-2 border-white
                        `}>
                          <Icon 
                            name={getProfessionIcon(match.profession)} 
                            size={12} 
                            color="white" 
                          />
                        </div>
                      </div>

                      {/* Profile Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-text-primary truncate">
                            {match.full_name}
                          </h4>
                          <span className={`
                            px-2 py-1 bg-${professionColor}-100 text-${professionColor}-700 
                            rounded-full text-xs font-medium capitalize
                          `}>
                            {match.profession}
                          </span>
                        </div>
                        
                        {match.location && (
                          <div className="flex items-center text-text-secondary text-sm mb-2">
                            <Icon name="MapPin" size={14} className="mr-1" />
                            {match.location}
                          </div>
                        )}
                        
                        {match.company && (
                          <div className="flex items-center text-text-secondary text-sm mb-3">
                            <Icon name="Building" size={14} className="mr-1" />
                            {match.company}
                            {match.years_experience && (
                              <span className="ml-2">• {match.years_experience} years exp.</span>
                            )}
                          </div>
                        )}

                        {/* Bio Preview */}
                        {match.bio && (
                          <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                            {match.bio}
                          </p>
                        )}

                        {/* Tags */}
                        {match.tags && match.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {match.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 bg-background text-text-muted rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                            {match.tags.length > 3 && (
                              <span className="px-2 py-1 bg-background text-text-muted rounded text-xs">
                                +{match.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <button className="btn-primary text-sm flex-1">
                            <Icon name="Heart" size={16} className="mr-2" />
                            Like
                          </button>
                          <button className="btn-outline text-sm flex-1">
                            <Icon name="Eye" size={16} className="mr-2" />
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots Indicator */}
        {matches.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {matches.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`
                  w-2 h-2 rounded-full transition-colors duration-200
                  ${index === currentIndex ? 'bg-primary' : 'bg-border'}
                `}
              />
            ))}
          </div>
        )}
      </div>

      {/* Compatibility Score */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Icon name="Target" size={20} color="var(--color-primary)" className="mr-2" />
            <span className="text-text-primary font-medium">Compatibility Match</span>
          </div>
          <div className="text-primary font-bold">
            {Math.floor(Math.random() * 20) + 80}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyMatches;