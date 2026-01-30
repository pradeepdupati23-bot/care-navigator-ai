import React from 'react';
import { motion } from 'framer-motion';

export default function FeatureBadge({ icon: Icon, label, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-100 shadow-sm"
    >
      <Icon className="w-4 h-4 text-blue-600" />
      <span className="text-xs font-medium text-slate-700">{label}</span>
    </motion.div>
  );
}