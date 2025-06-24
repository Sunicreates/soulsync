import React from 'react';
import Icon from '../../../components/AppIcon';


const HeroSection = ({ onGetStarted }) => {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-background to-secondary-50 pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Headline */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-text-primary mb-6 leading-tight">
              <span className="block">Matchmaking for</span>
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Developers, Doctors,
              </span>
              <span className="block bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
                and Founders
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-text-secondary max-w-4xl mx-auto mb-8 leading-relaxed">
              Connect with like-minded professionals who understand your passion, ambition, and the unique challenges of your career. Find meaningful relationships built on shared professional values.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={onGetStarted}
              className="btn-primary text-lg px-8 py-4 w-full sm:w-auto inline-flex items-center justify-center group"
            >
              <Icon name="Heart" size={20} className="mr-2 group-hover:scale-110 transition-transform duration-200" />
              Get Started Free
            </button>
            
            <button className="btn-outline text-lg px-8 py-4 w-full sm:w-auto inline-flex items-center justify-center group">
              <Icon name="Play" size={20} className="mr-2 group-hover:scale-110 transition-transform duration-200" />
              Watch Demo
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-4">
                <Icon name="Shield" size={24} color="var(--color-success)" strokeWidth={2} />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Verified Profiles</h3>
              <p className="text-text-secondary text-sm">All professionals are verified through LinkedIn and industry credentials</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Icon name="Users" size={24} color="var(--color-primary)" strokeWidth={2} />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">10,000+ Members</h3>
              <p className="text-text-secondary text-sm">Join thousands of professionals already finding meaningful connections</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                <Icon name="Star" size={24} color="var(--color-secondary)" strokeWidth={2} />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">4.9/5 Rating</h3>
              <p className="text-text-secondary text-sm">Highly rated by professionals for quality matches and user experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;