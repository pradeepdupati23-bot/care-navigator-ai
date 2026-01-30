import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Globe, Check } from 'lucide-react';

export default function LanguageSelection() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [loading, setLoading] = useState(false);

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'zh', name: 'Chinese', native: '中文' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
    { code: 'pt', name: 'Portuguese', native: 'Português' },
    { code: 'ru', name: 'Russian', native: 'Русский' },
    { code: 'ja', name: 'Japanese', native: '日本語' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' }
  ];

  const handleContinue = async () => {
    setLoading(true);
    try {
      const profiles = await base44.entities.HealthProfile.list();
      if (profiles.length > 0) {
        const profile = profiles[0];
        await base44.entities.HealthProfile.update(profile.id, {
          preferred_language: selectedLanguage
        });
      }
      
      // Store language preference in localStorage
      localStorage.setItem('preferredLanguage', selectedLanguage);
      
      navigate(createPageUrl('Dashboard'));
    } catch (error) {
      console.error('Error updating language:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
            <Globe className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Language Preference</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Language</h1>
          <p className="text-gray-600">Select your preferred language for the best experience</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Available Languages</CardTitle>
            <CardDescription>We support multiple languages for accessibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.name)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedLanguage === lang.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900">{lang.name}</span>
                    {selectedLanguage === lang.name && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <span className="text-sm text-gray-600">{lang.native}</span>
                </button>
              ))}
            </div>

            <Button
              onClick={handleContinue}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {loading ? 'Setting up...' : 'Continue to Dashboard'}
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          You can change your language preference anytime from settings
        </p>
      </div>
    </div>
  );
}