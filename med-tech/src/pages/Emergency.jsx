import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Phone, 
  Ambulance, 
  Hospital, 
  UserRound,
  AlertTriangle,
  MapPin
} from 'lucide-react';

const emergencyNumbers = [
  {
    id: 'ambulance',
    title: 'Ambulance',
    number: '102',
    icon: Ambulance,
    color: 'bg-rose-500',
    description: 'Medical emergency ambulance'
  },
  {
    id: 'emergency',
    title: 'Emergency Services',
    number: '911',
    icon: AlertTriangle,
    color: 'bg-orange-500',
    description: 'General emergency helpline'
  },
  {
    id: 'hospital',
    title: 'Nearest Hospital',
    number: '108',
    icon: Hospital,
    color: 'bg-blue-500',
    description: 'Hospital emergency ward'
  },
  {
    id: 'doctor',
    title: 'Emergency Doctor',
    number: '+1-800-DOCTOR',
    icon: UserRound,
    color: 'bg-green-500',
    description: '24/7 doctor on call'
  },
];

export default function Emergency() {
  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Emergency Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <Link to={createPageUrl('Landing')}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-sm font-medium text-rose-600">Emergency Mode</span>
        </div>
      </header>

      <main className="px-6 pt-4 pb-12 max-w-lg mx-auto">
        {/* Alert Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-500 text-white rounded-2xl p-5 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold mb-1">Emergency Assistance</h1>
              <p className="text-rose-100 text-sm">
                Tap any option below for immediate help. Stay calm.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500">Your current location</p>
            <p className="text-sm font-medium text-slate-800">Tap to share with emergency services</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl">
            Share
          </Button>
        </motion.div>

        {/* Emergency Numbers */}
        <div className="space-y-3">
          {emergencyNumbers.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card 
                className="p-4 cursor-pointer hover:shadow-lg transition-all active:scale-98 border-2 border-transparent hover:border-slate-200"
                onClick={() => handleCall(item.number)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{item.number}</p>
                    <div className="flex items-center gap-1 text-green-600">
                      <Phone className="w-3 h-3" />
                      <span className="text-xs font-medium">Tap to call</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Emergency Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-100"
        >
          <h3 className="font-semibold text-amber-800 mb-3">While waiting for help:</h3>
          <ul className="space-y-2 text-sm text-amber-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
              Stay calm and keep the person comfortable
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
              Do not give food or water unless advised
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
              Keep airways clear and monitor breathing
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
              Note time of incident and symptoms
            </li>
          </ul>
        </motion.div>

        {/* Back to App */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="outline" className="w-full h-12 rounded-xl">
              Return to Health Dashboard
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}