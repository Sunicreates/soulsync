import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import SwipeableCard from './components/SwipeableCard';
import DecisionButtons from './components/DecisionButtons';
import FilterOptions from './components/FilterOptions';
import MatchModal from './components/MatchModal';
import ProfileDetailModal from './components/ProfileDetailModal';
import EmptyState from './components/EmptyState';
import LoadingState from './components/LoadingState';
import matchingService from '../../utils/matchingService';
import Icon from '../../components/AppIcon';

const BrowseMatches = () => {
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipedProfiles, setSwipedProfiles] = useState([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [matchedProfile, setMatchedProfile] = useState(null);
  const [canUndo, setCanUndo] = useState(false);
  const [filters, setFilters] = useState({
    profession: 'all',
    location: 'all',
    ageRange: [25, 45]
  });
  const [dailySwipeCount, setDailySwipeCount] = useState(0);
  const [error, setError] = useState(null);
  const swipeStartTime = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!user?.id) return;

    loadProfiles();
  }, [user?.id, filters]);

  const loadProfiles = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get already swiped profiles
      const swipedResult = await matchingService.getSwipedProfileIds(user.id);
      const excludeIds = swipedResult?.success ? swipedResult.data : [];

      // Load potential matches
      const result = await matchingService.getPotentialMatches(
        user.id, 
        20, 
        excludeIds
      );

      if (result?.success) {
        setProfiles(result.data || []);
        setSwipedProfiles(excludeIds);
        setCurrentIndex(0);
      } else {
        setError(result?.error || 'Failed to load profiles');
      }
    } catch (error) {
      console.log('Load profiles error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeDecision = async (decision) => {
    if (currentIndex >= profiles.length || dailySwipeCount >= 50) return;

    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    // Trigger haptic feedback
    if (navigator?.vibrate) {
      navigator.vibrate(decision === 'like' ? [50, 50, 50] : [100]);
    }

    try {
      const result = await matchingService.recordSwipe(
        user.id,
        currentProfile.id,
        decision
      );

      if (result?.success) {
        setDailySwipeCount(prev => prev + 1);
        setSwipedProfiles(prev => [...prev, currentProfile.id]);
        
        // Check for match
        if (result.isMatch && decision === 'like') {
          setMatchedProfile(currentProfile);
          setShowMatchModal(true);
        }

        // Move to next profile
        setCurrentIndex(prev => prev + 1);
        setCanUndo(true);
        swipeStartTime.current = Date.now();

        // Disable undo after 5 seconds
        setTimeout(() => {
          if (swipeStartTime.current && Date.now() - swipeStartTime.current >= 5000) {
            setCanUndo(false);
          }
        }, 5000);
      } else {
        setError(result?.error || 'Failed to record decision');
      }
    } catch (error) {
      console.log('Swipe decision error:', error);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleUndo = async () => {
    if (!canUndo || currentIndex === 0) return;

    try {
      const result = await matchingService.undoLastSwipe(user.id);
      
      if (result?.success) {
        setCurrentIndex(prev => prev - 1);
        setDailySwipeCount(prev => Math.max(0, prev - 1));
        setCanUndo(false);
        
        // Remove from swiped profiles
        if (result.data?.target_user_id) {
          setSwipedProfiles(prev => 
            prev.filter(id => id !== result.data.target_user_id)
          );
        }
      } else {
        setError(result?.error || 'Cannot undo this action');
      }
    } catch (error) {
      console.log('Undo error:', error);
      setError('Failed to undo action');
    }
  };

  const handleCardSwipe = (direction) => {
    const decision = direction === 'right' ? 'like' : 'pass';
    handleSwipeDecision(decision);
  };

  const handleViewDetails = (profile) => {
    setSelectedProfile(profile);
    setShowProfileDetail(true);
  };

  const handleProfileDetailAction = (action) => {
    if (action === 'like') {
      handleSwipeDecision('like');
    } else if (action === 'pass') {
      handleSwipeDecision('pass');
    }
    setShowProfileDetail(false);
    setSelectedProfile(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getProfessionTheme = () => {
    switch (userProfile?.profession) {
      case 'developer':
        return {
          primary: 'primary',
          gradient: 'from-primary-500 to-blue-600',
          bgPattern: 'code-pattern'
        };
      case 'doctor':
        return {
          primary: 'secondary',
          gradient: 'from-secondary-500 to-green-600',
          bgPattern: 'medical-pattern'
        };
      case 'founder':
        return {
          primary: 'accent',
          gradient: 'from-accent-500 to-purple-600',
          bgPattern: 'business-pattern'
        };
      default:
        return {
          primary: 'primary',
          gradient: 'from-primary-500 to-secondary-500',
          bgPattern: 'default-pattern'
        };
    }
  };

  const theme = getProfessionTheme();
  const currentProfile = profiles[currentIndex];
  const remainingProfiles = profiles.length - currentIndex;

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={true}
        user={userProfile}
        onSignOut={handleSignOut}
      />

      <main className="max-w-md mx-auto px-4 py-8 pb-24">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Discover Matches
          </h1>
          <div className="flex items-center justify-center space-x-4 text-sm text-text-secondary">
            <span>{remainingProfiles} profiles remaining</span>
            <span>•</span>
            <span>{50 - dailySwipeCount} swipes left</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-error text-sm">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-error hover:text-error-dark text-xs mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filter Options */}
        <FilterOptions 
          filters={filters}
          onFiltersChange={setFilters}
          theme={theme}
          className="mb-6"
        />

        {/* Daily Limit Warning */}
        {dailySwipeCount >= 45 && (
          <div className="mb-4 p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <div className="flex items-center">
              <Icon name="AlertTriangle" size={20} className="text-warning mr-2" />
              <p className="text-warning text-sm">
                Almost reached daily limit! {50 - dailySwipeCount} swipes remaining.
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {currentProfile ? (
          <div className="relative">
            {/* Swipeable Card */}
            <div className="relative h-[600px] mb-6">
              <SwipeableCard
                ref={cardRef}
                profile={currentProfile}
                onSwipe={handleCardSwipe}
                onViewDetails={handleViewDetails}
                theme={theme}
                userProfession={userProfile?.profession}
              />
              
              {/* Show next card preview */}
              {profiles[currentIndex + 1] && (
                <div className="absolute inset-0 -z-10 transform scale-95 opacity-30">
                  <SwipeableCard
                    profile={profiles[currentIndex + 1]}
                    theme={theme}
                    userProfession={userProfile?.profession}
                    isPreview={true}
                  />
                </div>
              )}
            </div>

            {/* Decision Buttons */}
            <DecisionButtons
              onPass={() => handleSwipeDecision('pass')}
              onLike={() => handleSwipeDecision('like')}
              onUndo={handleUndo}
              canUndo={canUndo}
              theme={theme}
              disabled={dailySwipeCount >= 50}
            />
          </div>
        ) : (
          <EmptyState 
            onRefresh={loadProfiles}
            onAdjustFilters={() => setFilters({
              profession: 'all',
              location: 'all',
              ageRange: [25, 45]
            })}
            theme={theme}
          />
        )}

        {/* Progress Indicator */}
        {profiles.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between text-xs text-text-secondary mb-2">
              <span>Profile {currentIndex + 1}</span>
              <span>{profiles.length} total</span>
            </div>
            <div className="w-full bg-surface-light rounded-full h-1">
              <div 
                className={`bg-gradient-to-r ${theme.gradient} h-1 rounded-full transition-all duration-300`}
                style={{ width: `${((currentIndex + 1) / profiles.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Spacer */}
      <div className="h-20 md:h-0" />

      {/* Match Modal */}
      {showMatchModal && matchedProfile && (
        <MatchModal
          matchedProfile={matchedProfile}
          onClose={() => {
            setShowMatchModal(false);
            setMatchedProfile(null);
          }}
          onMessage={() => {
            setShowMatchModal(false);
            navigate('/messages');
          }}
          theme={theme}
        />
      )}

      {/* Profile Detail Modal */}
      {showProfileDetail && selectedProfile && (
        <ProfileDetailModal
          profile={selectedProfile}
          onClose={() => {
            setShowProfileDetail(false);
            setSelectedProfile(null);
          }}
          onLike={() => handleProfileDetailAction('like')}
          onPass={() => handleProfileDetailAction('pass')}
          theme={theme}
          userProfession={userProfile?.profession}
        />
      )}
    </div>
  );
};

export default BrowseMatches;