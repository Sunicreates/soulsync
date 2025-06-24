import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import AppImage from '../../../components/AppImage';

const ProfileDetailModal = ({ profile, onClose, onLike, onPass, theme, userProfession }) => {
  const [activeTab, setActiveTab] = useState('about');

  if (!profile) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getProfessionIcon = () => {
    switch (profile?.profession) {
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

  const getCompatibilityBreakdown = () => {
    const factors = [
      { label: 'Professional Values', score: 92, description: 'Similar work ethics and career goals' },
      { label: 'Experience Level', score: 85, description: 'Complementary experience ranges' },
      { label: 'Location Proximity', score: 78, description: 'Within reasonable distance' },
      { label: 'Industry Knowledge', score: 88, description: 'Overlapping professional interests' },
      { label: 'Communication Style', score: 90, description: 'Compatible interaction preferences' }
    ];

    return factors;
  };

  const getCommonInterests = () => {
    const interests = [
      'Professional Development',
      'Work-Life Balance',
      'Innovation & Technology',
      'Networking Events',
      'Continuous Learning'
    ];

    return interests;
  };

  const tabs = [
    { id: 'about', label: 'About', icon: 'User' },
    { id: 'compatibility', label: 'Compatibility', icon: 'Target' },
    { id: 'interests', label: 'Common Interests', icon: 'Heart' }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="relative">
          <div className="h-48 overflow-hidden">
            <AppImage
              src={profile?.avatar_url}
              alt={profile?.full_name}
              className="w-full h-full object-cover"
              fallback="/assets/images/no_image.png"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
          >
            <Icon name="X" size={20} />
          </button>

          {/* Profile Header */}
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-2xl font-bold mb-1">{profile?.full_name}</h2>
            <div className="flex items-center">
              <Icon name={getProfessionIcon()} size={16} className="mr-2" />
              <span className="capitalize">{profile?.profession}</span>
              {profile?.location && (
                <>
                  <span className="mx-2">•</span>
                  <span>{profile.location}</span>
                </>
              )}
            </div>
          </div>

          {/* Compatibility Badge */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-full px-3 py-1">
            <span className={`text-${theme.primary} font-bold`}>
              {profile?.compatibility || 85}% Match
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center py-4 px-6 text-sm font-medium transition-colors
                  ${activeTab === tab.id
                    ? `text-${theme.primary} border-b-2 border-${theme.primary}`
                    : 'text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                <Icon name={tab.icon} size={16} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* Bio */}
              {profile?.bio && (
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">About</h3>
                  <p className="text-text-secondary leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Professional Details */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Professional Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {profile?.company && (
                    <div>
                      <div className="text-sm text-text-muted">Company</div>
                      <div className="font-medium text-text-primary">{profile.company}</div>
                    </div>
                  )}
                  {profile?.years_experience && (
                    <div>
                      <div className="text-sm text-text-muted">Experience</div>
                      <div className="font-medium text-text-primary">{profile.years_experience} years</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills/Tags */}
              {profile?.tags && profile.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    {profile.profession === 'developer' ? 'Technical Skills' :
                     profile.profession === 'doctor' ? 'Specialties' : 'Industries'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 bg-${theme.primary}-100 text-${theme.primary}-700 rounded-full text-sm font-medium`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="flex space-x-4">
                {profile?.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:text-primary-700 transition-colors"
                  >
                    <Icon name="Linkedin" size={16} className="mr-2" />
                    LinkedIn
                  </a>
                )}
                {profile?.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:text-primary-700 transition-colors"
                  >
                    <Icon name="Github" size={16} className="mr-2" />
                    GitHub
                  </a>
                )}
                {profile?.website_url && (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:text-primary-700 transition-colors"
                  >
                    <Icon name="ExternalLink" size={16} className="mr-2" />
                    Website
                  </a>
                )}
              </div>
            </div>
          )}

          {activeTab === 'compatibility' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`text-4xl font-bold text-${theme.primary} mb-2`}>
                  {profile?.compatibility || 85}%
                </div>
                <p className="text-text-secondary">Overall Compatibility</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Compatibility Breakdown</h3>
                {getCompatibilityBreakdown().map((factor, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-text-primary">{factor.label}</span>
                      <span className={`font-bold text-${theme.primary}`}>{factor.score}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className={`bg-${theme.primary} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                    <p className="text-sm text-text-secondary">{factor.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'interests' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Shared Professional Interests</h3>
                <div className="grid grid-cols-1 gap-3">
                  {getCommonInterests().map((interest, index) => (
                    <div key={index} className="flex items-center p-3 bg-background rounded-lg">
                      <Icon name="Check" size={16} className={`text-${theme.primary} mr-3`} />
                      <span className="text-text-primary">{interest}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Icon name="Lightbulb" size={20} className="text-primary mr-2" />
                  <h4 className="font-semibold text-text-primary">Conversation Starters</h4>
                </div>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• Ask about their current projects or recent achievements</li>
                  <li>• Discuss industry trends and future predictions</li>
                  <li>• Share experiences about work-life balance strategies</li>
                  <li>• Exchange recommendations for professional development</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-border p-6">
          <div className="flex space-x-4">
            <button
              onClick={onPass}
              className="flex-1 btn-outline border-error text-error hover:bg-error hover:text-white"
            >
              <Icon name="X" size={20} className="mr-2" />
              Pass
            </button>
            <button
              onClick={onLike}
              className={`flex-1 btn-primary bg-gradient-to-r ${theme.gradient}`}
            >
              <Icon name="Heart" size={20} className="mr-2" />
              Like
            </button>
          </div>
          
          <button className="w-full mt-3 text-text-muted text-sm hover:text-text-secondary transition-colors">
            <Icon name="Flag" size={14} className="mr-1" />
            Report Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailModal;