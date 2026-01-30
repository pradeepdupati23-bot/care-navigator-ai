import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Heart,
      title: "Preventive Healthcare & Early Detection",
      description: "Proactive health monitoring and early intervention for better outcomes",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "AI-Powered Health Triage",
      description: "Intelligent symptom analysis and personalized care recommendations",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Shield,
      title: "Emergency Readiness & Public Health",
      description: "Instant access to emergency services and community health support",
      color: "from-cyan-500 to-teal-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Trusted Healthcare Navigation</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Care Navigator AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Right Care. Right Time. Right Decision.
          </p>
        </div>

        {/* Auto-scrolling Feature Slides */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className={`bg-gradient-to-r ${slides[currentSlide].color} p-12 text-white transition-all duration-700`}>
              <div className="max-w-3xl mx-auto text-center">
                <CurrentIcon className="w-16 h-16 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">{slides[currentSlide].title}</h2>
                <p className="text-lg opacity-95">{slides[currentSlide].description}</p>
              </div>
            </div>
            
            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 py-6 bg-white">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Care</h3>
            <p className="text-gray-600">AI assistant tailored to your health profile and needs</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Triage</h3>
            <p className="text-gray-600">Intelligent routing to the right medical specialty</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Emergency Ready</h3>