import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardHeader = ({ user, theme, stats }) => {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getProfessionBadge = () => {
    switch (user?.profession) {
      case 'developer':
        return { label: 'Developer', icon: 'Code', color: 'primary' };
      case 'doctor':
        return { label: 'Doctor', icon: 'Stethoscope', color: 'secondary' };
      case 'founder':
        return { label: 'Founder', icon: 'TrendingUp', color: 'accent' };
      default:
        return { label: 'Professional', icon: 'User', color: 'primary' };
    }
  };

  const professionBadge = getProfessionBadge();

  return (
    <div className={`bg-gradient-to-br ${theme.gradient} rounded-2xl p-6 mb-8 text-white`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center mb-6">
          {/* Avatar */}
          <div className="relative mr-4">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user?.full_name || 'Profile'}
                className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
              />
            ) : (
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="User" size={24} color="white" />
              </div>
            )}
            
            {/* Profession Badge */}
            <div className={`
              absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full 
              flex items-center justify-center shadow-lg
            `}>
              <Icon 
                name={professionBadge.icon} 
                size={16} 
                color={`var(--color-${professionBadge.color})`} 
              />
            </div>
          </div>
          
          {/* User Info */}
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {getTimeBasedGreeting()}, {user?.full_name?.split(' ')[0] || 'Professional'}!
            </h1>
            <div className="flex items-center mb-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium mr-3">
                {professionBadge.label}
              </span>
              {user?.location && (
                <div className="flex items-center text-white/80">
                  <Icon name="MapPin" size={14} className="mr-1" />
                  <span className="text-sm">{user.location}</span>
                </div>
              )}
            </div>
            <p className="text-white/90 text-sm">
              {theme.greeting}
            </p>
          </div>
        </div>

        {/* Quick Stats in Header */}
        <div className="hidden md:flex space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats?.matches || 0}</div>
            <div className="text-white/80 text-xs">Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats?.messages || 0}</div>
            <div className="text-white/80 text-xs">Messages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats?.profileViews || 0}</div>
            <div className="text-white/80 text-xs">Views</div>
          </div>
        </div>
      </div>

      {/* Tags/Skills */}
      {user?.tags && user.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {user.tags.slice(0, 5).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
          {user.tags.length > 5 && (
            <span className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-sm">
              +{user.tags.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Bio Preview */}
      {user?.bio && (
        <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-white/90 text-sm line-clamp-2">
            {user.bio}
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;