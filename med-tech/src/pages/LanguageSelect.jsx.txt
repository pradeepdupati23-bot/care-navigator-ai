import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇧🇷' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
];

export default function LanguageSelect() {
  const [selected, setSelected] = useState('en');
  const navigate = useNavigate();

  const handleContinue = () => {
    localStorage.setItem('healthnav_language', selected);
    navigate(createPageUrl('Onboarding'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="px-6 py-4 flex items-center gap-4">
        <Link to={createPageUrl('Landing')}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-slate-800">Select Language</span>
        </div>
      </header>

      <main className="px-6 pt-4 pb-12 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Choose Your Language
          </h1>
          <p className="text-slate-600 text-sm">
            Select your preferred language for a personalized experience
          </p>
        </motion.div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {languages.map((lang, index) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelected(lang.code)}
              className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
                selected === lang.code
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              {selected === lang.code && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <span className="text-2xl mb-2 block">{lang.flag}</span>
              <span className="font-medium text-slate-800 block">{lang.name}</span>
              <span className="text-sm text-slate-500">{lang.native}</span>
            </motion.button>
          ))}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            onClick={handleContinue}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-base rounded-2xl shadow-lg shadow-blue-500/25"
          >
            Continue
          </Button>
        </motion.div>

        {/* Accessibility Note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          You can change your language anytime in settings
        </p>
      </main>
    </div>
  );
}