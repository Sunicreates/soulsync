import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import Icon from '../../../components/AppIcon';
import AppImage from '../../../components/AppImage';

const SwipeableCard = forwardRef(({ 
  profile, 
  onSwipe, 
  onViewDetails,
  theme, 
  userProfession,
  isPreview = false 
}, ref) => {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const cardRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });

  useImperativeHandle(ref, () => ({
    simulateSwipe: (direction) => {
      const swipeDistance = direction === 'right' ? 300 : -300;
      setDragOffset({ x: swipeDistance, y: 0 });
      
      setTimeout(() => {
        onSwipe?.(direction);
        setDragOffset({ x: 0, y: 0 });
      }, 300);
    }
  }));

  const handleStart = (clientX, clientY) => {
    if (isPreview) return;
    
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging || isPreview) return;

    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY * 0.3 }); // Reduce vertical movement
  };

  const handleEnd = () => {
    if (!isDragging || isPreview) return;
    
    setIsDragging(false);
    
    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold) {
      const direction = dragOffset.x > 0 ? 'right' : 'left';
      onSwipe?.(direction);
    }
    
    setDragOffset({ x: 0, y: 0 });
  };

  // Mouse events
  const handleMouseDown = (e) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  const getCardStyle = () => {
    const rotation = dragOffset.x * 0.1;
    const opacity = Math.max(0.7, 1 - Math.abs(dragOffset.x) / 300);
    
    return {
      transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
      opacity: isPreview ? 0.3 : opacity,
      transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
      zIndex: isPreview ? 1 : 10
    };
  };

  const getSwipeIndicator = () => {
    if (Math.abs(dragOffset.x) < 50) return null;
    
    return dragOffset.x > 0 ? (
      <div className="absolute top-8 left-8 bg-success bg-opacity-90 text-white px-4 py-2 rounded-lg font-bold text-lg border-2 border-success rotate-12">
        LIKE
      </div>
    ) : (
      <div className="absolute top-8 right-8 bg-error bg-opacity-90 text-white px-4 py-2 rounded-lg font-bold text-lg border-2 border-error -rotate-12">
        PASS
      </div>
    );
  };

  const getProfessionTheme = () => {
    switch (profile?.profession) {
      case 'developer':
        return {
          bgClass: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800',
          accentColor: 'text-blue-400',
          iconColor: 'text-green-400',
          tagStyle: 'bg-slate-800 text-blue-300 border-blue-600'
        };
      case 'doctor':
        return {
          bgClass: 'bg-gradient-to-br from-emerald-50 via-white to-blue-50',
          accentColor: 'text-emerald-600',
          iconColor: 'text-red-500',
          tagStyle: 'bg-emerald-100 text-emerald-700 border-emerald-300'
        };
      case 'founder':
        return {
          bgClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
          accentColor: 'text-purple-400',
          iconColor: 'text-yellow-400',
          tagStyle: 'bg-purple-800 text-purple-300 border-purple-600'
        };
      default:
        return {
          bgClass: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
          accentColor: 'text-gray-600',
          iconColor: 'text-gray-500',
          tagStyle: 'bg-gray-100 text-gray-700 border-gray-300'
        };
    }
  };

  const professionTheme = getProfessionTheme();

  const renderDeveloperCard = () => (
    <div className={`${professionTheme.bgClass} rounded-2xl shadow-2xl overflow-hidden h-full relative border border-slate-700`}>
      {/* Code Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="font-mono text-xs leading-tight p-4 text-blue-300">
          {`const profile = {
  name: "${profile?.full_name}",
  skills: [${profile?.tags?.slice(0, 3)?.map(tag => `"${tag}"`).join(', ')}],
  experience: ${profile?.years_experience || 0},
  location: "${profile?.location || 'Remote'}"
};`}
        </div>
      </div>

      {/* Profile Image */}
      <div className="relative h-64 overflow-hidden">
        <AppImage
          src={profile?.avatar_url}
          alt={profile?.full_name}
          className="w-full h-full object-cover"
          fallback="/assets/images/no_image.png"
        />
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 rounded-lg px-3 py-1">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            <span className="text-green-400 text-sm font-mono">online</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">{profile?.full_name}</h3>
            <p className="text-blue-300 flex items-center">
              <Icon name="Code" size={16} className="mr-2" />
              {profile?.company || 'Software Developer'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-400">
              {profile?.compatibility || 85}%
            </div>
            <div className="text-xs text-gray-400">match</div>
          </div>
        </div>

        {/* GitHub Contributions Visual */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Icon name="Github" size={16} className="mr-2 text-green-400" />
            <span className="text-sm text-gray-300">GitHub Activity</span>
          </div>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 84 }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-sm ${
                  Math.random() > 0.3 
                    ? 'bg-green-500' 
                    : Math.random() > 0.7 
                    ? 'bg-green-300' :'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {profile?.tags?.slice(0, 4)?.map((tag, index) => (
              <span key={index} className={`px-2 py-1 rounded-full text-xs border ${professionTheme.tagStyle}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="flex items-center text-sm text-gray-300">
          <Icon name="Calendar" size={16} className="mr-2" />
          <span>{profile?.years_experience || 0}+ years experience</span>
        </div>
      </div>
    </div>
  );

  const renderDoctorCard = () => (
    <div className={`${professionTheme.bgClass} rounded-2xl shadow-2xl overflow-hidden h-full relative border border-emerald-200`}>
      {/* Medical Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 gap-4 p-4">
          {Array.from({ length: 32 }, (_, i) => (
            <Icon key={i} name="Heart" size={20} className="text-emerald-600" />
          ))}
        </div>
      </div>

      {/* Profile Image */}
      <div className="relative h-64 overflow-hidden">
        <AppImage
          src={profile?.avatar_url}
          alt={profile?.full_name}
          className="w-full h-full object-cover"
          fallback="/assets/images/no_image.png"
        />
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg px-3 py-1">
          <div className="flex items-center">
            <Icon name="Stethoscope" size={16} className="mr-2 text-emerald-600" />
            <span className="text-emerald-700 text-sm font-semibold">Verified MD</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{profile?.full_name}</h3>
            <p className="text-emerald-600 flex items-center font-medium">
              <Icon name="MapPin" size={16} className="mr-2" />
              {profile?.company || 'Medical Center'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-emerald-600">
              {profile?.compatibility || 92}%
            </div>
            <div className="text-xs text-gray-500">compatibility</div>
          </div>
        </div>

        {/* Medical Specialties */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Specialties</h4>
          <div className="flex flex-wrap gap-2">
            {profile?.tags?.slice(0, 3)?.map((tag, index) => (
              <span key={index} className={`px-3 py-1 rounded-full text-xs border ${professionTheme.tagStyle}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Patient Care Score */}
        <div className="mb-4 bg-emerald-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-emerald-700">Patient Satisfaction</span>
            <span className="text-sm font-bold text-emerald-600">4.9/5.0</span>
          </div>
          <div className="flex">
            {Array.from({ length: 5 }, (_, i) => (
              <Icon key={i} name="Star" size={16} className="text-yellow-400 fill-current" />
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="flex items-center text-sm text-gray-600">
          <Icon name="Award" size={16} className="mr-2 text-emerald-600" />
          <span>{profile?.years_experience || 0}+ years of practice</span>
        </div>
      </div>
    </div>
  );

  const renderFounderCard = () => (
    <div className={`${professionTheme.bgClass} rounded-2xl shadow-2xl overflow-hidden h-full relative border border-purple-600`}>
      {/* Business Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-6 gap-6 p-6">
          {Array.from({ length: 18 }, (_, i) => (
            <Icon key={i} name="TrendingUp" size={24} className="text-purple-400" />
          ))}
        </div>
      </div>

      {/* Profile Image */}
      <div className="relative h-64 overflow-hidden">
        <AppImage
          src={profile?.avatar_url}
          alt={profile?.full_name}
          className="w-full h-full object-cover"
          fallback="/assets/images/no_image.png"
        />
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 rounded-lg px-3 py-1">
          <div className="flex items-center">
            <Icon name="Briefcase" size={16} className="mr-2 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-semibold">CEO</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">{profile?.full_name}</h3>
            <p className="text-purple-300 flex items-center font-medium">
              <Icon name="Building" size={16} className="mr-2" />
              {profile?.company || 'Startup Founder'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-purple-400">
              {profile?.compatibility || 88}%
            </div>
            <div className="text-xs text-gray-400">synergy</div>
          </div>
        </div>

        {/* Startup Stage */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Company Stage</span>
            <span className="text-sm font-bold text-purple-400">Series B</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-yellow-400 h-2 rounded-full" style={{ width: '70%' }} />
          </div>
        </div>

        {/* Industries */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Industries</h4>
          <div className="flex flex-wrap gap-2">
            {profile?.tags?.slice(0, 3)?.map((tag, index) => (
              <span key={index} className={`px-3 py-1 rounded-full text-xs border ${professionTheme.tagStyle}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">$2.5M</div>
            <div className="text-xs text-gray-400">Raised</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">25+</div>
            <div className="text-xs text-gray-400">Team Size</div>
          </div>
        </div>

        {/* Experience */}
        <div className="flex items-center text-sm text-gray-300">
          <Icon name="Rocket" size={16} className="mr-2 text-yellow-400" />
          <span>{profile?.years_experience || 0}+ years building companies</span>
        </div>
      </div>
    </div>
  );

  const renderDefaultCard = () => (
    <div className={`${professionTheme.bgClass} rounded-2xl shadow-2xl overflow-hidden h-full relative border border-gray-200`}>
      <div className="relative h-64 overflow-hidden">
        <AppImage
          src={profile?.avatar_url}
          alt={profile?.full_name}
          className="w-full h-full object-cover"
          fallback="/assets/images/no_image.png"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{profile?.full_name}</h3>
            <p className="text-gray-600">{profile?.company}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              {profile?.compatibility || 80}%
            </div>
            <div className="text-xs text-gray-500">match</div>
          </div>
        </div>

        {profile?.bio && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">{profile.bio}</p>
        )}

        {profile?.location && (
          <div className="flex items-center text-sm text-gray-600">
            <Icon name="MapPin" size={16} className="mr-2" />
            <span>{profile.location}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderCardContent = () => {
    switch (profile?.profession) {
      case 'developer':
        return renderDeveloperCard();
      case 'doctor':
        return renderDoctorCard();
      case 'founder':
        return renderFounderCard();
      default:
        return renderDefaultCard();
    }
  };

  return (
    <div
      ref={cardRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing select-none"
      style={getCardStyle()}
      onMouseDown={handleMouseDown}
      onMouseMove={isDragging ? handleMouseMove : undefined}
      onMouseUp={isDragging ? handleMouseUp : undefined}
      onMouseLeave={isDragging ? handleMouseUp : undefined}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {renderCardContent()}
      {getSwipeIndicator()}
      
      {/* Quick Actions (on hover/touch) */}
      {!isPreview && (
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(profile);
            }}
            className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-100 transition-all"
          >
            <Icon name="Info" size={20} className="text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
});

SwipeableCard.displayName = 'SwipeableCard';

export default SwipeableCard;