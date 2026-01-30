import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return { language: 'English', t: (key) => key };
  }
  return context;
};

const translations = {
  English: {
    // Landing Page
    'landing.title': 'Care Navigator AI',
    'landing.tagline': 'Right Care. Right Time. Right Decision.',
    'landing.getStarted': 'Get Started',
    'landing.slide1.title': 'Preventive Healthcare & Early Detection',
    'landing.slide1.desc': 'Proactive health monitoring and early intervention for better outcomes',
    'landing.slide2.title': 'AI-Powered Health Triage',
    'landing.slide2.desc': 'Intelligent symptom analysis and personalized care recommendations',
    'landing.slide3.title': 'Emergency Readiness & Public Health',
    'landing.slide3.desc': 'Instant access to emergency services and community health support',
    
    // Main App
    'greeting.morning': 'Good Morning',
    'greeting.afternoon': 'Good Afternoon',
    'greeting.evening': 'Good Evening',
    'subtitle': 'How can I help you today?',
    'aiAssistant': 'Your AI Health Assistant',
    'generalCare': 'General Care',
    'generalCareDesc': 'Describe your symptoms',
    'emergencyMode': 'Emergency Mode',
    'emergencyDesc': 'Immediate assistance',
    'medicationReminders': 'Medication Reminders',
    'healthCheckups': 'Health Checkups',
    'bloodBank': 'Blood Bank',
    'profile': 'Your Health Profile',
    
    // Common
    'common.backToDashboard': 'Back to Dashboard',
    'common.loading': 'Loading...',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.create': 'Create',
    'common.update': 'Update'
  },
  
  Hindi: {
    // Landing Page
    'landing.title': 'केयर नेविगेटर एआई',
    'landing.tagline': 'सही देखभाल। सही समय। सही निर्णय।',
    'landing.getStarted': 'शुरू करें',
    'landing.slide1.title': 'निवारक स्वास्थ्य देखभाल और जल्दी पता लगाना',
    'landing.slide1.desc': 'बेहतर परिणामों के लिए सक्रिय स्वास्थ्य निगरानी',
    'landing.slide2.title': 'एआई-संचालित स्वास्थ्य ट्राइएज',
    'landing.slide2.desc': 'बुद्धिमान लक्षण विश्लेषण और व्यक्तिगत देखभाल सिफारिशें',
    'landing.slide3.title': 'आपातकालीन तैयारी और सार्वजनिक स्वास्थ्य',
    'landing.slide3.desc': 'आपातकालीन सेवाओं तक तत्काल पहुंच',
    
    // Main App
    'greeting.morning': 'सुप्रभात',
    'greeting.afternoon': 'नमस्ते',
    'greeting.evening': 'शुभ संध्या',
    'subtitle': 'मैं आज आपकी कैसे मदद कर सकता हूं?',
    'aiAssistant': 'आपका एआई स्वास्थ्य सहायक',
    'generalCare': 'सामान्य देखभाल',
    'generalCareDesc': 'अपने लक्षणों का वर्णन करें',
    'emergencyMode': 'आपातकालीन मोड',
    'emergencyDesc': 'तत्काल सहायता',
    'medicationReminders': 'दवा अनुस्मारक',
    'healthCheckups': 'स्वास्थ्य जांच',
    'bloodBank': 'रक्त बैंक',
    'profile': 'आपका स्वास्थ्य प्रोफाइल',
    
    // Common
    'common.backToDashboard': 'डैशबोर्ड पर वापस जाएं',
    'common.loading': 'लोड हो रहा है...',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.create': 'बनाएं',
    'common.update': 'अपडेट करें'
  },
  
  Spanish: {
    'landing.title': 'Navegador de Atención AI',
    'landing.tagline': 'Atención Correcta. Momento Correcto. Decisión Correcta.',
    'landing.getStarted': 'Comenzar',
    'greeting.morning': 'Buenos Días',
    'greeting.afternoon': 'Buenas Tardes',
    'greeting.evening': 'Buenas Noches',
    'subtitle': '¿Cómo puedo ayudarte hoy?',
    'generalCare': 'Atención General',
    'emergencyMode': 'Modo de Emergencia',
    'common.backToDashboard': 'Volver al Panel',
    'common.loading': 'Cargando...',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = (key) => {
    return translations[language]?.[key] || translations['English']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};