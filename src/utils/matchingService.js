import supabase from './supabase';

class MatchingService {
  // Get potential matches for browsing
  async getPotentialMatches(userId, limit = 10, excludeIds = []) {
    try {
      let query = supabase
        .from('user_profiles')
        .select(`
          id,
          full_name,
          profession,
          avatar_url,
          bio,
          location,
          company,
          years_experience,
          tags,
          github_url,
          linkedin_url,
          website_url,
          created_at
        `)
        .neq('id', userId)
        .eq('is_active', true)
        .limit(limit);

      // Exclude already swiped profiles
      if (excludeIds?.length > 0) {
        query = query.not('id', 'in', `(${excludeIds.join(',')})`);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      // Calculate compatibility percentage for each profile
      const profilesWithCompatibility = data?.map(profile => ({
        ...profile,
        compatibility: this.calculateCompatibility(profile, userId)
      })) || [];

      return { success: true, data: profilesWithCompatibility };
    } catch (error) {
      console.log('Get potential matches error:', error);
      return { success: false, error: 'Failed to load potential matches' };
    }
  }

  // Record a swipe decision
  async recordSwipe(userId, targetUserId, decision) {
    try {
      // Check if already swiped
      const { data: existingSwipe } = await supabase
        .from('swipes')
        .select('id')
        .eq('user_id', userId)
        .eq('target_user_id', targetUserId)
        .single();

      if (existingSwipe) {
        return { success: false, error: 'Already swiped on this profile' };
      }

      // Record the swipe
      const { data: swipeData, error: swipeError } = await supabase
        .from('swipes')
        .insert({
          user_id: userId,
          target_user_id: targetUserId,
          decision: decision,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (swipeError) {
        return { success: false, error: swipeError.message };
      }

      // If it's a like, check for mutual match
      if (decision === 'like') {
        const matchResult = await this.checkForMatch(userId, targetUserId);
        return { 
          success: true, 
          data: swipeData,
          isMatch: matchResult?.success && matchResult?.data 
        };
      }

      return { success: true, data: swipeData, isMatch: false };
    } catch (error) {
      console.log('Record swipe error:', error);
      return { success: false, error: 'Failed to record swipe' };
    }
  }

  // Check for mutual match
  async checkForMatch(userId, targetUserId) {
    try {
      // Check if target user has liked current user
      const { data: mutualLike } = await supabase
        .from('swipes')
        .select('id')
        .eq('user_id', targetUserId)
        .eq('target_user_id', userId)
        .eq('decision', 'like')
        .single();

      if (mutualLike) {
        // Create match record
        const { data: matchData, error: matchError } = await supabase
          .from('matches')
          .insert({
            user1_id: userId,
            user2_id: targetUserId,
            status: 'accepted',
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (matchError) {
          return { success: false, error: matchError.message };
        }

        return { success: true, data: matchData };
      }

      return { success: true, data: null };
    } catch (error) {
      console.log('Check for match error:', error);
      return { success: false, error: 'Failed to check for match' };
    }
  }

  // Get user's swiped profile IDs
  async getSwipedProfileIds(userId) {
    try {
      const { data, error } = await supabase
        .from('swipes')
        .select('target_user_id')
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      const swipedIds = data?.map(swipe => swipe.target_user_id) || [];
      return { success: true, data: swipedIds };
    } catch (error) {
      console.log('Get swiped profile IDs error:', error);
      return { success: false, error: 'Failed to get swiped profiles' };
    }
  }

  // Undo last swipe (if within time limit)
  async undoLastSwipe(userId) {
    try {
      // Get last swipe within 30 seconds
      const thirtySecondsAgo = new Date(Date.now() - 30000).toISOString();
      
      const { data: lastSwipe } = await supabase
        .from('swipes')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', thirtySecondsAgo)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!lastSwipe) {
        return { success: false, error: 'No recent swipe to undo' };
      }

      // Delete the swipe
      const { error: deleteError } = await supabase
        .from('swipes')
        .delete()
        .eq('id', lastSwipe.id);

      if (deleteError) {
        return { success: false, error: deleteError.message };
      }

      // If it was a like that created a match, remove the match
      if (lastSwipe.decision === 'like') {
        await supabase
          .from('matches')
          .delete()
          .eq('user1_id', userId)
          .eq('user2_id', lastSwipe.target_user_id);
      }

      return { success: true, data: lastSwipe };
    } catch (error) {
      console.log('Undo swipe error:', error);
      return { success: false, error: 'Failed to undo swipe' };
    }
  }

  // Calculate compatibility percentage (simplified algorithm)
  calculateCompatibility(profile, userId) {
    // This is a simplified compatibility calculation
    // In a real app, this would consider many more factors
    let score = 50; // Base score

    // Location proximity
    if (profile?.location) {
      score += 20;
    }

    // Experience level
    if (profile?.years_experience) {
      score += 15;
    }

    // Complete profile
    if (profile?.bio && profile?.avatar_url) {
      score += 15;
    }

    // Return a percentage between 60-95
    return Math.min(95, Math.max(60, score));
  }

  // Get user's matches
  async getUserMatches(userId) {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          created_at,
          user1:user1_id(id, full_name, avatar_url, profession),
          user2:user2_id(id, full_name, avatar_url, profession)
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.log('Get user matches error:', error);
      return { success: false, error: 'Failed to get matches' };
    }
  }

  // Filter profiles by profession
  async getProfilesByProfession(userId, profession, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          full_name,
          profession,
          avatar_url,
          bio,
          location,
          company,
          years_experience,
          tags,
          github_url,
          linkedin_url,
          website_url
        `)
        .eq('profession', profession)
        .neq('id', userId)
        .eq('is_active', true)
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.log('Get profiles by profession error:', error);
      return { success: false, error: 'Failed to filter profiles' };
    }
  }
}

const matchingService = new MatchingService();
export default matchingService;