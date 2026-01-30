import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Droplet, ArrowLeft, Phone, MapPin, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function BloodBank() {
  const [activeTab, setActiveTab] = useState('search');
  const [donorForm, setDonorForm] = useState({
    full_name: '',
    blood_group: '',
    phone_number: '',
    location: ''
  });
  const [searchBloodGroup, setSearchBloodGroup] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const { data: profiles } = useQuery({
    queryKey: ['healthProfile'],
    queryFn: () => base44.entities.HealthProfile.list(),
    initialData: []
  });

  const { data: donors, refetch: refetchDonors } = useQuery({
    queryKey: ['bloodDonors', searchBloodGroup],
    queryFn: async () => {
      if (searchBloodGroup) {
        return await base44.entities.BloodDonor.filter({
          blood_group: searchBloodGroup,
          willing_to_donate: true,
          available_for_donation: true
        });
      }
      return [];
    },
    enabled: !!searchBloodGroup,
    initialData: []
  });

  const profile = profiles[0];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleRegisterDonor = async () => {
    if (!donorForm.full_name || !donorForm.blood_group || !donorForm.phone_number || !donorForm.location) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await base44.entities.BloodDonor.create({
        ...donorForm,
        user_email: profile?.user_email || 'anonymous',
        willing_to_donate: true,
        available_for_donation: true
      });
      
      setRegistrationSuccess(true);
      setDonorForm({ full_name: '', blood_group: '', phone_number: '', location: '' });
      
      setTimeout(() => setRegistrationSuccess(false), 5000);
    } catch (error) {
      console.error('Error registering donor:', error);
      alert('Error registering. Please try again.');
    }
  };

  const handleSearchDonors = async () => {
    if (!searchBloodGroup) {
      alert('Please select a blood group to search');
      return;
    }
    refetchDonors();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
              <Droplet className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart Blood Bank</h1>
              <p className="text-gray-600">Save lives through blood donation</p>
            </div>
          </div>
        </div>

        {registrationSuccess && (
          <div className="mb-6 bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Registration Successful!</p>
              <p className="text-sm text-green-700">Thank you for registering as a blood donor. You're now part of our life-saving network.</p>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="search">Find Donors</TabsTrigger>
            <TabsTrigger value="register">Register as Donor</TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Search for Blood Donors</CardTitle>
                <CardDescription>Find available blood donors in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label>Select Blood Group</Label>
                    <div className="flex gap-3 mt-2">
                      <Select value={searchBloodGroup} onValueChange={setSearchBloodGroup}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodGroups.map((group) => (
                            <SelectItem key={group} value={group}>{group}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleSearchDonors} className="bg-red-600 hover:bg-red-700">
                        Search
                      </Button>
                    </div>
                  </div>

                  {donors.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Available Donors ({donors.length})</h3>
                      {donors.map((donor) => (
                        <Card key={donor.id} className="border border-red-200 bg-red-50">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge className="bg-red-600 text-white text-base px-3 py-1">
                                    {donor.blood_group}
                                  </Badge>
                                  <h4 className="font-semibold text-gray-900">{donor.full_name}</h4>
                                </div>
                                <div className="space-y-1 text-sm text-gray-700">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span>{donor.location}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span>{donor.phone_number}</span>
                                  </div>
                                </div>
                              </div>
                              <Button 
                                onClick={() => window.location.href = `tel:${donor.phone_number}`}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                Call
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {searchBloodGroup && donors.length === 0 && (
                    <div className="text-center py-8">
                      <Droplet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No donors found for {searchBloodGroup} blood group</p>
                      <p className="text-sm text-gray-500 mt-2">Encourage others to register as donors</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Register as Blood Donor</CardTitle>
                <CardDescription>Help save lives by becoming a voluntary blood donor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="donor_name">Full Name *</Label>
                    <Input
                      id="donor_name"
                      value={donorForm.full_name}
                      onChange={(e) => setDonorForm({ ...donorForm, full_name: e.target.value })}
                      placeholder="Enter your full name"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="blood_group">Blood Group *</Label>
                    <Select
                      value={donorForm.blood_group}
                      onValueChange={(value) => setDonorForm({ ...donorForm, blood_group: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select your blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={donorForm.phone_number}
                      onChange={(e) => setDonorForm({ ...donorForm, phone_number: e.target.value })}
                      placeholder="Your contact number"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location / City *</Label>
                    <Input
                      id="location"
                      value={donorForm.location}
                      onChange={(e) => setDonorForm({ ...donorForm, location: e.target.value })}
                      placeholder="Your city or area"
                      className="mt-2"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Donor Eligibility</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Age: 18-65 years</li>
                      <li>• Weight: Minimum 50 kg</li>
                      <li>• Healthy and not on medication</li>
                      <li>• No recent illness or surgery</li>
                      <li>• Last donation: At least 3 months ago</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleRegisterDonor}
                    className="w-full bg-red-600 hover:bg-red-700"
                    size="lg"
                  >
                    Register as Donor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Impact Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-pink-500 text-white">
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold mb-2">500+</p>
              <p className="text-white/90">Registered Donors</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-500 to-red-500 text-white">
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold mb-2">1,200+</p>
              <p className="text-white/90">Lives Saved</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-600 to-red-500 text-white">
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold mb-2">24/7</p>
              <p className="text-white/90">Available Support</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}