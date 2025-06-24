import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import ProfessionSelector from './components/ProfessionSelector';
import DeveloperFields from './components/DeveloperFields';
import DoctorFields from './components/DoctorFields';
import FounderFields from './components/FounderFields';
import PhotoUpload from './components/PhotoUpload';
import CompatibilityPreferences from './components/CompatibilityPreferences';
import ProgressIndicator from './components/ProgressIndicator';
import profileService from '../../utils/profileService';
import Icon from '../../components/AppIcon';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({});

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    defaultValues: {
      full_name: '',
      email: user?.email || '',
      bio: '',
      location: '',
      company: '',
      years_experience: 0,
      github_url: '',
      linkedin_url: '',
      website_url: '',
      tags: [],
      avatar_url: '',
      profession: '',
      // Doctor-specific
      specialty: '',
      hospital: '',
      medical_license: '',
      // Founder-specific
      industry: '',
      startup_stage: '',
      funding_status: '',
      company_size: '',
      // Compatibility preferences
      age_range: { min: 25, max: 45 },
      location_radius: 50,
      profession_preferences: []
    }
  });

  const totalSteps = 5;

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    // Set email from auth user
    setValue('email', user.email);
  }, [user, navigate, setValue]);

  const onSubmit = async (data) => {
    if (currentStep < totalSteps) {
      // Store current step data and move to next step
      setFormData(prev => ({ ...prev, ...data }));
      setCurrentStep(prev => prev + 1);
      return;
    }

    // Final submission
    setLoading(true);
    setError('');

    try {
      const completeData = { ...formData, ...data, profession: selectedProfession };
      
      const result = await profileService.updateProfile(user.id, completeData);
      
      if (result?.success) {
        // Update auth context with new profile
        await updateProfile(completeData);
        navigate('/dashboard');
      } else {
        setError(result?.error || 'Failed to save profile');
      }
    } catch (err) {
      console.log('Registration error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProfessionSelector
            selectedProfession={selectedProfession}
            onSelect={setSelectedProfession}
            register={register}
            errors={errors}
          />
        );
      case 2:
        return (
          <div className="space-y-6">
            {selectedProfession === 'developer' && (
              <DeveloperFields
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
              />
            )}
            {selectedProfession === 'doctor' && (
              <DoctorFields
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
              />
            )}
            {selectedProfession === 'founder' && (
              <FounderFields
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
              />
            )}
          </div>
        );
      case 3:
        return (
          <PhotoUpload
            currentPhoto={watch('avatar_url')}
            onPhotoUpload={(url) => setValue('avatar_url', url)}
            userId={user?.id}
          />
        );
      case 4:
        return (
          <CompatibilityPreferences
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            profession={selectedProfession}
          />
        );
      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              <Icon name="Check" size={32} color="var(--color-primary)" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">Review & Complete</h3>
            <p className="text-text-secondary">
              Please review your information before completing your profile.
            </p>
            
            <div className="bg-surface rounded-2xl p-6 text-left space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-text-primary">Profession:</span>
                <span className="capitalize text-text-secondary">{selectedProfession}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-text-primary">Name:</span>
                <span className="text-text-secondary">{watch('full_name') || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-text-primary">Location:</span>
                <span className="text-text-secondary">{watch('location') || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-text-primary">Experience:</span>
                <span className="text-text-secondary">{watch('years_experience')} years</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return selectedProfession && watch('full_name') && watch('email');
      case 2:
        return watch('bio') && watch('location');
      case 3:
        return true; // Photo is optional
      case 4:
        return true; // Preferences are optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Complete Your Profile</h1>
          <p className="text-text-secondary">Let's create your professional dating profile</p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

        {/* Form Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-surface rounded-2xl shadow-lg p-8">
            {error && (
              <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
                <div className="flex items-center">
                  <Icon name="AlertCircle" size={20} color="var(--color-error)" className="mr-2" />
                  <span className="text-error font-medium">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="btn-outline"
                    disabled={loading}
                  >
                    <Icon name="ChevronLeft" size={20} className="mr-2" />
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="btn-primary"
                    disabled={!isStepValid() || loading}
                  >
                    Next
                    <Icon name="ChevronRight" size={20} className="ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading || !isStepValid()}
                  >
                    {loading ? (
                      <>
                        <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Complete Profile
                        <Icon name="Check" size={20} className="ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;