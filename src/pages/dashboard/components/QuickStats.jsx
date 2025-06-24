import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ stats, theme }) => {
  const statCards = [
    {
      key: 'matches',
      title: 'New Matches',
      value: stats?.matches || 0,
      subtitle: 'This week',
      icon: 'Users',
      color: 'primary',
      trend: '+12%',
      trendDirection: 'up'
    },
    {
      key: 'messages',
      title: 'Unread Messages',
      value: stats?.messages || 0,
      subtitle: 'Active conversations',
      icon: 'MessageCircle',
      color: 'secondary',
      trend: '+5',
      trendDirection: 'up'
    },
    {
      key: 'profileViews',
      title: 'Profile Views',
      value: stats?.profileViews || 0,
      subtitle: 'This month',
      icon: 'Eye',
      color: 'accent',
      trend: '+23%',
      trendDirection: 'up'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statCards.map((card) => (
        <div 
          key={card.key}
          className="bg-surface rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-${card.color}-100 rounded-full flex items-center justify-center`}>
              <Icon 
                name={card.icon} 
                size={20} 
                color={`var(--color-${card.color})`} 
              />
            </div>
            
            {/* Trend Indicator */}
            <div className={`
              flex items-center px-2 py-1 rounded-full text-xs font-medium
              ${card.trendDirection === 'up' ?'bg-success-100 text-success-700' :'bg-error-100 text-error-700'
              }
            `}>
              <Icon 
                name={card.trendDirection === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={12} 
                className="mr-1" 
              />
              {card.trend}
            </div>
          </div>

          <div className="mb-2">
            <h3 className="text-sm font-medium text-text-secondary mb-1">
              {card.title}
            </h3>
            <p className="text-3xl font-bold text-text-primary">
              {card.value}
            </p>
          </div>
          
          <p className="text-text-muted text-xs">
            {card.subtitle}
          </p>

          {/* Progress Bar for Visual Appeal */}
          <div className="mt-4">
            <div className="w-full bg-background rounded-full h-1">
              <div
                className={`bg-${card.color} h-1 rounded-full transition-all duration-500`}
                style={{ 
                  width: `${Math.min((card.value / 10) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;