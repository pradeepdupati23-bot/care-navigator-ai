import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Pill, Droplet, Dumbbell, Apple } from 'lucide-react';

export default function ReminderCard({ reminders }) {
  const getIcon = (type) => {
    switch(type) {
      case 'medication': return Pill;
      case 'hydration': return Droplet;
      case 'exercise': return Dumbbell;
      case 'nutrition': return Apple;
      default: return Pill;
    }
  };

  const getColor = (type) => {
    switch(type) {
      case 'medication': return 'bg-violet-500';
      case 'hydration': return 'bg-cyan-500';
      case 'exercise': return 'bg-orange-500';
      case 'nutrition': return 'bg-emerald-500';
      default: return 'bg-slate-500';
    }
  };

  const activeReminders = reminders?.filter(r => r.is_active)?.slice(0, 3) || [];

  if (activeReminders.length === 0) {
    return (
      <Card className="p-4 border border-dashed border-slate-200 bg-slate-50/50">
        <p className="text-sm text-slate-500 text-center">
          No active reminders. Add one to stay on track!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {activeReminders.map((reminder, index) => {
        const IconComponent = getIcon(reminder.type);
        return (
          <motion.div
            key={reminder.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-3 flex items-center gap-3 border-0 shadow-sm bg-white">
              <div className={`w-10 h-10 rounded-xl ${getColor(reminder.type)} flex items-center justify-center`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-800 text-sm truncate">{reminder.title}</h4>
                <p className="text-xs text-slate-500">{reminder.time || 'Anytime'}</p>
              </div>
              <span className="text-xs font-medium text-slate-400 capitalize">{reminder.frequency}</span>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}