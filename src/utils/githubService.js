import axios from 'axios';

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
  }

  // Import user profile from GitHub
  async importProfile(username) {
    try {
      const response = await axios.get(`${this.baseURL}/users/${username}`);
      
      if (response?.data) {
        return {
          success: true,
          data: {
            username: response.data.login,
            name: response.data.name || response.data.login,
            bio: response.data.bio || '',
            location: response.data.location || '',
            company: response.data.company || '',
            blog: response.data.blog || '',
            followers: response.data.followers || 0,
            following: response.data.following || 0,
            publicRepos: response.data.public_repos || 0,
            avatar: response.data.avatar_url || '',
            githubUrl: response.data.html_url || ''
          }
        };
      }
      
      return { success: false, error: 'No data found for this username' };
    } catch (error) {
      if (error?.response?.status === 404) {
        return { success: false, error: 'GitHub user not found' };
      }
      if (error?.response?.status === 403) {
        return { success: false, error: 'GitHub API rate limit exceeded' };
      }
      
      console.log('GitHub API error:', error);
      return { success: false, error: 'Failed to fetch GitHub profile' };
    }
  }

  // Get user repositories
  async getUserRepos(username, limit = 10) {
    try {
      const response = await axios.get(`${this.baseURL}/users/${username}/repos`, {
        params: {
          sort: 'updated',
          per_page: limit,
          type: 'owner'
        }
      });
      
      if (response?.data) {
        const repos = response.data.map(repo => ({
          name: repo.name,
          description: repo.description || '',
          language: repo.language || 'Unknown',
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          url: repo.html_url,
          isPrivate: repo.private
        }));
        
        return { success: true, data: repos };
      }
      
      return { success: false, error: 'No repositories found' };
    } catch (error) {
      console.log('GitHub repos error:', error);
      return { success: false, error: 'Failed to fetch repositories' };
    }
  }

  // Get programming languages used by the user
  async getUserLanguages(username) {
    try {
      const reposResult = await this.getUserRepos(username, 20);
      
      if (!reposResult?.success) {
        return { success: false, error: 'Failed to fetch repositories for language analysis' };
      }
      
      const languages = {};
      
      reposResult.data.forEach(repo => {
        if (repo?.language && repo.language !== 'Unknown') {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });
      
      const sortedLanguages = Object.entries(languages)
        .sort(([,a], [,b]) => b - a)
        .map(([language, count]) => ({ language, count }));
      
      return { success: true, data: sortedLanguages };
    } catch (error) {
      console.log('GitHub languages error:', error);
      return { success: false, error: 'Failed to analyze programming languages' };
    }
  }

  // Validate GitHub username format
  validateUsername(username) {
    if (!username) {
      return { valid: false, error: 'Username is required' };
    }
    
    if (username.length < 1 || username.length > 39) {
      return { valid: false, error: 'Username must be between 1 and 39 characters' };
    }
    
    // GitHub username pattern: alphanumeric and hyphens, cannot start/end with hyphen
    const pattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
    
    if (!pattern.test(username)) {
      return { valid: false, error: 'Invalid username format' };
    }
    
    return { valid: true };
  }
}

const githubService = new GitHubService();
export default githubService;