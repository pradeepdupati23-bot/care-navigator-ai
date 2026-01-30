import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowRight, Heart } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    email: '',
    health_conditions: [],
    medications: [],
    lifestyle_indicators: {
      exercise_frequency: '',
      diet_type: '',
      smoking: false,
      alcohol: false
    }
  });

  const [conditionInput, setConditionInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');

  const handleAddCondition = () => {
    if (conditionInput.trim()) {
      setFormData({
        ...formData,
        health_conditions: [...formData.health_conditions, conditionInput.trim()]
      });
      setConditionInput('');
    }
  };

  const handleRemoveCondition = (index) => {
    setFormData({
      ...formData,
      health_conditions: formData.health_conditions.filter((_, i) => i !== index)
    });
  };

  const handleAddMedication = () => {
    if (medicationInput.trim()) {
      setFormData({
        ...formData,
        medications: [...formData.medications, medicationInput.trim()]
      });
      setMedicationInput('');
    }
  };

  const handleRemoveMedication = (index) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await base44.entities.HealthProfile.create({
        ...formData,
        user_email: formData.email,
        onboarding_completed: true,
        preferred_language: 'English'
      });
      
      navigate(createPageUrl('LanguageSelection'));
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Error creating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
            <Heart className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Health Profile Setup</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's Get to Know You</h1>
          <p className="text-gray-600">This helps us personalize your healthcare experience</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`h-2 w-24 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          <div className={`h-2 w-24 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>{step === 1 ? 'Basic Information' : 'Health Background'}</CardTitle>
            <CardDescription>
              {step === 1 ? 'Tell us about yourself' : 'Optional but helps us serve you better'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Enter your full name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="25"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.full_name || !formData.email || !formData.age || !formData.gender}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label>Current or Past Health Conditions</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={conditionInput}
                      onChange={(e) => setConditionInput(e.target.value)}
                      placeholder="e.g., Diabetes, Hypertension"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCondition()}
                    />
                    <Button type="button" onClick={handleAddCondition} variant="outline">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.health_conditions.map((condition, index) => (
                      <div key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {condition}
                        <button onClick={() => handleRemoveCondition(index)} className="hover:text-blue-900">×</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Ongoing Medications</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={medicationInput}
                      onChange={(e) => setMedicationInput(e.target.value)}
                      placeholder="e.g., Aspirin, Metformin"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddMedication()}
                    />
                    <Button type="button" onClick={handleAddMedication} variant="outline">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.medications.map((medication, index) => (
                      <div key={index} className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {medication}
                        <button onClick={() => handleRemoveMedication(index)} className="hover:text-cyan-900">×</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Exercise Frequency</Label>
                    <Select
                      value={formData.lifestyle_indicators.exercise_frequency}
                      onValueChange={(value) => setFormData({
                        ...formData,
                        lifestyle_indicators: { ...formData.lifestyle_indicators, exercise_frequency: value }
                      })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="3-4 times/week">3-4 times/week</SelectItem>
                        <SelectItem value="1-2 times/week">1-2 times/week</SelectItem>
                        <SelectItem value="Rarely">Rarely</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Diet Type</Label>
                    <Select
                      value={formData.lifestyle_indicators.diet_type}
                      onValueChange={(value) => setFormData({
                        ...formData,
                        lifestyle_indicators: { ...formData.lifestyle_indicators, diet_type: value }
                      })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                        <SelectItem value="Vegan">Vegan</SelectItem>
                        <SelectItem value="Mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="smoking"
                      checked={formData.lifestyle_indicators.smoking}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        lifestyle_indicators: { ...formData.lifestyle_indicators, smoking: checked }
                      })}
                    />
                    <Label htmlFor="smoking" className="cursor-pointer">Smoking</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="alcohol"
                      checked={formData.lifestyle_indicators.alcohol}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        lifestyle_indicators: { ...formData.lifestyle_indicators, alcohol: checked }
                      })}
                    />
                    <Label htmlFor="alcohol" className="cursor-pointer">Alcohol Consumption</Label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Creating Profile...' : 'Complete Setup'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}