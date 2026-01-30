import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Eye, 
  Baby, 
  Bone, 
  Brain,
  Stethoscope,
  Wind,
  Ear,
  Apple,
  Droplet,
  Activity,
  MoreHorizontal
} from 'lucide-react';

const specialties = [
  { id: 'cardiology', name: 'Cardiology', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'ophthalmology', name: 'Ophthalmology', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'pediatrics', name: 'Pediatrics', icon: Baby, color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'orthopaedics', name: 'Orthopaedics', icon: Bone, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'neurology', name: 'Neurology', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'dermatology', name: 'Dermatology', icon: Stethoscope, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'pulmonology', name: 'Pulmonology', icon: Wind, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { id: 'ent', name: 'ENT', icon: Ear, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'gastroenterology', name: 'Gastro', icon: Apple, color: 'text-lime-600', bg: 'bg-lime-50' },
  { id: 'nephrology', name: 'Nephrology', icon: Droplet, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'endocrinology', name: 'Endocrine', icon: Activity, color: 'text-teal-500', bg: 'bg-teal-50' },
  { id: 'more', name: 'More', icon: MoreHorizontal, color: 'text-slate-500', bg: 'bg-slate-50' },
];

export default function SpecialtyGrid() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {specialties.map((specialty, index) => (
        <motion.div
          key={specialty.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.03 }}
        >
          <Link 
            to={createPageUrl(`GeneralCare?specialty=${specialty.id}`)}
            className="flex flex-col items-center"
          >
            <div className={`w-12 h-12 rounded-2xl ${specialty.bg} flex items-center justify-center mb-1.5 transition-transform hover:scale-110`}>
              <specialty.icon className={`w-5 h-5 ${specialty.color}`} />
            </div>
            <span className="text-xs text-slate-600 text-center">{specialty.name}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}