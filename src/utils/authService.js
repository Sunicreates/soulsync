import supabase from './supabase';

class AuthService {
  // Get current session
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true, data }
    } catch (error) {
      console.log('Get session error:', error)
      return { success: false, error: 'Failed to get session' }
    }
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true, data }
    } catch (error) {
      console.log('Sign in error:', error)
      return { success: false, error: 'Failed to sign in' }
    }
  }

  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.fullName || '',
            profession: userData?.profession || null
          }
        }
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true, data }
    } catch (error) {
      console.log('Sign up error:', error)
      return { success: false, error: 'Failed to sign up' }
    }
  }

  // Sign in with GitHub OAuth (for developers)
  async signInWithGitHub() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true, data }
    } catch (error) {
      console.log('GitHub sign in error:', error)
      return { success: false, error: 'Failed to sign in with GitHub' }
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true }
    } catch (error) {
      console.log('Sign out error:', error)
      return { success: false, error: 'Failed to sign out' }
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true, data }
    } catch (error) {
      console.log('Reset password error:', error)
      return { success: false, error: 'Failed to send reset email' }
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true, data }
    } catch (error) {
      console.log('Get user profile error:', error)
      return { success: false, error: 'Failed to get user profile' }
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true, data }
    } catch (error) {
      console.log('Update user profile error:', error)
      return { success: false, error: 'Failed to update user profile' }
    }
  }

  // Listen for auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

const authService = new AuthService()
export default authService