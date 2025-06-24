import React, { useState, useCallback } from 'react';
import storageService from '../../../utils/storageService';
import Icon from '../../../components/AppIcon';

const PhotoUpload = ({ currentPhoto, onPhotoUpload, userId }) => {
  const [preview, setPreview] = useState(currentPhoto || '');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (file) => {
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      // Create preview immediately
      const previewUrl = await storageService.createPreview(file);
      setPreview(previewUrl);

      // Upload to Supabase
      const result = await storageService.uploadPhoto(file, userId);
      
      if (result?.success) {
        setPreview(result.data.url);
        onPhotoUpload(result.data.url);
      } else {
        setError(result?.error || 'Upload failed');
        setPreview(currentPhoto || '');
      }
    } catch (err) {
      console.log('Photo upload error:', err);
      setError('Something went wrong during upload');
      setPreview(currentPhoto || '');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    if (e.target?.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const removePhoto = () => {
    setPreview('');
    onPhotoUpload('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Add Your Photo</h2>
        <p className="text-text-secondary">
          Upload a professional photo to complete your profile
        </p>
      </div>

      {/* Upload Area */}
      <div className="flex justify-center">
        <div
          className={`
            relative border-2 border-dashed rounded-2xl p-8 w-full max-w-md text-center transition-all duration-200
            ${dragActive 
              ? 'border-primary bg-primary-50' :'border-border hover:border-primary hover:bg-primary-25'
            }
            ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && document.getElementById('photo-upload')?.click()}
        >
          <input
            id="photo-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          {preview ? (
            <div className="space-y-4">
              <div className="relative mx-auto">
                <img
                  src={preview}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                />
                {!uploading && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto();
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-error text-white rounded-full flex items-center justify-center hover:bg-error-600 transition-colors"
                  >
                    <Icon name="X" size={16} />
                  </button>
                )}
              </div>
              
              {uploading ? (
                <div className="flex items-center justify-center">
                  <Icon name="Loader2" size={20} className="animate-spin mr-2" />
                  <span className="text-text-secondary">Uploading...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-text-primary font-medium">Photo uploaded successfully!</p>
                  <button
                    type="button"
                    className="text-primary hover:text-primary-700 text-sm font-medium"
                  >
                    Change Photo
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                {uploading ? (
                  <Icon name="Loader2" size={32} color="var(--color-primary)" className="animate-spin" />
                ) : (
                  <Icon name="Camera" size={32} color="var(--color-primary)" />
                )}
              </div>
              
              <div>
                <p className="text-text-primary font-medium mb-2">
                  {uploading ? 'Uploading your photo...' : 'Upload your profile photo'}
                </p>
                <p className="text-text-secondary text-sm">
                  {uploading 
                    ? 'Please wait while we process your image'
                    : 'Drag and drop or click to select'
                  }
                </p>
                <p className="text-text-muted text-xs mt-2">
                  JPEG, PNG, WebP • Max 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-md mx-auto p-4 bg-error-50 border border-error-200 rounded-lg">
          <div className="flex items-center">
            <Icon name="AlertCircle" size={20} color="var(--color-error)" className="mr-2" />
            <span className="text-error font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Photo Guidelines */}
      <div className="max-w-md mx-auto bg-background rounded-lg p-4">
        <h4 className="text-sm font-semibold text-text-primary mb-3">Photo Guidelines</h4>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-center">
            <Icon name="Check" size={16} color="var(--color-success)" className="mr-2 flex-shrink-0" />
            Clear, well-lit face photo
          </li>
          <li className="flex items-center">
            <Icon name="Check" size={16} color="var(--color-success)" className="mr-2 flex-shrink-0" />
            Professional appearance
          </li>
          <li className="flex items-center">
            <Icon name="Check" size={16} color="var(--color-success)" className="mr-2 flex-shrink-0" />
            You are the only person in the photo
          </li>
          <li className="flex items-center">
            <Icon name="X" size={16} color="var(--color-error)" className="mr-2 flex-shrink-0" />
            No sunglasses or face coverings
          </li>
          <li className="flex items-center">
            <Icon name="X" size={16} color="var(--color-error)" className="mr-2 flex-shrink-0" />
            No group photos or multiple people
          </li>
        </ul>
      </div>

      {/* Optional Note */}
      <div className="text-center">
        <p className="text-text-muted text-sm">
          Adding a photo increases your chances of meaningful connections by 75%
        </p>
      </div>
    </div>
  );
};

export default PhotoUpload;