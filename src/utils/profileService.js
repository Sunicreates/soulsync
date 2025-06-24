import supabase from './supabase';

class ProfileService {
  // Create or update user profile
  async updateProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('Update profile error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  }

  // Get user profile with all details
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: false, error: 'Profile not found' };
        }
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('Get profile error:', error);
      return { success: false, error: 'Failed to fetch profile' };
    }
  }

  // Get potential matches based on profession and preferences
  async getPotentialMatches(userId, filters = {}) {
    try {
      let query = supabase
        .from('user_profiles')
        .select('id, full_name, profession, bio, location, avatar_url, tags, years_experience')
        .neq('id', userId)
        .eq('is_active', true);

      // Apply profession filter
      if (filters?.profession) {
        query = query.eq('profession', filters.profession);
      }

      // Apply location filter
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      // Apply experience range filter
      if (filters?.minExperience) {
        query = query.gte('years_experience', filters.minExperience);
      }
      if (filters?.maxExperience) {
        query = query.lte('years_experience', filters.maxExperience);
      }

      // Limit results
      query = query.limit(filters?.limit || 10);

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.log('Get matches error:', error);
      return { success: false, error: 'Failed to fetch potential matches' };
    }
  }

  // Get daily compatible profiles
  async getDailyMatches(userId, limit = 5) {
    try {
      // Get user's profession first
      const profileResult = await this.getProfile(userId);
      if (!profileResult?.success) {
        return { success: false, error: 'Failed to get user profile' };
      }

      const userProfession = profileResult.data?.profession;

      // Get compatible profiles based on profession
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, profession, bio, location, avatar_url, tags, company, years_experience')
        .neq('id', userId)
        .eq('is_active', true)
        .not('profession', 'eq', userProfession) // Different profession for diversity
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.log('Get daily matches error:', error);
      return { success: false, error: 'Failed to fetch daily matches' };
    }
  }

  // Get profile stats
  async getProfileStats(userId) {
    try {
      // Get matches count
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('id')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .eq('status', 'accepted');

      if (matchesError) {
        console.log('Matches count error:', matchesError);
      }

      // Simulate other stats (can be implemented with proper tracking tables)
      const stats = {
        matches: matchesData?.length || 0,
        messages: 0, // Placeholder - implement when messaging is added
        profileViews: 0 // Placeholder - implement when view tracking is added
      };

      return { success: true, data: stats };
    } catch (error) {
      console.log('Get stats error:', error);
      return { success: false, error: 'Failed to fetch profile stats' };
    }
  }

  // Create match between users
  async createMatch(user1Id, user2Id) {
    try {
      const { data, error } = await supabase
        .from('matches')
        .insert({
          user1_id: user1Id,
          user2_id: user2Id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return { success: false, error: 'Match already exists' };
        }
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('Create match error:', error);
      return { success: false, error: 'Failed to create match' };
    }
  }

  // Update match status
  async updateMatchStatus(matchId, status) {
    try {
      const { data, error } = await supabase
        .from('matches')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', matchId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('Update match error:', error);
      return { success: false, error: 'Failed to update match status' };
    }
  }
}

const profileService = new ProfileService();
export default profileService;