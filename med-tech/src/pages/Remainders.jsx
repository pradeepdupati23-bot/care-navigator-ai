import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Plus, 
  Pill, 
  Droplet, 
  Dumbbell, 
  Apple,
  Calendar,
  Clock,
  Trash2,
  Bell
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const reminderTypes = [
  { id: 'medication', name: 'Medication', icon: Pill, color: 'bg-violet-500' },
  { id: 'hydration', name: 'Hydration', icon: Droplet, color: 'bg-cyan-500' },
  { id: 'exercise', name: 'Exercise', icon: Dumbbell, color: 'bg-orange-500' },
  { id: 'nutrition', name: 'Nutrition', icon: Apple, color: 'bg-emerald-500' },
  { id: 'appointment', name: 'Appointment', icon: Calendar, color: 'bg-blue-500' },
  { id: 'checkup', name: 'Checkup', icon: Clock, color: 'bg-rose-500' },
];

export default function Reminders() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    type: 'medication',
    title: '',
    description: '',
    time: '',
    frequency: 'daily',
    is_active: true
  });

  const { data: reminders, isLoading } = useQuery({
    queryKey: ['reminders'],
    queryFn: () => base44.entities.HealthReminder.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.HealthReminder.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['reminders']);
      setIsDialogOpen(false);
      setNewReminder({
        type: 'medication',
        title: '',
        description: '',
        time: '',
        frequency: 'daily',
        is_active: true
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.HealthReminder.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['reminders']);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.HealthReminder.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['reminders']);
    }
  });

  const getTypeInfo = (type) => {
    return reminderTypes.find(t => t.id === type) || reminderTypes[0];
  };

  const handleCreate = () => {
    if (!newReminder.title.trim()) return;
    createMutation.mutate(newReminder);
  };

  const toggleActive = (reminder) => {
    updateMutation.mutate({ 
      id: reminder.id, 
      data: { is_active: !reminder.is_active }
    });
  };

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
          <div>
            <h1 className="font-semibold text-slate-900">Health Reminders</h1>
            <p className="text-xs text-slate-500">Stay on track with your health</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="mx-4 rounded-2xl">
            <DialogHeader>
              <DialogTitle>Create New Reminder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Reminder Type</Label>
                <Select 
                  value={newReminder.type} 
                  onValueChange={(v) => setNewReminder(prev => ({ ...prev, type: v }))}
                >
                  <SelectTrigger className="mt-2 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reminderTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Title</Label>
                <Input
                  placeholder="e.g., Take Vitamin D"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-2 rounded-xl"
                />
              </div>
              
              <div>
                <Label>Description (Optional)</Label>
                <Input
                  placeholder="Additional notes"
                  value={newReminder.description}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-2 rounded-xl"
                />
              </div>
              
              <div>
                <Label>Time</Label>
                <Input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                  className="mt-2 rounded-xl"
                />
              </div>
              
              <div>
                <Label>Frequency</Label>
                <Select 
                  value={newReminder.frequency} 
                  onValueChange={(v) => setNewReminder(prev => ({ ...prev, frequency: v }))}
                >
                  <SelectTrigger className="mt-2 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleCreate}
                disabled={!newReminder.title.trim() || createMutation.isPending}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Reminder'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <main className="px-6 py-6">
        {/* Quick Add Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {['medication', 'hydration', 'exercise'].map(type => {
            const typeInfo = getTypeInfo(type);
            return (
              <button
                key={type}
                onClick={() => {
                  setNewReminder(prev => ({ ...prev, type }));
                  setIsDialogOpen(true);
                }}
                className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors text-center"
              >
                <div className={w-8 h-8 ${typeInfo.color} rounded-lg flex items-center justify-center mx-auto mb-2}>
                  <typeInfo.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-slate-600">{typeInfo.name}</span>
              </button>
            );
          })}
        </div>

        {/* Reminders List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-4 border-0 shadow-sm">
                <div className="animate-pulse flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : reminders?.length > 0 ? (
          <AnimatePresence>
            <div className="space-y-3">
              {reminders.map((reminder, index) => {
                const typeInfo = getTypeInfo(reminder.type);
                const IconComponent = typeInfo.icon;
                
                return (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={p-4 border-0 shadow-sm ${!reminder.is_active ? 'opacity-50' : ''}}>
                      <div className="flex items-center gap-3">
                        <div className={w-10 h-10 rounded-xl ${typeInfo.color} flex items-center justify-center}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-800 truncate">{reminder.title}</h3>
                          <div className="flex items-center gap-3 mt-0.5">
                            {reminder.time && (
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {reminder.time}
                              </span>
                            )}
                            <span className="text-xs text-slate-400 capitalize">{reminder.frequency}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={reminder.is_active}
                            onCheckedChange={() => toggleActive(reminder)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-rose-500"
                            onClick={() => deleteMutation.mutate(reminder.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        ) : (
          <Card className="p-8 border border-dashed border-slate-200 bg-slate-50/50 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-medium text-slate-700 mb-1">No reminders yet</h3>
            <p className="text-sm text-slate-500 mb-4">
              Set up reminders to stay on top of your health routine
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Reminder
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}