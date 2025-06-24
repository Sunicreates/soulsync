import React from 'react';
import Icon from '../../../components/AppIcon';

const MobileBottomNav = ({ 
  onFindMatches, 
  onMessages, 
  onEditProfile, 
  onNotifications,
  messageCount = 0,
  notificationCount = 0,
  currentPage = 'dashboard'
}) => {
  const navItems = [
    {
      id: 'matches',
      label: 'Discover',
      icon: 'Search',
      action: onFindMatches,
      badge: null,
      isActive: currentPage === 'matches'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: 'MessageCircle',
      action: onMessages,
      badge: messageCount > 0 ? messageCount : null,
      isActive: currentPage === 'messages'
    },
    {
      id: 'dashboard',
      label: 'Home',
      icon: 'Home',
      action: () => window.location.href = '/dashboard',
      badge: null,
      isActive: currentPage === 'dashboard'
    },
    {
      id: 'notifications',
      label: 'Alerts',
      icon: 'Bell',
      action: onNotifications,
      badge: notificationCount > 0 ? notificationCount : null,
      isActive: currentPage === 'notifications'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'User',
      action: onEditProfile,
      badge: null,
      isActive: currentPage === 'profile'
    }
  ];

  const handleItemClick = (item) => {
    // Add haptic feedback for mobile devices
    if (navigator?.vibrate) {
      navigator.vibrate(10);
    }
    
    item.action?.();
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Background with blur effect */}
      <div className="bg-surface/95 backdrop-blur-lg border-t border-border">
        <div className="px-2 py-1">
          <div className="flex items-center justify-around">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`
                  relative flex flex-col items-center justify-center p-2 rounded-xl
                  transition-all duration-200 min-w-0 flex-1 group
                  ${item.isActive 
                    ? 'bg-primary text-white' :'text-text-secondary hover:text-primary hover:bg-primary-50'
                  }
                `}
              >
                {/* Badge */}
                {item.badge && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {item.badge > 9 ? '9+' : item.badge}
                  </div>
                )}

                {/* Icon */}
                <div className={`
                  w-6 h-6 flex items-center justify-center mb-1
                  ${item.isActive ? 'scale-110' : 'group-hover:scale-105'}
                  transition-transform duration-200
                `}>
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    color={item.isActive ? 'white' : 'currentColor'}
                  />
                </div>

                {/* Label */}
                <span className={`
                  text-xs font-medium leading-tight
                  ${item.isActive ? 'text-white' : 'text-inherit'}
                `}>
                  {item.label}
                </span>

                {/* Active Indicator */}
                {item.isActive && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Safe area for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-surface/95" />
      </div>
    </div>
  );
};

export default MobileBottomNav;