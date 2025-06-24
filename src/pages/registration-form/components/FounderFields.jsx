import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FounderFields = ({ register, errors, setValue, watch }) => {
  const [selectedIndustries, setSelectedIndustries] = useState(watch('tags') || []);

  const industries = [
    'Technology', 'Healthcare', 'Fintech', 'E-commerce', 'SaaS', 'AI/ML',
    'Blockchain', 'Biotech', 'EdTech', 'CleanTech', 'Real Estate', 'Food & Beverage',
    'Fashion', 'Travel', 'Entertainment', 'Sports', 'Automotive', 'Energy',
    'Agriculture', 'Logistics', 'Manufacturing', 'Retail', 'Media', 'Gaming'
  ];

  const startupStages = [
    { value: 'idea', label: 'Idea Stage', description: 'Concept development and validation' },
    { value: 'pre_seed', label: 'Pre-Seed', description: 'Building MVP and early traction' },
    { value: 'seed', label: 'Seed', description: 'Product-market fit and early revenue' },
    { value: 'series_a', label: 'Series A', description: 'Scaling operations and team' },
    { value: 'series_b', label: 'Series B+', description: 'Expansion and growth' },
    { value: 'growth', label: 'Growth/Late Stage', description: 'Mature operations and scaling' },
    { value: 'exit', label: 'Post-Exit', description: 'Successful exit or acquisition' }
  ];

  const fundingStatuses = [
    { value: 'bootstrapped', label: 'Bootstrapped', description: 'Self-funded operations' },
    { value: 'angel', label: 'Angel Funded', description: 'Angel investor backing' },
    { value: 'vc', label: 'VC Funded', description: 'Venture capital investment' },
    { value: 'corporate', label: 'Corporate Backed', description: 'Corporate investment/partnership' },
    { value: 'government', label: 'Government Grants', description: 'Government funding or grants' },
    { value: 'crowdfunded', label: 'Crowdfunded', description: 'Community-funded startup' }
  ];

  const companySizes = [
    { value: 'solo', label: 'Solo Founder', description: '1 person' },
    { value: 'small', label: 'Small Team', description: '2-10 people' },
    { value: 'medium', label: 'Medium Team', description: '11-50 people' },
    { value: 'large', label: 'Large Team', description: '51-200 people' },
    { value: 'enterprise', label: 'Enterprise', description: '200+ people' }
  ];

  const toggleIndustry = (industry) => {
    const updatedIndustries = selectedIndustries.includes(industry)
      ? selectedIndustries.filter(i => i !== industry)
      : [...selectedIndustries, industry];
    
    setSelectedIndustries(updatedIndustries);
    setValue('tags', updatedIndustries);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Founder Profile</h2>
        <p className="text-text-secondary">
          Tell us about your entrepreneurial journey and current venture
        </p>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Bio / Founder Story *
          </label>
          <textarea
            {...register('bio', { required: 'Founder story is required' })}
            className="input-field h-24 resize-none"
            placeholder="Share your entrepreneurial journey, vision, and what drives you..."
          />
          {errors?.bio && (
            <p className="mt-1 text-sm text-error">{errors.bio.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Location *
          </label>
          <input
            type="text"
            {...register('location', { required: 'Location is required' })}
            className="input-field"
            placeholder="City, State/Country"
          />
          {errors?.location && (
            <p className="mt-1 text-sm text-error">{errors.location.message}</p>
          )}
        </div>
      </div>

      {/* Company Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Company Name
          </label>
          <input
            type="text"
            {...register('company')}
            className="input-field"
            placeholder="Your current startup/company"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Years of Experience
          </label>
          <input
            type="number"
            {...register('years_experience', { 
              min: { value: 0, message: 'Experience cannot be negative' },
              max: { value: 50, message: 'Please enter a valid number' }
            })}
            className="input-field"
            placeholder="Years as entrepreneur/founder"
            min="0"
            max="50"
          />
          {errors?.years_experience && (
            <p className="mt-1 text-sm text-error">{errors.years_experience.message}</p>
          )}
        </div>
      </div>

      {/* Industry Selection */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Industry Focus *
        </label>
        <p className="text-sm text-text-secondary mb-4">
          Select the industries you're working in or interested in
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {industries.map((industry) => (
            <button
              key={industry}
              type="button"
              onClick={() => toggleIndustry(industry)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${selectedIndustries.includes(industry)
                  ? 'bg-accent text-white' :'bg-surface border border-border hover:border-accent text-text-secondary hover:text-accent'
                }
              `}
            >
              {industry}
            </button>
          ))}
        </div>

        {selectedIndustries.length > 0 && (
          <div className="mt-4 p-4 bg-accent-50 rounded-lg">
            <p className="text-sm font-medium text-text-primary mb-2">
              Selected Industries ({selectedIndustries.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedIndustries.map((industry) => (
                <span
                  key={industry}
                  className="px-3 py-1 bg-accent text-white rounded-full text-sm font-medium"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedIndustries.length === 0 && (
          <p className="mt-2 text-sm text-error">Please select at least one industry</p>
        )}
      </div>

      {/* Startup Stage */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Current Startup Stage
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {startupStages.map((stage) => (
            <div
              key={stage.value}
              className={`
                cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                ${watch('startup_stage') === stage.value
                  ? 'border-accent bg-accent-50' :'border-border bg-surface hover:border-accent-300'
                }
              `}
              onClick={() => setValue('startup_stage', stage.value)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-text-primary">{stage.label}</h4>
                {watch('startup_stage') === stage.value && (
                  <Icon name="Check" size={16} color="var(--color-accent)" />
                )}
              </div>
              <p className="text-sm text-text-secondary">{stage.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Funding Status */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Funding Status
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fundingStatuses.map((funding) => (
            <div
              key={funding.value}
              className={`
                cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                ${watch('funding_status') === funding.value
                  ? 'border-accent bg-accent-50' :'border-border bg-surface hover:border-accent-300'
                }
              `}
              onClick={() => setValue('funding_status', funding.value)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-text-primary">{funding.label}</h4>
                {watch('funding_status') === funding.value && (
                  <Icon name="Check" size={16} color="var(--color-accent)" />
                )}
              </div>
              <p className="text-sm text-text-secondary">{funding.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Company Size */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Team Size
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {companySizes.map((size) => (
            <div
              key={size.value}
              className={`
                cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 text-center
                ${watch('company_size') === size.value
                  ? 'border-accent bg-accent-50' :'border-border bg-surface hover:border-accent-300'
                }
              `}
              onClick={() => setValue('company_size', size.value)}
            >
              <div className="flex items-center justify-center mb-2">
                <h4 className="font-semibold text-text-primary mr-2">{size.label}</h4>
                {watch('company_size') === size.value && (
                  <Icon name="Check" size={16} color="var(--color-accent)" />
                )}
              </div>
              <p className="text-sm text-text-secondary">{size.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            {...register('linkedin_url', {
              pattern: {
                value: /^https?:\/\/(www\.)?linkedin\.com\/.+/,
                message: 'Please enter a valid LinkedIn URL'
              }
            })}
            className="input-field"
            placeholder="https://linkedin.com/in/your-profile"
          />
          {errors?.linkedin_url && (
            <p className="mt-1 text-sm text-error">{errors.linkedin_url.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Company Website
          </label>
          <input
            type="url"
            {...register('website_url', {
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Please enter a valid URL'
              }
            })}
            className="input-field"
            placeholder="https://your-startup.com"
          />
          {errors?.website_url && (
            <p className="mt-1 text-sm text-error">{errors.website_url.message}</p>
          )}
        </div>
      </div>

      {/* Entrepreneurial Focus */}
      <div className="bg-accent-50 rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <Icon name="TrendingUp" size={24} color="var(--color-accent)" className="mr-3" />
          <h3 className="text-lg font-semibold text-text-primary">
            Entrepreneurial Interests
          </h3>
        </div>
        <p className="text-text-secondary text-sm mb-4">
          What aspects of entrepreneurship excite you most?
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            'Product Development', 'Team Building', 'Fundraising', 'Marketing', 
            'Sales', 'Operations', 'Technology', 'Innovation',
            'Scaling', 'Mentoring', 'Investing', 'Social Impact'
          ].map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => {
                const currentInterests = watch('entrepreneurial_interests') || [];
                const updatedInterests = currentInterests.includes(interest)
                  ? currentInterests.filter(i => i !== interest)
                  : [...currentInterests, interest];
                setValue('entrepreneurial_interests', updatedInterests);
              }}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left
                ${(watch('entrepreneurial_interests') || []).includes(interest)
                  ? 'bg-accent text-white' :'bg-surface border border-border hover:border-accent text-text-secondary hover:text-accent'
                }
              `}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FounderFields;