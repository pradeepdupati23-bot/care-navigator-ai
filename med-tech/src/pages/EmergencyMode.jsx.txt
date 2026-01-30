import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Phone, Ambulance, Stethoscope, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function EmergencyMode() {
  const emergencyContacts = [
    { name: 'Ambulance', number: '108', icon: Ambulance, color: 'red' },
    { name: 'Emergency Helpline', number: '102', icon: Phone, color: 'orange' },
    { name: 'Doctor on Call', number: '1800-XXX-XXXX', icon: Stethoscope, color: 'blue' },
    { name: 'Police Emergency', number: '100', icon: AlertCircle, color: 'indigo' }
  ];

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Alert Header */}
        <div className="bg-red-600 text-white rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Emergency Mode</h1>
              <p className="text-red-100">Immediate assistance available</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white/95">
              You are in emergency mode. Help is just one tap away. If this is a life-threatening emergency, call an ambulance immediately.
            </p>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {emergencyContacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <Card 
                key={contact.name}
                className={`border-2 border-${contact.color}-300 shadow-xl hover:shadow-2xl transition-all cursor-pointer`}
                onClick={() => handleCall(contact.number)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 bg-${contact.color}-100 rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-7 h-7 text-${contact.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{contact.name}</CardTitle>
                      <p className={`text-2xl font-bold text-${contact.color}-600`}>{contact.number}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className={`w-full bg-${contact.color}-600 hover:bg-${contact.color}-700 text-white`}
                    size="lg"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Location Services */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Nearest Emergency Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900">City General Hospital</p>
                <p className="text-sm text-gray-600">2.3 km away • 24/7 Emergency</p>
                <Button size="sm" variant="outline" className="mt-2">Get Directions</Button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900">Apollo Clinic</p>
                <p className="text-sm text-gray-600">3.1 km away • Emergency Care</p>
                <Button size="sm" variant="outline" className="mt-2">Get Directions</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Medical History Share */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Share Medical History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              In an emergency, you can quickly share your medical profile with emergency responders.
            </p>
            <Button variant="outline" className="w-full">
              Generate Emergency QR Code
            </Button>
          </CardContent>
        </Card>

        {/* Important Information */}
        <div className="mt-8 bg-yellow-50 border border-yellow-300 rounded-xl p-6">
          <h3 className="font-semibold text-yellow-900 mb-3">Important Emergency Information</h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>• Stay calm and assess the situation</li>
            <li>• Call emergency services if there's a life-threatening situation</li>
            <li>• Keep your phone charged and accessible</li>
            <li>• Have important documents ready</li>
            <li>• Inform family members about your emergency</li>
          </ul>
        </div>
      </div>
    </div>
  );
}