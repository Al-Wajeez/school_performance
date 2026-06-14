/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { generateBellCurveData } from '../utils/analysis';
import { motion, AnimatePresence } from 'motion/react';
import { Info, HelpCircle } from 'lucide-react';

interface GradeDistributionChartProps {
  mean: number;
  standardDeviation: number;
}

export default function GradeDistributionChart({ mean, standardDeviation }: GradeDistributionChartProps) {
  // Use useMemo to avoid recalculation unless mean or standardDeviation transforms
  const data = useMemo(() => {
    return generateBellCurveData(mean, standardDeviation);
  }, [mean, standardDeviation]);

  // Generate X-axis ticks (0 to 20, step of 2)
  const ticks = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

  return (
    <div id="grade-distribution-chart" className="card-polish p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">التمثيل البياني الإحصائي (منحنى التوزيع الطبيعي)</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            توضيح بصري رياضي لتشتت تلاميذ الصف وتجمعهم مقارنة بعتبة النجاح المطلقة (10/20).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md border border-amber-100 font-medium font-mono">
            {standardDeviation.toFixed(2)} = σ
          </span>
          <span className="flex items-center gap-1 text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-md border border-teal-100 font-medium font-mono">
            {mean.toFixed(2)} = μ
          </span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-hidden bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${data.width} ${data.height}`}
          className="w-full max-w-lg h-auto select-none"
          dir="ltr" // Render SVG ltr for graph coordinates mathematical consistency
        >
          <defs>
            {/* Gradients for Passing & Failing regions */}
            <linearGradient id="gradient-pass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="gradient-fail" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines helper */}
          <line
            x1={data.paddingX}
            y1={data.height - data.paddingY}
            x2={data.width - data.paddingX}
            y2={data.height - data.paddingY}
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />

          {/* Shaded Areas with smooth motion interpolation */}
          <motion.path
            d={data.pfPath}
            fill="url(#gradient-fail)"
            animate={{ d: data.pfPath }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
          <motion.path
            d={data.psPath}
            fill="url(#gradient-pass)"
            animate={{ d: data.psPath }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />

          {/* The main Bell Curve Curve */}
          <motion.path
            d={data.bellLinePath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            animate={{ d: data.bellLinePath }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />

          {/* Critical Threshold line at Grade 10 */}
          {(() => {
            const chartW = data.width - data.paddingX * 2;
            const threshold_px = data.paddingX + (10 / 20) * chartW;
            return (
              <g>
                <line
                  x1={threshold_px}
                  y1={data.paddingY}
                  x2={threshold_px}
                  y2={data.height - data.paddingY}
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <circle cx={threshold_px} cy={data.height - data.paddingY} r="3" fill="#ef4444" />
                <text
                  x={threshold_px}
                  y={data.paddingY - 5}
                  textAnchor="middle"
                  fill="#ef4444"
                  className="text-[10px] font-bold"
                >
                  عتبة النجاح (10)
                </text>
              </g>
            );
          })()}

          {/* Mean marker line */}
          <g>
            <motion.line
              x1={data.mean_px}
              y1={data.mean_py}
              x2={data.mean_px}
              y2={data.height - data.paddingY}
              stroke="#0f766e"
              strokeWidth="2"
              strokeDasharray="4 2"
              animate={{ x1: data.mean_px, x2: data.mean_px, y1: data.mean_py }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
            <motion.circle
              cx={data.mean_px}
              cy={data.mean_py}
              r="4"
              fill="#0d9488"
              animate={{ cx: data.mean_px, cy: data.mean_py }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
          </g>

          {/* Standard Deviation boundaries shading or bracket indicators */}
          {(() => {
            const sdY = data.height - data.paddingY - 24;
            return (
              <g>
                {/* Mean - SD marker line */}
                <motion.line
                  x1={data.mMinusSd_px}
                  y1={sdY - 10}
                  x2={data.mMinusSd_px}
                  y2={data.height - data.paddingY}
                  stroke="#4f46e5"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  animate={{ x1: data.mMinusSd_px, x2: data.mMinusSd_px }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
                {/* Mean + SD marker line */}
                <motion.line
                  x1={data.mPlusSd_px}
                  y1={sdY - 10}
                  x2={data.mPlusSd_px}
                  y2={data.height - data.paddingY}
                  stroke="#4f46e5"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  animate={{ x1: data.mPlusSd_px, x2: data.mPlusSd_px }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />

                {/* Bracket connecting them */}
                <motion.line
                  x1={data.mMinusSd_px}
                  y1={sdY}
                  x2={data.mPlusSd_px}
                  y2={sdY}
                  stroke="#4f46e5"
                  strokeWidth="1.5"
                  animate={{ x1: data.mMinusSd_px, x2: data.mPlusSd_px }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />

                {/* Tick markers */}
                <motion.line
                  x1={data.mMinusSd_px}
                  y1={sdY - 4}
                  x2={data.mMinusSd_px}
                  y2={sdY + 4}
                  stroke="#4f46e5"
                  strokeWidth="1.5"
                  animate={{ x1: data.mMinusSd_px, x2: data.mMinusSd_px }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
                <motion.line
                  x1={data.mPlusSd_px}
                  y1={sdY - 4}
                  x2={data.mPlusSd_px}
                  y2={sdY + 4}
                  stroke="#4f46e5"
                  strokeWidth="1.5"
                  animate={{ x1: data.mPlusSd_px, x2: data.mPlusSd_px }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />

                {/* SD Zone Label (Span containing roughly 68.2% of performance) */}
                <motion.text
                  x={(data.mMinusSd_px + data.mPlusSd_px) / 2}
                  y={sdY - 6}
                  textAnchor="middle"
                  fill="#4f46e5"
                  className="text-[9px] font-bold"
                  animate={{ x: (data.mMinusSd_px + data.mPlusSd_px) / 2 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  نطاق الفروق الطبيعية الأساسية (68%)
                </motion.text>
              </g>
            );
          })()}

          {/* X Axis Grade labels (0 to 20) */}
          {ticks.map((val) => {
            const chartW = data.width - data.paddingX * 2;
            const px = data.paddingX + (val / 20) * chartW;
            return (
              <g key={val}>
                <line
                  x1={px}
                  y1={data.height - data.paddingY}
                  x2={px}
                  y2={data.height - data.paddingY + 4}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
                <text
                  x={px}
                  y={data.height - data.paddingY + 16}
                  textAnchor="middle"
                  fill="#64748b"
                  className="text-[10px] font-mono leading-none"
                >
                  {val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Guide Map to read the graphics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs text-slate-500 border-t border-slate-50 pt-4">
        <div className="flex items-center gap-2 justify-end text-right">
          <span>نطاق التعثـر الدراسي (أقل من 10)</span>
          <div className="w-3.5 h-3.5 rounded-xs bg-rose-100 border border-rose-200" />
        </div>
        <div className="flex items-center gap-2 justify-end text-right">
          <span>نطاق النجاح والكفاية (10 فأعلى)</span>
          <div className="w-3.5 h-3.5 rounded-xs bg-emerald-100 border border-emerald-200" />
        </div>
        <div className="flex items-center gap-2 justify-end text-right">
          <span>المتوسط الحسابي للقسم (μ)</span>
          <div className="w-5 border-t-2 border-dashed border-teal-600 h-0" />
        </div>
        <div className="flex items-center gap-2 justify-end text-right">
          <span>منطقة توزع الغالبية المستقرة</span>
          <div className="w-5 border-t border-indigo-600 h-0" />
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed text-right">
          <strong>ملاحظة إحصائية:</strong> كلما كان المنحنى ضيقاً ومرتفعاً بالأعلى، يشير ذلك لتقارب المستويات في الحجرة الصفية (تجانس وتماثل). وكلما انبسط المنحنى وتمدد أفقياً، دل على اتساع Фروق التلاميذ التعليمية (تشتت حاد) وصعوبة قيادتهم بيداغوجياً بأسلوب موحد.
        </p>
      </div>
    </div>
  );
}
