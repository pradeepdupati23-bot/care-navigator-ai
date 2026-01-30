import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  Heart, Activity, AlertCircle, Droplet, User, 
  MessageCircle, Calendar, Pill, Apple, Settings
} from 'lucide-react';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: profiles } = useQuery({
    queryKey: ['healthProfile'],
    queryFn: () => base44.entities.HealthProfile.list(),
    initialData: []
  });

  const { data: reminders } = useQuery({
    queryKey: ['healthReminders'],
    queryFn: async () => {
      if (profiles.length > 0) {
        return await base44.entities.HealthReminder.filter({ 
          user_email: profiles[0].user_email,
          is_active: true 
        });
      }
      return [];
    },
    enabled: profiles.length > 0,
    initialData: []
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const profile = profiles[0];
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  const greeting = getGreeting();

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading your health profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{greeting}, {profile.full_name}!</h1>
              <p className="text-gray-600"><span className="font-bold">How can I help you today?</span></p>
            </div>
            <Link to={createPageUrl('Profile')}>
              <Button variant="outline" size="icon" className="rounded-full">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* AI Health Assistant Card */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-white">Your <span className="font-extrabold">AI ASSISTANT</span></CardTitle>
                <CardDescription className="text-white/80">Personalized care guidance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
              <p className="text-white/95 mb-3">
                <strong>Today's Health Tip:</strong> Based on your profile, staying hydrated and maintaining regular meal times can significantly improve your energy levels.
              </p>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Apple className="w-4 h-4" />
                <span>Recommended: Include more fruits and vegetables in your diet</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link to={createPageUrl('GeneralCare')}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer h-full bg-white">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">General Care</CardTitle>
                    <CardDescription>Describe your symptoms</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link to={createPageUrl('EmergencyMode')}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer h-full bg-gradient-to-r from-red-50 to-orange-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-red-900">Emergency Mode</CardTitle>
                    <CardDescription className="text-red-700">Immediate assistance</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Health Stats & Services */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link to={createPageUrl('MedicationReminders')}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-base">Medication Reminders</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {reminders.filter(r => r.reminder_type === 'medication').length > 0 ? (
                  <div className="space-y-2">
                    {reminders.filter(r => r.reminder_type === 'medication').slice(0, 2).map(reminder => (
                      <div key={reminder.id} className="text-sm">
                        <p className="font-medium text-gray-900">{reminder.title}</p>
                        <p className="text-gray-600 text-xs">{reminder.frequency}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No active medication reminders</p>
                )}
                <Button size="sm" variant="outline" className="mt-3 w-full">Manage Reminders</Button>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl('HealthCheckups')}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-600" />
                  <CardTitle className="text-base">Health Checkups</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Schedule your preventive health screening</p>
                <Button size="sm" variant="outline" className="mt-3 w-full">View Checkups</Button>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl('BloodBank')}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-red-600" />
                  <CardTitle className="text-base">Blood Bank</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Donate blood or find donors</p>
                <Button size="sm" variant="outline" className="mt-3 w-full">Access Blood Bank</Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Health Profile Summary */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-600" />
              Your Health Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Age & Gender</p>
                <p className="font-semibold text-gray-900">{profile.age} years, {profile.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Health Conditions</p>
                <p className="font-semibold text-gray-900">
                  {profile.health_conditions?.length > 0 ? profile.health_conditions.join(', ') : 'None reported'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Medications</p>
                <p className="font-semibold text-gray-900">
                  {profile.medications?.length > 0 ? profile.medications.join(', ') : 'None reported'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}