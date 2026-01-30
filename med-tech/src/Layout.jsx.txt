import React from 'react';

export default function Layout({ children, currentPageName }) {
  // Pages without layout wrapper
  const fullScreenPages = ['Landing', 'LanguageSelect', 'Onboarding', 'Emergency'];
  
  if (fullScreenPages.includes(currentPageName)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        :root {
          --primary: 220 98% 44%;
          --primary-foreground: 0 0% 100%;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .safe-area-pb {
          padding-bottom: max(12px, env(safe-area-inset-bottom));
        }
        
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }
      `}</style>
      {children}
    </div>
  );
}