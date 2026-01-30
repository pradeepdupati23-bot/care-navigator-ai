import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  User, 
  Globe, 
  Bell, 
  Shield, 
  LogOut,
  Heart,
  ChevronRight,
  Save,
  Loader2
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Settings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['healthProfile'],
    queryFn: () => base44.entities.HealthProfile.list('-created_date', 1),
  });
  const profile = profiles?.[0];

  const [editData, setEditData] = useState(null);

  React.useEffect(() => {
    if (profile && !editData) {
      setEditData({
        full_name: profile.full_name || '',
        age: profile.age || '',
        gender: profile.gender || '',
        blood_type: profile.blood_type || 'unknown',
        emergency_contact: profile.emergency_contact || { name: '', phone: '', relationship: '' }
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile || !editData) return;
    setSaving(true);
    try {
      await base44.entities.HealthProfile.update(profile.id, {
        ...editData,
        age: parseInt(editData.age)
      });
      queryClient.invalidateQueries(['healthProfile']);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setSaving(false);
  };

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Landing'));
  };

  if (isLoading || !editData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-lg z-10 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-semibold text-slate-900">Settings</h1>
        </div>
        {editing && (
          <Button 
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="rounded-xl bg-blue-600"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
            Save
          </Button>
        )}
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* Profile Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Profile Information</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setEditing(!editing)}
              className="text-blue-600"
            >
              {editing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
          
          <Card className="p-5 border-0 shadow-md space-y-4">
            <div>
              <Label className="text-slate-500 text-xs">Full Name</Label>
              {editing ? (
                <Input
                  value={editData.full_name}
                  onChange={(e) => setEditData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="mt-1 rounded-xl"
                />
              ) : (
                <p className="font-medium text-slate-800 mt-1">{profile?.full_name}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-500 text-xs">Age</Label>
                {editing ? (
                  <Input
                    type="number"
                    value={editData.age}
                    onChange={(e) => setEditData(prev => ({ ...prev, age: e.target.value }))}
                    className="mt-1 rounded-xl"
                  />
                ) : (
                  <p className="font-medium text-slate-800 mt-1">{profile?.age} years</p>
                )}
              </div>
              <div>
                <Label className="text-slate-500 text-xs">Gender</Label>
                {editing ? (
                  <Select 
                    value={editData.gender} 
                    onValueChange={(v) => setEditData(prev => ({ ...prev, gender: v }))}
                  >
                    <SelectTrigger className="mt-1 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="font-medium text-slate-800 mt-1 capitalize">{profile?.gender}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label className="text-slate-500 text-xs">Blood Type</Label>
              {editing ? (
                <Select 
                  value={editData.blood_type} 
                  onValueChange={(v) => setEditData(prev => ({ ...prev, blood_type: v }))}
                >
                  <SelectTrigger className="mt-1 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'].map(type => (
                      <SelectItem key={type} value={type}>
                        {type === 'unknown' ? "Don't know" : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="font-medium text-slate-800 mt-1">
                  {profile?.blood_type === 'unknown' ? 'Not specified' : profile?.blood_type}
                </p>
              )}
            </div>
          </Card>
        </section>

        {/* Emergency Contact */}
        <section>
          <h2 className="font-semibold text-slate-800 mb-4">Emergency Contact</h2>
          <Card className="p-5 border-0 shadow-md space-y-4">
            <div>
              <Label className="text-slate-500 text-xs">Contact Name</Label>
              {editing ? (
                <Input
                  value={editData.emergency_contact?.name || ''}
                  onChange={(e) => setEditData(prev => ({ 
                    ...prev, 
                    emergency_contact: { ...prev.emergency_contact, name: e.target.value }
                  }))}
                  placeholder="Emergency contact name"
                  className="mt-1 rounded-xl"
                />
              ) : (
                <p className="font-medium text-slate-800 mt-1">
                  {profile?.emergency_contact?.name || 'Not set'}
                </p>
              )}
            </div>
            <div>
              <Label className="text-slate-500 text-xs">Phone Number</Label>
              {editing ? (
                <Input
                  value={editData.emergency_contact?.phone || ''}
                  onChange={(e) => setEditData(prev => ({ 
                    ...prev, 
                    emergency_contact: { ...prev.emergency_contact, phone: e.target.value }
                  }))}
                  placeholder="Phone number"
                  className="mt-1 rounded-xl"
                />
              ) : (
                <p className="font-medium text-slate-800 mt-1">
                  {profile?.emergency_contact?.phone || 'Not set'}
                </p>
              )}
            </div>
            <div>
              <Label className="text-slate-500 text-xs">Relationship</Label>
              {editing ? (
                <Input
                  value={editData.emergency_contact?.relationship || ''}
                  onChange={(e) => setEditData(prev => ({ 
                    ...prev, 
                    emergency_contact: { ...prev.emergency_contact, relationship: e.target.value }
                  }))}
                  placeholder="e.g., Spouse, Parent"
                  className="mt-1 rounded-xl"
                />
              ) : (
                <p className="font-medium text-slate-800 mt-1">
                  {profile?.emergency_contact?.relationship || 'Not set'}
                </p>
              )}
            </div>
          </Card>
        </section>

        {/* Quick Settings */}
        <section>
          <h2 className="font-semibold text-slate-800 mb-4">Quick Settings</h2>
          <Card className="border-0 shadow-md divide-y divide-slate-100">
            <Link to={createPageUrl('LanguageSelect')}>
              <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Language</p>
                    <p className="text-xs text-slate-500">English</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>
            </Link>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Notifications</p>
                  <p className="text-xs text-slate-500">Health reminders & alerts</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Link to={createPageUrl('HealthRecords')}>
              <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Health History</p>
                    <p className="text-xs text-slate-500">View past consultations</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>
            </Link>
          </Card>
        </section>

        {/* Privacy & Security */}
        <section>
          <h2 className="font-semibold text-slate-800 mb-4">Privacy & Security</h2>
          <Card className="p-4 border-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">Your data is protected</p>
                <p className="text-xs text-slate-500">End-to-end encrypted & HIPAA compliant</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Logout */}
        <Button 
          variant="outline"
          onClick={handleLogout}
          className="w-full h-12 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>

        {/* Version */}
        <p className="text-center text-xs text-slate-400 pt-4">
          HealthNav v1.0.0 • AI-Powered Health Navigation
        </p>
      </main>
    </div>
  );
}
          
    