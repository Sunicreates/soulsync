import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      title: "Professional Compatibility Matching",
      description: `Our advanced algorithm considers your career stage, work schedule, professional values, and industry culture to find matches who truly understand your lifestyle. We go beyond surface-level compatibility to connect professionals who can support each other's ambitions.`,
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
      icon: "Target",
      benefits: [
        "Career stage alignment",
        "Work-life balance compatibility", 
        "Professional values matching",
        "Industry culture understanding"
      ],
      reverse: false
    },
    {
      id: 2,
      title: "Industry-Specific Networking",
      description: `Connect within your professional ecosystem through specialized communities, industry events, and networking opportunities. Whether you're debugging code, saving lives, or building the next unicorn, find someone who speaks your professional language.`,
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop",
      icon: "Network",
      benefits: [
        "Exclusive professional communities",
        "Industry-specific events",
        "Career networking opportunities",
        "Mentorship connections"
      ],
      reverse: true
    },
    {
      id: 3,
      title: "Verified Professional Profiles",
      description: `Every member undergoes thorough verification through LinkedIn, professional credentials, and industry references. Connect with confidence knowing that profiles are authentic and represent real, accomplished professionals in their respective fields.`,
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop",
      icon: "ShieldCheck",
      benefits: [
        "LinkedIn verification",
        "Professional credential checks",
        "Industry reference validation",
        "Background screening"
      ],
      reverse: false
    },
    {
      id: 4,
      title: "Smart Scheduling & Communication",
      description: `Coordinate dates and conversations around demanding professional schedules with our intelligent scheduling system. From timezone coordination for remote workers to understanding medical shift patterns, we make connecting convenient.`,
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
      icon: "Calendar",
      benefits: [
        "Intelligent scheduling system",
        "Timezone coordination",
        "Schedule compatibility matching",
        "Professional calendar integration"
      ],
      reverse: true
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            Built for Professional Lives
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            Unlike generic dating apps, SoulSync is designed specifically for the unique needs 
            and challenges of high-achieving professionals. Every feature is crafted with your career in mind.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-24">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`flex flex-col ${feature.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-16`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-80 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-6 left-6 w-12 h-12 bg-surface rounded-xl flex items-center justify-center shadow-lg">
                    <Icon 
                      name={feature.icon} 
                      size={24} 
                      color="var(--color-primary)" 
                      strokeWidth={2} 
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2">
                <div className="max-w-xl">
                  <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-6">
                    {feature.title}
                  </h3>
                  
                  <p className="text-text-secondary text-lg leading-relaxed mb-8">
                    {feature.description}
                  </p>

                  <div className="space-y-4 mb-8">
                    {feature.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <Icon 
                            name="Check" 
                            size={14} 
                            color="var(--color-primary)" 
                            strokeWidth={2.5} 
                          />
                        </div>
                        <span className="text-text-secondary">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <button className="btn-primary inline-flex items-center">
                    Learn More
                    <Icon name="ArrowRight" size={20} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 lg:p-16 border border-primary-100">
            <h3 className="text-2xl lg:text-4xl font-bold text-text-primary mb-6">
              Experience the Difference
            </h3>
            <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
              Join the platform designed by professionals, for professionals. 
              Start building meaningful connections that understand and support your career journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
                <Icon name="Rocket" size={20} className="mr-2" />
                Get Started Today
              </button>
              <button className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center">
                <Icon name="Play" size={20} className="mr-2" />
                Watch Platform Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;