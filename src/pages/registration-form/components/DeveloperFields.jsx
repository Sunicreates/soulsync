import React, { useState } from 'react';
import githubService from '../../../utils/githubService';
import Icon from '../../../components/AppIcon';

const DeveloperFields = ({ register, errors, setValue, watch }) => {
  const [githubUsername, setGithubUsername] = useState('');
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState('');
  const [githubData, setGithubData] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState(watch('tags') || []);

  const popularSkills = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
    'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP',
    'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'Redis',
    'GraphQL', 'REST APIs', 'Microservices', 'DevOps',
    'Machine Learning', 'Data Science', 'Blockchain', 'Mobile Development'
  ];

  const handleGitHubImport = async () => {
    if (!githubUsername.trim()) {
      setGithubError('Please enter a GitHub username');
      return;
    }

    const validation = githubService.validateUsername(githubUsername);
    if (!validation.valid) {
      setGithubError(validation.error);
      return;
    }

    setGithubLoading(true);
    setGithubError('');

    try {
      const result = await githubService.importProfile(githubUsername);
      
      if (result?.success) {
        const profile = result.data;
        setGithubData(profile);
        
        // Auto-fill form fields
        if (profile.name) setValue('full_name', profile.name);
        if (profile.bio) setValue('bio', profile.bio);
        if (profile.location) setValue('location', profile.location);
        if (profile.company) setValue('company', profile.company);
        if (profile.githubUrl) setValue('github_url', profile.githubUrl);
        if (profile.blog) setValue('website_url', profile.blog);
        
        // Get user's programming languages
        const languagesResult = await githubService.getUserLanguages(githubUsername);
        if (languagesResult?.success && languagesResult.data?.length > 0) {
          const topLanguages = languagesResult.data.slice(0, 5).map(lang => lang.language);
          const updatedSkills = [...new Set([...selectedSkills, ...topLanguages])];
          setSelectedSkills(updatedSkills);
          setValue('tags', updatedSkills);
        }
        
      } else {
        setGithubError(result?.error || 'Failed to import GitHub profile');
      }
    } catch (error) {
      console.log('GitHub import error:', error);
      setGithubError('Something went wrong. Please try again.');
    } finally {
      setGithubLoading(false);
    }
  };

  const toggleSkill = (skill) => {
    const updatedSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    
    setSelectedSkills(updatedSkills);
    setValue('tags', updatedSkills);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Developer Profile</h2>
        <p className="text-text-secondary">
          Import from GitHub or manually add your information
        </p>
      </div>

      {/* GitHub Import Section */}
      <div className="bg-primary-50 rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <Icon name="Github" size={24} color="var(--color-primary)" className="mr-3" />
          <h3 className="text-lg font-semibold text-text-primary">
            Import from GitHub
          </h3>
        </div>
        
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="Enter your GitHub username"
              className="input-field"
              disabled={githubLoading}
            />
          </div>
          <button
            type="button"
            onClick={handleGitHubImport}
            disabled={githubLoading || !githubUsername.trim()}
            className="btn-primary whitespace-nowrap"
          >
            {githubLoading ? (
              <>
                <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Icon name="Download" size={20} className="mr-2" />
                Import
              </>
            )}
          </button>
        </div>

        {githubError && (
          <div className="mt-3 p-3 bg-error-50 border border-error-200 rounded-lg">
            <div className="flex items-center">
              <Icon name="AlertCircle" size={16} color="var(--color-error)" className="mr-2" />
              <span className="text-error text-sm">{githubError}</span>
            </div>
          </div>
        )}

        {githubData && (
          <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Icon name="CheckCircle" size={16} color="var(--color-success)" className="mr-2" />
              <span className="text-success text-sm font-medium">Profile imported successfully!</span>
            </div>
            <p className="text-text-secondary text-sm">
              {githubData.publicRepos} repositories • {githubData.followers} followers
            </p>
          </div>
        )}
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Bio / About *
          </label>
          <textarea
            {...register('bio', { required: 'Bio is required' })}
            className="input-field h-24 resize-none"
            placeholder="Tell us about yourself and your coding journey..."
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Company
          </label>
          <input
            type="text"
            {...register('company')}
            className="input-field"
            placeholder="Current company or organization"
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
            placeholder="Years of programming experience"
            min="0"
            max="50"
          />
          {errors?.years_experience && (
            <p className="mt-1 text-sm text-error">{errors.years_experience.message}</p>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            GitHub URL
          </label>
          <input
            type="url"
            {...register('github_url', {
              pattern: {
                value: /^https?:\/\/(www\.)?github\.com\/.+/,
                message: 'Please enter a valid GitHub URL'
              }
            })}
            className="input-field"
            placeholder="https://github.com/username"
          />
          {errors?.github_url && (
            <p className="mt-1 text-sm text-error">{errors.github_url.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            LinkedIn URL
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
            placeholder="https://linkedin.com/in/username"
          />
          {errors?.linkedin_url && (
            <p className="mt-1 text-sm text-error">{errors.linkedin_url.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Website/Portfolio
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
          placeholder="https://your-portfolio.com"
        />
        {errors?.website_url && (
          <p className="mt-1 text-sm text-error">{errors.website_url.message}</p>
        )}
      </div>

      {/* Skills Section */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Technical Skills
        </label>
        <p className="text-sm text-text-secondary mb-4">
          Select your technical skills and technologies
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {popularSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${selectedSkills.includes(skill)
                  ? 'bg-primary text-white' :'bg-surface border border-border hover:border-primary text-text-secondary hover:text-primary'
                }
              `}
            >
              {skill}
            </button>
          ))}
        </div>

        {selectedSkills.length > 0 && (
          <div className="mt-4 p-4 bg-primary-50 rounded-lg">
            <p className="text-sm font-medium text-text-primary mb-2">
              Selected Skills ({selectedSkills.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperFields;