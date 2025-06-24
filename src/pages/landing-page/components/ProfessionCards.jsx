import React from 'react';
import Icon from '../../../components/AppIcon';

const ProfessionCards = () => {
  const professions = [
    {
      id: 'developer',
      title: 'Developers',
      icon: 'Code',
      description: 'Connect with fellow software engineers, full-stack developers, and tech innovators who speak your language.',
      features: ['GitHub Integration', 'Tech Stack Matching', 'Remote-Friendly'],
      color: 'primary',
      stats: '3,500+ Members'
    },
    {
      id: 'doctor',
      title: 'Doctors',
      icon: 'Stethoscope',
      description: 'Meet medical professionals who understand the demands of healthcare and value work-life balance.',
      features: ['Specialty Matching', 'Schedule Flexibility', 'Medical Community'],
      color: 'success',
      stats: '2,800+ Members'
    },
    {
      id: 'founder',
      title: 'Founders',
      icon: 'Rocket',
      description: 'Find ambitious entrepreneurs and business leaders who share your drive for innovation and success.',
      features: ['Industry Matching', 'Startup Network', 'Investment Ready'],
      color: 'secondary',
      stats: '1,200+ Members'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: {
        bg: 'bg-primary-50',
        border: 'border-primary-200',
        icon: 'bg-primary-100',
        iconColor: 'var(--color-primary)',
        text: 'text-primary',
        button: 'btn-primary'
      },
      success: {
        bg: 'bg-success-50',
        border: 'border-success-200',
        icon: 'bg-success-100',
        iconColor: 'var(--color-success)',
        text: 'text-success',
        button: 'bg-success text-white hover:bg-success-600'
      },
      secondary: {
        bg: 'bg-secondary-50',
        border: 'border-secondary-200',
        icon: 'bg-secondary-100',
        iconColor: 'var(--color-secondary)',
        text: 'text-secondary',
        button: 'bg-secondary text-white hover:bg-secondary-600'
      }
    };
    return colorMap[color];
  };

  return (
    <section className="py-16 lg:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            Find Your Professional Match
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            Our platform is designed specifically for three high-achieving professional communities. 
            Choose your path to meaningful connections.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {professions.map((profession) => {
            const colors = getColorClasses(profession.color);
            return (
              <div
                key={profession.id}
                className={`card ${colors.bg} ${colors.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group`}
              >
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 ${colors.icon} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon 
                      name={profession.icon} 
                      size={32} 
                      color={colors.iconColor} 
                      strokeWidth={2} 
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    {profession.title}
                  </h3>
                  <p className={`text-sm font-medium ${colors.text} mb-4`}>
                    {profession.stats}
                  </p>
                </div>

                <p className="text-text-secondary mb-6 leading-relaxed">
                  {profession.description}
                </p>

                <div className="mb-8">
                  <h4 className="font-semibold text-text-primary mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {profession.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-text-secondary">
                        <Icon 
                          name="Check" 
                          size={16} 
                          color={colors.iconColor} 
                          className="mr-2 flex-shrink-0" 
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 ease-out hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.button === 'btn-primary' ? 'btn-primary' : colors.button + ' focus:ring-' + profession.color + '-500'}`}>
                  Join {profession.title}
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-text-secondary mb-6">
            Not sure which community fits you best?
          </p>
          <button className="btn-outline">
            <Icon name="MessageCircle" size={20} className="mr-2" />
            Talk to Our Team
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfessionCards;