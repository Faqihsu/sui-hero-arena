import React, { useState } from 'react';
import { HeroClass } from '@/types';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';

interface MintFormData {
  name: string;
  heroClass: HeroClass;
  attack: number;
  defense: number;
  imageUrl: string;
}

interface FormErrors {
  name?: string;
  attack?: string;
  defense?: string;
  imageUrl?: string;
}

interface MintFormProps {
  onMint: (data: MintFormData) => Promise<void>;
  isLoading?: boolean;
}

export const MintForm: React.FC<MintFormProps> = ({ onMint, isLoading = false }) => {
  const [formData, setFormData] = useState<MintFormData>({
    name: '',
    heroClass: HeroClass.ASSASSIN,
    attack: 10,
    defense: 10,
    imageUrl: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Hero name is required';
    }
    
    if (formData.attack < 1 || formData.attack > 20) {
      newErrors.attack = 'Attack must be between 1 and 20';
    }
    
    if (formData.defense < 1 || formData.defense > 20) {
      newErrors.defense = 'Defense must be between 1 and 20';
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Hero image URL is required';
    } else {
      // Validate URL format
      try {
        new URL(formData.imageUrl);
      } catch {
        newErrors.imageUrl = 'Please enter a valid URL';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUrlChange = (url: string) => {
    handleInputChange('imageUrl', url);
    
    // Update preview if URL is valid
    if (url.trim()) {
      try {
        new URL(url);
        setImagePreview(url);
        setErrors(prev => ({ ...prev, imageUrl: '' }));
      } catch {
        setImagePreview('');
      }
    } else {
      setImagePreview('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await onMint(formData);
      // Reset form on successful mint
      setFormData({
        name: '',
        heroClass: HeroClass.ASSASSIN,
        attack: 10,
        defense: 10,
        imageUrl: ''
      });
      setImagePreview('');
    } catch (error) {
      console.error('Minting failed:', error);
    }
  };

  const handleInputChange = (
    field: keyof MintFormData,
    value: string | number | HeroClass
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 backdrop-blur-sm rounded-2xl border border-cyan-500/40 p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-2">Summon New Hero</h2>
          <p className="text-cyan-300/60 text-sm">Create a unique hero for your collection</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Hero Name */}
          <div>
            <label className="block text-sm font-bold text-cyan-300 mb-2 uppercase tracking-wider">
              Hero Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 bg-cyan-950/40 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter hero name..."
              maxLength={50}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Hero Class */}
          <div>
            <label className="block text-sm font-bold text-cyan-300 mb-2 uppercase tracking-wider">
              Hero Class
            </label>
            <select
              value={formData.heroClass}
              onChange={(e) => handleInputChange('heroClass', e.target.value as HeroClass)}
              className="w-full px-4 py-3 bg-cyan-950/40 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {Object.values(HeroClass).map((heroClass) => (
                <option key={heroClass} value={heroClass}>
                  {heroClass}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-bold text-cyan-300 mb-2 uppercase tracking-wider">
              Hero Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              className="w-full px-4 py-3 bg-cyan-950/40 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="https://example.com/hero-image.jpg"
            />
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-400">{errors.imageUrl}</p>
            )}
            <p className="mt-1 text-xs text-cyan-300/40">
              Enter a direct URL to an image (e.g., JPG, PNG, GIF)
            </p>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4 relative">
                <img
                  src={imagePreview}
                  alt="Hero preview"
                  className="w-full max-w-xs h-32 object-cover rounded-lg border border-cyan-500/40 mx-auto"
                  onError={() => {
                    setErrors(prev => ({ ...prev, imageUrl: 'Failed to load image from URL' }));
                    setImagePreview('');
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    handleInputChange('imageUrl', '');
                  }}
                  className="absolute top-2 right-12 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-cyan-300 mb-2 uppercase tracking-wider">
                Attack Power
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.attack}
                onChange={(e) => handleInputChange('attack', parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.attack && (
                <p className="mt-1 text-sm text-red-400">{errors.attack}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Defense Power
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.defense}
                onChange={(e) => handleInputChange('defense', parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.defense && (
                <p className="mt-1 text-sm text-red-400">{errors.defense}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-black py-3 uppercase tracking-wider"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Summoning Hero...</span>
                </div>
              ) : (
                '✨ Summon Hero ✨'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MintForm;