/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StatisticalOutput, DashboardInputs } from '../types';
import { ArrowLeftRight, Percent, Layers, Sliders, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  metrics: StatisticalOutput;
  inputs: DashboardInputs;
}

export default function StatCard({ metrics, inputs }: StatCardProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      id="stat-cards-grid"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      {/* Metric 1: Range (المدى) */}
      <motion.div
        variants={itemVariants}
        className="card-polish p-5 flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div className="stat-icon-polish">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full font-sans">
            المدى الإحصائي
          </span>
        </div>
        <div className="mt-4 text-right">
          <p className="text-2xl font-bold tracking-tight text-slate-800 font-mono">
            {metrics.range.toFixed(2)}
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1">المدى (الفارق الأقصى)</p>
          <p className="text-[10px] text-slate-400 mt-1.5 leading-snug">
            الفارق بين أدنى معدل ({inputs.minGrade}) وأعلى معدل ({inputs.maxGrade}).
          </p>
        </div>
      </motion.div>

      {/* Metric 2: Variance (التباين) */}
      <motion.div
        variants={itemVariants}
        className="card-polish p-5 flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div className="stat-icon-polish !bg-purple-50 !text-purple-600">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full font-sans">
            قيمة التباين
          </span>
        </div>
        <div className="mt-4 text-right">
          <p className="text-2xl font-bold tracking-tight text-slate-800 font-mono">
            {metrics.variance.toFixed(2)}
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1">التباين المدرسي (Variance)</p>
          <p className="text-[10px] text-slate-400 mt-1.5 leading-snug">
            مربع الانحراف المعياري.
          </p>
        </div>
      </motion.div>

      {/* Metric 3: Success Rate (نسبة النجاح) */}
      <motion.div
        variants={itemVariants}
        className="card-polish p-5 flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div className="stat-icon-polish !bg-emerald-50 !text-emerald-600">
            <Percent className="w-5 h-5" />
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full font-sans">
            النسبة البيداغوجية
          </span>
        </div>
        <div className="mt-4 text-right">
          <div className="flex items-baseline justify-start gap-1 font-mono">
            <span className="text-2xl font-bold tracking-tight text-slate-800">
              {metrics.successRate.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-emerald-600 font-sans">%</span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">نسبة النجاح والتحصيل (أعلى من 10)</p>
          <p className="text-[10px] text-slate-400 mt-1.5 leading-snug">
            {inputs.passingStudents} تلميذ ناجح من إجمالي {inputs.totalStudents} تلميذ بالقسم.
          </p>
        </div>
      </motion.div>

      {/* Metric 4: Homogeneity Level (الانسجام) */}
      <motion.div
        variants={itemVariants}
        className="card-polish p-5 flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div className="stat-icon-polish !bg-amber-50 !text-amber-600">
            <Sliders className="w-5 h-5" />
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full font-sans">
            التماسك المعرفي
          </span>
        </div>
        <div className="mt-4 text-right">
          <span className={`inline-block text-xs font-bold px-2 py-1 rounded-md border text-center font-sans ${metrics.homogeneityBadgeColor} ${metrics.homogeneityLevel === 'low' ? 'badge-low' : metrics.homogeneityLevel === 'medium' ? 'badge-medium' : 'badge-high'
            }`}>
            {metrics.homogeneityStatus}
          </span>
          <p className="text-xs font-semibold text-slate-500 mt-2">مستوى التجانس والتشتت</p>
          <p className="text-[10px] text-slate-400 mt-1.5 leading-snug">
            {metrics.homogeneityLevel === 'high' && 'انحراف معياري ضئيل يدل على انسجام تام وتماسك التحصيل جماعياً.'}
            {metrics.homogeneityLevel === 'medium' && 'انحراف معياري مقبول يعكس توزعاً طبيعياً معتدلاً للفروق الذهنية.'}
            {metrics.homogeneityLevel === 'low' && 'انحراف قياسي حاد يؤكد تشتتاً بليغاً في التحصيل وفجوة بيداغوجية واسعة.'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
