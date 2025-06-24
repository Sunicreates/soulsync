import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import DashboardHeader from './components/DashboardHeader';
import QuickStats from './components/QuickStats';
import DailyMatches from './components/DailyMatches';
import NavigationSection from './components/NavigationSection';
import NotificationBell from './components/NotificationBell';
import MobileBottomNav from './components/MobileBottomNav';
import profileService from '../../utils/profileService';
import Icon from '../../components/AppIcon';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();
  const [stats, setStats] = useState({ matches: 0, messages: 0, profileViews: 0 });
  const [dailyMatches, setDailyMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    const loadDashboardData = async () => {
      setLoading(true);

      try {
        // Load profile stats
        const statsResult = await profileService.getProfileStats(user.id);
        if (statsResult?.success) {
          setStats(statsResult.data);
        }

        // Load daily matches
        const matchesResult = await profileService.getDailyMatches(user.id, 5);
        if (matchesResult?.success) {
          setDailyMatches(matchesResult.data);
        }

        // Simulate notifications (can be replaced with real-time data)
        setNotifications([
          { id: 1, type: 'match', message: 'You have a new match!', time: '2 hours ago' },
          { id: 2, type: 'message', message: 'Sarah sent you a message', time: '1 day ago' }
        ]);
      } catch (error) {
        console.log('Dashboard load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleFindMatches = () => {
    navigate('/matches');
  };

  const handleMessages = () => {
    navigate('/messages');
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  const getProfessionTheme = () => {
    switch (userProfile?.profession) {
      case 'developer':
        return {
          primary: 'primary',
          gradient: 'from-primary-500 to-blue-600',
          icon: 'Code',
          greeting: 'Ready to build connections?'
        };
      case 'doctor':
        return {
          primary: 'secondary',
          gradient: 'from-secondary-500 to-green-600',
          icon: 'Stethoscope',
          greeting: 'Heal hearts, find yours'
        };
      case 'founder':
        return {
          primary: 'accent',
          gradient: 'from-accent-500 to-purple-600',
          icon: 'TrendingUp',
          greeting: 'Scale your personal network'
        };
      default:
        return {
          primary: 'primary',
          gradient: 'from-primary-500 to-secondary-500',
          icon: 'Heart',
          greeting: 'Connect with professionals'
        };
    }
  };

  const theme = getProfessionTheme();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-secondary">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={true}
        user={userProfile}
        onSignOut={handleSignOut}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Profession-themed Header */}
        <DashboardHeader 
          user={userProfile}
          theme={theme}
          stats={stats}
        />

        {/* Quick Stats */}
        <QuickStats 
          stats={stats}
          theme={theme}
        />

        {/* Daily Compatible Profiles */}
        <DailyMatches 
          matches={dailyMatches}
          onViewAll={handleFindMatches}
          theme={theme}
        />

        {/* Three-section Navigation */}
        <NavigationSection 
          onFindMatches={handleFindMatches}
          onMessages={handleMessages}
          onEditProfile={handleEditProfile}
          messageCount={stats.messages}
          theme={theme}
        />

        {/* Notification Bell (Desktop) */}
        <div className="hidden md:block fixed top-4 right-4 z-50">
          <NotificationBell 
            notifications={notifications}
            onClearAll={() => setNotifications([])}
          />
        </div>

        {/* Profile Completion Reminder */}
        {(!userProfile?.avatar_url || !userProfile?.bio) && (
          <div className="mt-8 bg-gradient-to-r from-warning-50 to-orange-50 rounded-2xl p-6 border border-warning-200">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="AlertTriangle" size={24} color="var(--color-warning)" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Complete Your Profile
                </h3>
                <p className="text-text-secondary mb-4">
                  Profiles with photos and detailed bios get 5x more matches. Take a few minutes to enhance your profile.
                </p>
                <div className="flex flex-wrap gap-2">
                  {!userProfile?.avatar_url && (
                    <button 
                      onClick={handleEditProfile}
                      className="btn-primary text-sm"
                    >
                      <Icon name="Camera" size={16} className="mr-2" />
                      Add Photo
                    </button>
                  )}
                  {!userProfile?.bio && (
                    <button 
                      onClick={handleEditProfile}
                      className="btn-outline text-sm"
                    >
                      <Icon name="Edit" size={16} className="mr-2" />
                      Write Bio
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        onFindMatches={handleFindMatches}
        onMessages={handleMessages}
        onEditProfile={handleEditProfile}
        onNotifications={() => {/* Handle notifications */}}
        messageCount={stats.messages}
        notificationCount={notifications.length}
        currentPage="dashboard"
      />
    </div>
  );
};

export default Dashboard;