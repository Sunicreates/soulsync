import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DoctorFields = ({ register, errors, setValue, watch }) => {
  const [selectedSpecialties, setSelectedSpecialties] = useState(watch('tags') || []);
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(watch('company') || '');

  const medicalSpecialties = [
    'Internal Medicine', 'Cardiology', 'Neurology', 'Oncology', 'Pediatrics',
    'Surgery', 'Orthopedics', 'Dermatology', 'Psychiatry', 'Radiology',
    'Anesthesiology', 'Emergency Medicine', 'Family Medicine', 'Gastroenterology',
    'Endocrinology', 'Pulmonology', 'Rheumatology', 'Urology', 'Obstetrics',
    'Gynecology', 'Ophthalmology', 'ENT', 'Pathology', 'Physical Medicine',
    'Infectious Disease', 'Nephrology', 'Hematology', 'Geriatrics'
  ];

  const hospitalSuggestions = [
    'Mayo Clinic', 'Cleveland Clinic', 'Johns Hopkins Hospital', 'Massachusetts General Hospital',
    'UCLA Medical Center', 'Mount Sinai Hospital', 'Cedars-Sinai Medical Center',
    'Stanford Health Care', 'NYU Langone Health', 'Brigham and Women\'s Hospital',
    'UCSF Medical Center', 'Houston Methodist Hospital', 'Kaiser Permanente',
    'Memorial Sloan Kettering', 'Seattle Children\'s Hospital'
  ];

  const filteredHospitals = hospitalSuggestions.filter(hospital =>
    hospital.toLowerCase().includes(hospitalSearch.toLowerCase())
  );

  const toggleSpecialty = (specialty) => {
    const updatedSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter(s => s !== specialty)
      : [...selectedSpecialties, specialty];
    
    setSelectedSpecialties(updatedSpecialties);
    setValue('tags', updatedSpecialties);
  };

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
    setHospitalSearch('');
    setValue('company', hospital);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Medical Professional Profile</h2>
        <p className="text-text-secondary">
          Share your medical expertise and professional background
        </p>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Bio / Professional Summary *
          </label>
          <textarea
            {...register('bio', { required: 'Professional summary is required' })}
            className="input-field h-24 resize-none"
            placeholder="Describe your medical background, expertise, and interests..."
          />
          {errors?.bio && (
            <p className="mt-1 text-sm text-error">{errors.bio.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Location *
          </label>
          <input
            type="text"
            {...register('location', { required: 'Location is required' })}
            className="input-field"
            placeholder="City, State/Country"
          />
          {errors?.location && (
            <p className="mt-1 text-sm text-error">{errors.location.message}</p>
          )}
        </div>
      </div>

      {/* Medical Specialties */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Medical Specialties *
        </label>
        <p className="text-sm text-text-secondary mb-4">
          Select your medical specialties and areas of expertise
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {medicalSpecialties.map((specialty) => (
            <button
              key={specialty}
              type="button"
              onClick={() => toggleSpecialty(specialty)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left
                ${selectedSpecialties.includes(specialty)
                  ? 'bg-secondary text-white' :'bg-surface border border-border hover:border-secondary text-text-secondary hover:text-secondary'
                }
              `}
            >
              {specialty}
            </button>
          ))}
        </div>

        {selectedSpecialties.length > 0 && (
          <div className="mt-4 p-4 bg-secondary-50 rounded-lg">
            <p className="text-sm font-medium text-text-primary mb-2">
              Selected Specialties ({selectedSpecialties.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedSpecialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-3 py-1 bg-secondary text-white rounded-full text-sm font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedSpecialties.length === 0 && (
          <p className="mt-2 text-sm text-error">Please select at least one medical specialty</p>
        )}
      </div>

      {/* Hospital/Institution */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Hospital / Medical Institution
        </label>
        <div className="relative">
          <input
            type="text"
            value={selectedHospital || hospitalSearch}
            onChange={(e) => {
              setHospitalSearch(e.target.value);
              if (!filteredHospitals.includes(e.target.value)) {
                setSelectedHospital('');
                setValue('company', e.target.value);
              }
            }}
            className="input-field"
            placeholder="Search or enter your hospital/institution"
          />
          
          {hospitalSearch && !selectedHospital && filteredHospitals.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredHospitals.map((hospital) => (
                <button
                  key={hospital}
                  type="button"
                  onClick={() => handleHospitalSelect(hospital)}
                  className="w-full px-4 py-2 text-left hover:bg-background transition-colors"
                >
                  {hospital}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Experience and Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Years of Experience
          </label>
          <input
            type="number"
            {...register('years_experience', { 
              min: { value: 0, message: 'Experience cannot be negative' },
              max: { value: 50, message: 'Please enter a valid number' }
            })}
            className="input-field"
            placeholder="Years of medical practice"
            min="0"
            max="50"
          />
          {errors?.years_experience && (
            <p className="mt-1 text-sm text-error">{errors.years_experience.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Medical License Number
          </label>
          <input
            type="text"
            {...register('medical_license')}
            className="input-field"
            placeholder="Your medical license number (optional)"
          />
        </div>
      </div>

      {/* Professional Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            {...register('linkedin_url', {
              pattern: {
                value: /^https?:\/\/(www\.)?linkedin\.com\/.+/,
                message: 'Please enter a valid LinkedIn URL'
              }
            })}
            className="input-field"
            placeholder="https://linkedin.com/in/your-profile"
          />
          {errors?.linkedin_url && (
            <p className="mt-1 text-sm text-error">{errors.linkedin_url.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Professional Website
          </label>
          <input
            type="url"
            {...register('website_url', {
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Please enter a valid URL'
              }
            })}
            className="input-field"
            placeholder="https://your-practice-website.com"
          />
          {errors?.website_url && (
            <p className="mt-1 text-sm text-error">{errors.website_url.message}</p>
          )}
        </div>
      </div>

      {/* Medical Interests */}
      <div className="bg-secondary-50 rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <Icon name="Heart" size={24} color="var(--color-secondary)" className="mr-3" />
          <h3 className="text-lg font-semibold text-text-primary">
            Professional Interests
          </h3>
        </div>
        <p className="text-text-secondary text-sm mb-4">
          What aspects of medicine are you most passionate about?
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            'Research', 'Teaching', 'Patient Care', 'Healthcare Technology', 
            'Medical Innovation', 'Public Health', 'Clinical Trials', 'Surgery',
            'Preventive Medicine', 'Global Health', 'Medical Writing', 'Healthcare Policy'
          ].map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => {
                const currentInterests = watch('professional_interests') || [];
                const updatedInterests = currentInterests.includes(interest)
                  ? currentInterests.filter(i => i !== interest)
                  : [...currentInterests, interest];
                setValue('professional_interests', updatedInterests);
              }}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left
                ${(watch('professional_interests') || []).includes(interest)
                  ? 'bg-secondary text-white' :'bg-surface border border-border hover:border-secondary text-text-secondary hover:text-secondary'
                }
              `}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorFields;