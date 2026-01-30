import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  FileText, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Stethoscope,
  Clock
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';

export default function HealthRecords() {
  const { data: consultations, isLoading } = useQuery({
    queryKey: ['consultations'],
    queryFn: () => base44.entities.HealthConsultation.list('-created_date', 20),
  });

  const { data: profiles } = useQuery({
    queryKey: ['healthProfile'],
    queryFn: () => base44.entities.HealthProfile.list('-created_date', 1),
  });
  const profile = profiles?.[0];

  const getCareIcon = (level) => {
    switch(level) {
      case 'basic': return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' };
      case 'intermediate': return { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' };
      case 'advanced': return { icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100' };
      default: return { icon: Stethoscope, color: 'text-slate-600', bg: 'bg-slate-100' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <header className="px-6 py-4 flex items-center gap-4 sticky top-0 bg-white/80 backdrop-blur-lg z-10 border-b border-slate-100">
        <Link to={createPageUrl('Dashboard')}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-semibold text-slate-900">Health Records</h1>
          <p className="text-xs text-slate-500">Your consultation history</p>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* Profile Summary */}
        {profile && (
          <Card className="p-5 border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-800">{profile.full_name}</h2>
                <p className="text-sm text-slate-600">
                  {profile.age} years • {profile.gender?.charAt(0).toUpperCase() + profile.gender?.slice(1)}
                </p>
              </div>
              <Link to={createPageUrl('Settings')}>
                <Button variant="outline" size="sm" className="rounded-xl">
                  Edit Profile
                </Button>
              </Link>
            </div>
            
            {/* Health Summary */}
            <div className="mt-4 pt-4 border-t border-blue-100 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{consultations?.length || 0}</p>
                <p className="text-xs text-slate-500">Consultations</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{profile.health_conditions?.length || 0}</p>
                <p className="text-xs text-slate-500">Conditions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{profile.medications?.length || 0}</p>
                <p className="text-xs text-slate-500">Medications</p>
              </div>
            </div>
          </Card>
        )}

        {/* Consultation History */}
        <div>
          <h2 className="font-semibold text-slate-800 mb-4">Consultation History</h2>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Card key={i} className="p-4 border-0 shadow-sm">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>