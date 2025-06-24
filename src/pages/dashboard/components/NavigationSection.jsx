import React from 'react';
import Icon from '../../../components/AppIcon';

const NavigationSection = ({ onFindMatches, onMessages, onEditProfile, messageCount, theme }) => {
  const navigationCards = [
    {
      id: 'matches',
      title: 'Find Matches',
      description: 'Discover professionals who share your interests and values',
      icon: 'Search',
      color: 'primary',
      action: onFindMatches,
      badge: null,
      features: ['Smart matching', 'Profession filters', 'Location-based']
    },
    {
      id: 'messages',
      title: 'My Connections',
      description: 'Chat with your matches and build meaningful relationships',
      icon: 'MessageCircle',
      color: 'secondary',
      action: onMessages,
      badge: messageCount > 0 ? messageCount : null,
      features: ['Real-time chat', 'Voice messages', 'Video calls']
    },
    {
      id: 'profile',
      title: 'Edit Profile',
      description: 'Update your information and enhance your professional presence',
      icon: 'User',
      color: 'accent',
      action: onEditProfile,
      badge: null,
      features: ['Photo upload', 'Skills showcase', 'Bio enhancement']
    }
  ];

  return (
    <div className="mb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          What would you like to do today?
        </h2>
        <p className="text-text-secondary">
          Choose an action to enhance your professional networking experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {navigationCards.map((card) => (
          <div
            key={card.id}
            className="group relative bg-surface rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg hover:border-border-hover transition-all duration-300 cursor-pointer"
            onClick={card.action}
          >
            {/* Badge */}
            {card.badge && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center text-xs font-bold">
                {card.badge > 9 ? '9+' : card.badge}
              </div>
            )}

            {/* Header */}
            <div className="flex items-center mb-4">
              <div className={`
                w-14 h-14 bg-${card.color}-100 rounded-2xl flex items-center justify-center mr-4
                group-hover:bg-${card.color} group-hover:scale-110 transition-all duration-300
              `}>
                <Icon 
                  name={card.icon} 
                  size={24} 
                  color={`var(--color-${card.color})`}
                  className="group-hover:text-white transition-colors duration-300"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors duration-300">
                  {card.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-text-secondary text-sm mb-4 leading-relaxed">
              {card.description}
            </p>

            {/* Features */}
            <div className="space-y-2 mb-6">
              {card.features.map((feature, index) => (
                <div key={index} className="flex items-center text-text-muted text-xs">
                  <div className={`w-1.5 h-1.5 bg-${card.color} rounded-full mr-2`} />
                  {feature}
                </div>
              ))}
            </div>

            {/* Action Button */}
            <button 
              className={`
                w-full py-3 px-4 rounded-xl font-medium transition-all duration-300
                bg-${card.color}-50 text-${card.color} border border-${card.color}-200
                group-hover:bg-${card.color} group-hover:text-white group-hover:border-${card.color}
                group-hover:shadow-lg
              `}
            >
              <span className="flex items-center justify-center">
                Get Started
                <Icon 
                  name="ArrowRight" 
                  size={16} 
                  className="ml-2 group-hover:translate-x-1 transition-transform duration-300" 
                />
              </span>
            </button>

            {/* Hover Effect Overlay */}
            <div className={`
              absolute inset-0 bg-gradient-to-br from-${card.color}-500/5 to-${card.color}-600/5 
              rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
            `} />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Quick Actions
          </h3>
          <p className="text-text-secondary text-sm">
            Frequently used features for easy access
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: 'Filter', label: 'Advanced Search', action: onFindMatches },
            { icon: 'Star', label: 'Favorites', action: onMessages },
            { icon: 'Settings', label: 'Preferences', action: onEditProfile },
            { icon: 'HelpCircle', label: 'Help & Tips', action: () => {} }
          ].map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex flex-col items-center p-4 bg-white rounded-xl hover:bg-primary-50 transition-colors duration-200 group"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-primary group-hover:scale-110 transition-all duration-200">
                <Icon 
                  name={action.icon} 
                  size={18} 
                  color="var(--color-primary)"
                  className="group-hover:text-white transition-colors duration-200"
                />
              </div>
              <span className="text-text-secondary text-xs text-center leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationSection;