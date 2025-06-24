import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SocialProofSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      profession: "Senior Software Engineer",
      company: "Google",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: `I met my partner through SoulSync and couldn't be happier. Finally, someone who understands why I get excited about clean code and system architecture. We've been together for 8 months now and even collaborate on side projects together!`,
      category: "developer"
    },
    {
      id: 2,
      name: "Dr. Michael Rodriguez",
      profession: "Cardiologist",
      company: "Mayo Clinic",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: `The medical community on SoulSync is incredible. I connected with a fellow physician who truly understands the demands of our profession. We support each other through long shifts and celebrate our victories together. It's exactly what I was looking for.`,
      category: "doctor"
    },
    {
      id: 3,
      name: "Jessica Park",
      profession: "Startup Founder",
      company: "TechFlow AI",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: `As a founder, dating was always challenging because people didn't understand my lifestyle. Through SoulSync, I met another entrepreneur who gets the hustle, the late nights, and the passion for building something meaningful. We're now planning to launch a company together!`,
      category: "founder"
    }
  ];

  const stats = [
    {
      number: "10,000+",
      label: "Active Members",
      icon: "Users"
    },
    {
      number: "2,500+",
      label: "Successful Matches",
      icon: "Heart"
    },
    {
      number: "94%",
      label: "Match Satisfaction",
      icon: "Star"
    },
    {
      number: "50+",
      label: "Cities Worldwide",
      icon: "MapPin"
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        color={index < rating ? "var(--color-accent)" : "var(--color-border)"}
        className={index < rating ? "fill-current" : ""}
      />
    ));
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-50 via-background to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            Success Stories from Our Community
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            Real professionals, real connections, real relationships. See how SoulSync has helped 
            thousands of career-focused individuals find their perfect match.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name={stat.icon} size={24} color="white" strokeWidth={2} />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-text-secondary font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="card bg-surface hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-text-primary mb-1">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-text-secondary mb-2">
                    {testimonial.profession}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {testimonial.company}
                  </p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
              </div>

              <p className="text-text-secondary leading-relaxed mb-4">
                {testimonial.text}
              </p>

              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  testimonial.category === 'developer' ? 'bg-primary-100 text-primary' :
                  testimonial.category === 'doctor'? 'bg-success-100 text-success' : 'bg-secondary-100 text-secondary'
                }`}>
                  {testimonial.category.charAt(0).toUpperCase() + testimonial.category.slice(1)}
                </span>
                <Icon name="Quote" size={20} color="var(--color-border)" />
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-surface rounded-2xl p-8 lg:p-12 shadow-lg border border-border">
            <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
              Ready to Write Your Success Story?
            </h3>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have found meaningful relationships through our platform. 
              Your perfect match is waiting to connect with someone just like you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
                <Icon name="Heart" size={20} className="mr-2" />
                Start Your Journey
              </button>
              <button className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center">
                <Icon name="MessageCircle" size={20} className="mr-2" />
                Read More Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;