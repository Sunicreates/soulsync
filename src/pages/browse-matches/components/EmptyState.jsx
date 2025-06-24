import React from 'react';
import Icon from '../../../components/AppIcon';

const EmptyState = ({ onRefresh, onAdjustFilters, theme }) => {
  return (
    <div className="text-center py-12">
      <div className="mb-6">
        <div className={`w-24 h-24 bg-gradient-to-br ${theme.gradient} rounded-full flex items-center justify-center mx-auto mb-4 opacity-20`}>
          <Icon name="Users" size={48} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2">
          No More Profiles
        </h3>
        <p className="text-text-secondary max-w-sm mx-auto">
          You've seen all the available profiles that match your current filters. 
          Try adjusting your preferences or check back later for new members.
        </p>
      </div>

      <div className="space-y-3 max-w-xs mx-auto">
        <button
          onClick={onAdjustFilters}
          className={`w-full btn-primary bg-gradient-to-r ${theme.gradient}`}
        >
          <Icon name="Settings" size={20} className="mr-2" />
          Adjust Filters
        </button>
        
        <button
          onClick={onRefresh}
          className="w-full btn-outline border-gray-200 text-text-secondary hover:bg-gray-50"
        >
          <Icon name="RefreshCw" size={20} className="mr-2" />
          Refresh
        </button>
      </div>

      {/* Suggestions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg max-w-sm mx-auto">
        <h4 className="font-semibold text-text-primary mb-2">💡 Tips to find more matches:</h4>
        <ul className="text-sm text-text-secondary space-y-1 text-left">
          <li>• Expand your location radius</li>
          <li>• Include more professions</li>
          <li>• Update your profile with more details</li>
          <li>• Add recent photos</li>
        </ul>
      </div>
    </div>
  );
};

export default EmptyState;