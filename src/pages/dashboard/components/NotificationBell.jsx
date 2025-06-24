import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const NotificationBell = ({ notifications = [], onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(notifications.length);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setUnreadCount(notifications.length);
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Mark as read when opened
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'match':
        return 'Heart';
      case 'message':
        return 'MessageCircle';
      case 'profile_view':
        return 'Eye';
      case 'system':
        return 'Bell';
      default:
        return 'Info';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'match':
        return 'primary';
      case 'message':
        return 'secondary';
      case 'profile_view':
        return 'accent';
      case 'system':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={toggleDropdown}
        className={`
          relative p-3 rounded-full transition-all duration-200
          ${isOpen 
            ? 'bg-primary text-white shadow-lg' 
            : 'bg-surface hover:bg-primary-50 text-text-secondary hover:text-primary'
          }
          border border-border hover:border-primary
        `}
      >
        <Icon name="Bell" size={20} />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center text-xs font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}

        {/* Active Indicator */}
        {notifications.length > 0 && unreadCount === 0 && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-white" />
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-surface rounded-2xl shadow-xl border border-border z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">
                Notifications
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-text-muted hover:text-primary text-sm font-medium transition-colors duration-200"
                >
                  Clear All
                </button>
              )}
            </div>
            <p className="text-text-secondary text-sm mt-1">
              {notifications.length === 0 
                ? 'No new notifications' 
                : `${notifications.length} notification${notifications.length > 1 ? 's' : ''}`
              }
            </p>
          </div>

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Bell" size={24} color="var(--color-primary)" />
                </div>
                <h4 className="text-text-primary font-medium mb-2">
                  All caught up!
                </h4>
                <p className="text-text-secondary text-sm">
                  No new notifications to show
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => {
                  const notificationColor = getNotificationColor(notification.type);
                  
                  return (
                    <div
                      key={notification.id}
                      className="p-4 hover:bg-background transition-colors duration-200 cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        {/* Notification Icon */}
                        <div className={`
                          w-10 h-10 bg-${notificationColor}-100 rounded-full 
                          flex items-center justify-center flex-shrink-0
                        `}>
                          <Icon 
                            name={getNotificationIcon(notification.type)} 
                            size={16} 
                            color={`var(--color-${notificationColor})`} 
                          />
                        </div>

                        {/* Notification Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-text-primary text-sm font-medium mb-1">
                            {notification.message}
                          </p>
                          <p className="text-text-muted text-xs">
                            {notification.time}
                          </p>
                        </div>

                        {/* Unread Indicator */}
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-border">
              <button className="w-full btn-outline text-sm">
                <Icon name="Eye" size={16} className="mr-2" />
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;