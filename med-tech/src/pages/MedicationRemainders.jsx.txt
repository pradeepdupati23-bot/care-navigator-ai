import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pill, Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function MedicationReminders() {
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'Daily'
  });

  const queryClient = useQueryClient();

  const { data: profiles } = useQuery({
    queryKey: ['healthProfile'],
    queryFn: () => base44.entities.HealthProfile.list(),
    initialData: []
  });

  const profile = profiles[0];

  const { data: reminders, isLoading } = useQuery({
    queryKey: ['medicationReminders'],
    queryFn: async () => {
      if (profile) {
        return await base44.entities.HealthReminder.filter({
          user_email: profile.user_email,
          reminder_type: 'medication'
        });
      }
      return [];
    },
    enabled: !!profile,
    initialData: []
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.HealthReminder.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicationReminders'] });
      queryClient.invalidateQueries({ queryKey: ['healthReminders'] });
      setShowForm(false);
      setFormData({ title: '', description: '', frequency: 'Daily' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.HealthReminder.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicationReminders'] });
      queryClient.invalidateQueries({ queryKey: ['healthReminders'] });
      setShowForm(false);
      setEditingReminder(null);
      setFormData({ title: '', description: '', frequency: 'Daily' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.HealthReminder.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicationReminders'] });
      queryClient.invalidateQueries({ queryKey: ['healthReminders'] });
    }
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      alert('Please fill all fields');
      return;
    }

    if (editingReminder) {
      updateMutation.mutate({
        id: editingReminder.id,
        data: {
          ...formData,
          user_email: profile.user_email,
          reminder_type: 'medication',
          is_active: true
        }
      });
    } else {
      createMutation.mutate({
        ...formData,
        user_email: profile.user_email,
        reminder_type: 'medication',
        is_active: true
      });
    }
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      description: reminder.description,
      frequency: reminder.frequency
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Medication Reminders</h1>
            <p className="text-gray-600">Manage your daily medication schedule</p>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingReminder(null);
              setFormData({ title: '', description: '', frequency: 'Daily' });
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Reminder
          </Button>
        </div>

        {showForm && (
          <Card className="border-0 shadow-xl mb-6">
            <CardHeader>
              <CardTitle>{editingReminder ? 'Edit Reminder' : 'New Medication Reminder'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Medicine Name</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Aspirin 100mg"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Instructions</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., Take after breakfast"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Twice a day">Twice a day</SelectItem>
                      <SelectItem value="Three times a day">Three times a day</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="As needed">As needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setShowForm(false);
                      setEditingReminder(null);
                      setFormData({ title: '', description: '', frequency: 'Daily' });
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {editingReminder ? 'Update' : 'Create'} Reminder
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading reminders...</p>
          </div>
        ) : reminders.length > 0 ? (
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <Card key={reminder.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Pill className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{reminder.title}</h3>
                          <Badge variant="outline" className="mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {reminder.frequency}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 ml-13 mt-2">{reminder.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(reminder)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDelete(reminder.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-xl">
            <CardContent className="pt-12 pb-12 text-center">
              <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Medication Reminders</h3>
              <p className="text-gray-600 mb-6">Start by adding your first medication reminder</p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Reminder
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}