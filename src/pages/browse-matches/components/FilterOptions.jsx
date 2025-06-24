import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FilterOptions = ({ filters, onFiltersChange, theme, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const professionOptions = [
    { value: 'all', label: 'All Professions', icon: 'Users' },
    { value: 'developer', label: 'Developers', icon: 'Code' },
    { value: 'doctor', label: 'Doctors', icon: 'Stethoscope' },
    { value: 'founder', label: 'Founders', icon: 'TrendingUp' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'san_francisco', label: 'San Francisco, CA' },
    { value: 'new_york', label: 'New York, NY' },
    { value: 'boston', label: 'Boston, MA' },
    { value: 'seattle', label: 'Seattle, WA' },
    { value: 'austin', label: 'Austin, TX' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== 'all' && !(Array.isArray(value) && value[0] === 25 && value[1] === 45)
  ).length;

  return (
    <div className={className}>
      {/* Filter Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border
          transition-all duration-200 hover:shadow-md
          ${isExpanded ? 'rounded-b-none border-b-0' : ''}
        `}
      >
        <div className="flex items-center">
          <Icon name="Filter" size={20} className={`mr-3 text-${theme.primary}`} />
          <span className="font-medium text-text-primary">Filters</span>
          {activeFiltersCount > 0 && (
            <span className={`ml-2 px-2 py-1 rounded-full text-xs bg-${theme.primary} text-white`}>
              {activeFiltersCount}
            </span>
          )}
        </div>
        <Icon 
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
          size={20} 
          className="text-text-secondary"
        />
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className="bg-white border border-t-0 rounded-b-lg shadow-sm p-4 space-y-4">
          {/* Profession Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Profession
            </label>
            <div className="grid grid-cols-2 gap-2">
              {professionOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('profession', option.value)}
                  className={`
                    flex items-center justify-center p-3 rounded-lg border transition-all
                    ${filters.profession === option.value
                      ? `bg-${theme.primary} text-white border-${theme.primary}`
                      : 'bg-gray-50 text-text-secondary border-gray-200 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon 
                    name={option.icon} 
                    size={16} 
                    className="mr-2" 
                  />
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Location
            </label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {locationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Age Range Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
            </label>
            <div className="px-2">
              <input
                type="range"
                min="18"
                max="65"
                value={filters.ageRange[0]}
                onChange={(e) => handleFilterChange('ageRange', [
                  parseInt(e.target.value),
                  filters.ageRange[1]
                ])}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-${theme.primary}`}
              />
              <input
                type="range"
                min="18"
                max="65"
                value={filters.ageRange[1]}
                onChange={(e) => handleFilterChange('ageRange', [
                  filters.ageRange[0],
                  parseInt(e.target.value)
                ])}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-${theme.primary} -mt-2`}
              />
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Quick Filters
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('profession', 'developer')}
                className={`
                  px-3 py-1 rounded-full text-xs border transition-all
                  ${filters.profession === 'developer' ?'bg-blue-500 text-white border-blue-500' :'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                  }
                `}
              >
                🧑‍💻 Tech Talent
              </button>
              <button
                onClick={() => handleFilterChange('profession', 'doctor')}
                className={`
                  px-3 py-1 rounded-full text-xs border transition-all
                  ${filters.profession === 'doctor'
                    ? 'bg-green-500 text-white border-green-500' :'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                  }
                `}
              >
                👩‍⚕️ Healthcare Heroes
              </button>
              <button
                onClick={() => handleFilterChange('profession', 'founder')}
                className={`
                  px-3 py-1 rounded-full text-xs border transition-all
                  ${filters.profession === 'founder' ?'bg-purple-500 text-white border-purple-500' :'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100'
                  }
                `}
              >
                🚀 Entrepreneurs
              </button>
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={() => onFiltersChange({
                profession: 'all',
                location: 'all',
                ageRange: [25, 45]
              })}
              className="w-full p-2 text-text-secondary text-sm hover:text-text-primary transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterOptions;