import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, Camera, Send, ArrowLeft, Stethoscope, 
  AlertTriangle, Info, CheckCircle 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function GeneralCare() {
  const navigate = useNavigate();
  const [symptomText, setSymptomText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  const { data: profiles } = useQuery({
    queryKey: ['healthProfile'],
    queryFn: () => base44.entities.HealthProfile.list(),
    initialData: []
  });

  const profile = profiles[0];

  const medicalDomains = [
    'Cardiology', 'Ophthalmology', 'Gynecology', 'Orthopaedics',
    'Pediatrics', 'Neurology', 'Dermatology', 'Pulmonology',
    'ENT', 'Gastroenterology', 'Nephrology', 'Endocrinology'
  ];

  const handleVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulated voice recording - in production, use Web Speech API
      setTimeout(() => {
        setSymptomText(symptomText + ' [Voice input captured]');
        setIsRecording(false);
      }, 2000);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setUploadedImage(file_url);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const analyzeSymptoms = async () => {
    if (!symptomText.trim() && !uploadedImage) {
      alert('Please describe your symptoms');
      return;
    }

    setIsAnalyzing(true);

    try {
      const profileContext = profile ? `
        Patient Profile:
        - Age: ${profile.age}
        - Gender: ${profile.gender}
        - Existing Conditions: ${profile.health_conditions?.join(', ') || 'None'}
        - Current Medications: ${profile.medications?.join(', ') || 'None'}
      ` : '';

      const prompt = `You are a medical AI assistant analyzing patient symptoms. 
      
${profileContext}

Symptoms: ${symptomText}

Analyze these symptoms and provide:
1. Most relevant medical domain from: ${medicalDomains.join(', ')}
2. Risk level: Basic Care, Intermediate Care, or Advanced Care
3. Brief explanation of the risk classification
4. Recommended next steps
5. Suggested over-the-counter medicines (if appropriate for Basic Care) with purpose, how it helps, and safety note
6. When to see a doctor urgently

Return ONLY valid JSON with this exact structure:
{
  "domain": "string",
  "risk_level": "string",
  "risk_explanation": "string",
  "recommendations": "string",
  "suggested_medicines": [
    {
      "name": "string",
      "purpose": "string",
      "how_it_helps": "string",
      "safety_note": "string"
    }
  ],
  "urgent_consultation_needed": boolean
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            domain: { type: 'string' },
            risk_level: { type: 'string' },
            risk_explanation: { type: 'string' },
            recommendations: { type: 'string' },
            suggested_medicines: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  purpose: { type: 'string' },
                  how_it_helps: { type: 'string' },
                  safety_note: { type: 'string' }
                }
              }
            },
            urgent_consultation_needed: { type: 'boolean' }
          }
        },
        file_urls: uploadedImage ? [uploadedImage] : undefined
      });

      setAnalysisResult(result);

      // Save to database
      await base44.entities.SymptomReport.create({
        user_email: profile?.user_email || 'anonymous',
        symptom_description: symptomText,
        input_type: uploadedImage ? 'image' : 'text',
        image_url: uploadedImage,
        analyzed_domain: result.domain,
        risk_level: result.risk_level,
        recommendations: result.recommendations,
        suggested_medicines: result.suggested_medicines
      });

    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      alert('Error analyzing symptoms. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'Basic Care':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate Care':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced Care':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'Basic Care':
        return <CheckCircle className="w-5 h-5" />;
      case 'Intermediate Care':
        return <Info className="w-5 h-5" />;
      case 'Advanced Care':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return null;
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">General Care</h1>
          <p className="text-gray-600">Describe your symptoms and get AI-powered health guidance</p>
        </div>

        {!analysisResult ? (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                Tell Us What You're Experiencing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Textarea
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  placeholder="Describe your symptoms in detail... (e.g., I have a headache, fever, and body pain since yesterday)"
                  className="min-h-32"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleVoiceInput}
                  variant="outline"
                  disabled={isRecording}
                  className="flex-1 min-w-40"
                >
                  <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
                  {isRecording ? 'Recording...' : 'Voice Input'}
                </Button>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex-1 min-w-40"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <Button
                  onClick={analyzeSymptoms}
                  disabled={isAnalyzing || (!symptomText.trim() && !uploadedImage)}
                  className="flex-1 min-w-40 bg-blue-600 hover:bg-blue-700"
                >
                  {isAnalyzing ? (
                    <>Analyzing...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Analyze Symptoms
                    </>
                  )}
                </Button>
              </div>

              {uploadedImage && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">✓ Image uploaded successfully</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Medical Domain */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <CardHeader>
                <CardTitle className="text-white">Medical Domain Identified</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-2xl font-bold">{analysisResult.domain}</p>
                </div>
              </CardContent>
            </Card>

            {/* Risk Classification */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Health Risk Classification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge className={`${getRiskLevelColor(analysisResult.risk_level)} text-base px-4 py-2 border-2`}>
                    <span className="flex items-center gap-2">
                      {getRiskIcon(analysisResult.risk_level)}
                      {analysisResult.risk_level}
                    </span>
                  </Badge>
                  <p className="text-gray-700">{analysisResult.risk_explanation}</p>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Recommended Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{analysisResult.recommendations}</p>
              </CardContent>
            </Card>

            {/* Suggested Medicines */}
            {analysisResult.suggested_medicines && analysisResult.suggested_medicines.length > 0 && (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Suggested Medicines</CardTitle>
                  <p className="text-sm text-gray-600 mt-2">These are general suggestions. Consult a doctor before taking any medication.</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.suggested_medicines.map((medicine, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{medicine.name}</h4>
                        <div className="space-y-2 text-sm text-gray-700">
                          <p><strong>Purpose:</strong> {medicine.purpose}</p>
                          <p><strong>How it helps:</strong> {medicine.how_it_helps}</p>
                          <p className="text-amber-700"><strong>Safety Note:</strong> {medicine.safety_note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Urgent Consultation Warning */}
            {analysisResult.urgent_consultation_needed && (
              <Card className="border-0 shadow-xl bg-red-50 border-2 border-red-300">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-red-800">
                    <AlertTriangle className="w-6 h-6" />
                    <div>
                      <p className="font-semibold">Urgent Doctor Consultation Recommended</p>
                      <p className="text-sm mt-1">Please consult with a healthcare professional as soon as possible.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setAnalysisResult(null);
                  setSymptomText('');
                  setUploadedImage(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Analyze New Symptoms
              </Button>
              <Link to={createPageUrl('EmergencyMode')} className="flex-1">
                <Button variant="destructive" className="w-full">
                  Need Emergency Help
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}