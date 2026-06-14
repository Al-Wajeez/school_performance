/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PedagogicalDiagnostic } from '../types';
import { ShieldAlert, CheckCircle, BookOpen, Sparkles, ChevronLeft, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PedagogicalAnalysisProps {
  diagnostic: PedagogicalDiagnostic;
}

export default function PedagogicalAnalysis({ diagnostic }: PedagogicalAnalysisProps) {
  // Map severity themes to visual designs
  const severityStyles = {
    success: {
      cardBg: 'bg-emerald-50/40 border-emerald-150',
      iconBoxBg: 'bg-emerald-100 text-emerald-700',
      titleTextColor: 'text-emerald-900',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      icon: <CheckCircle className="w-5 h-5" />,
      accentColor: 'border-emerald-500'
    },
    info: {
      cardBg: 'bg-indigo-50/40 border-indigo-150',
      iconBoxBg: 'bg-indigo-100 text-indigo-700',
      titleTextColor: 'text-indigo-900',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      icon: <BookOpen className="w-5 h-5" />,
      accentColor: 'border-indigo-500'
    },
    warning: {
      cardBg: 'bg-amber-50/40 border-amber-150',
      iconBoxBg: 'bg-amber-100 text-amber-700',
      titleTextColor: 'text-amber-900',
      badgeColor: 'bg-amber-100 text-amber-800',
      icon: <ShieldAlert className="w-5 h-5" />,
      accentColor: 'border-amber-500'
    },
    danger: {
      cardBg: 'bg-rose-50/40 border-rose-150',
      iconBoxBg: 'bg-rose-100 text-rose-700',
      titleTextColor: 'text-rose-900',
      badgeColor: 'bg-rose-100 text-rose-800',
      icon: <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />,
      accentColor: 'border-rose-500'
    }
  };

  const style = severityStyles[diagnostic.severity] || severityStyles.info;

  return (
    <div id="pedagogical-analysis" className="space-y-6 mt-8">

      {/* 1. Dynamic Textual Diagnosis (التقرير التشخيصي البيداغوجي) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={diagnostic.category}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className={`p-6 rounded-2xl border ${style.cardBg} relative overflow-hidden transition-colors duration-300`}
        >
          {/* Subtle colored accent strip on the side (using right border since default is RTL!) */}
          <div className={`absolute top-0 right-0 bottom-0 w-1.5 border-r-6 ${style.accentColor}`} />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 ps-1">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${style.iconBoxBg}`}>
                {style.icon}
              </div>
              <div>
                <span className={`text-xs font-bold px-2.5 py-2 rounded-md ${style.badgeColor} mb-1 inline-block`}>
                  التوصيف البيداغوجي المعتمد
                </span>
                <h3 className={`text-lg font-extrabold ${style.titleTextColor}`}>
                  {diagnostic.title}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white/80 p-5 rounded-xl border border-slate-100/50 leading-relaxed text-sm text-slate-700 text-right ps-3">
            <span className="font-extrabold text-slate-800">التقرير النفسي البيداغوجي: </span>
            {diagnostic.description}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 2. Actionable Recommendations (التوصيات والنصائح البيداغوجية والفرز العلاجي) */}
      <div className="card-polish p-6 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">التوصيات الاستباقية لخطة العلاج البيداغوجي</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              ترجمة رقمية لقرارات مجلس المادة ومجالس الأقسام الجزائرية لمعالجة الثغرات فورا.
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={diagnostic.category + '_rec'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {diagnostic.recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-xl border border-dotted border-slate-150 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all duration-200"
              >
                <div className="mt-1 bg-white p-1 rounded-full border border-slate-200 text-slate-500 font-mono text-[10px] font-bold shrink-0 min-w-6 h-6 flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {rec}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
