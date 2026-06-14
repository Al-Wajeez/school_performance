import React, { useState } from 'react';
import { RiskScore, RiskThresholds, DEFAULT_RISK_THRESHOLDS } from '../types';
import { ShieldAlert, AlertTriangle, CheckCircle, Settings, Gauge, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  riskScore: RiskScore;
  thresholds: RiskThresholds;
  onThresholdsChange: (t: RiskThresholds) => void;
}

export default function EarlyWarningPanel({ riskScore, thresholds, onThresholdsChange }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const [localThresholds, setLocalThresholds] = useState(thresholds);

  const levelConfig = {
    safe: { icon: <CheckCircle className="w-6 h-6" />, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', label: 'آمن' },
    moderate: { icon: <AlertTriangle className="w-6 h-6" />, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700', label: 'تنبيه' },
    danger: { icon: <ShieldAlert className="w-6 h-6" />, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200', badge: 'bg-rose-100 text-rose-700', label: 'خطر' },
  };

  const lc = levelConfig[riskScore.level];

  const riskBarColor = riskScore.total >= 7 ? 'bg-rose-500' : riskScore.total >= 4 ? 'bg-amber-500' : 'bg-emerald-500';

  const handleSave = () => {
    onThresholdsChange(localThresholds);
    setShowSettings(false);
  };

  const breakdownItems = [
    { label: 'المتوسط الحسابي', score: riskScore.breakdown.meanScore, max: 2.5, value: localThresholds.meanWarning + '+' },
    { label: 'الانحراف المعياري', score: riskScore.breakdown.sdScore, max: 2.5, value: localThresholds.sdWarning + '+' },
    { label: 'نسبة النجاح', score: riskScore.breakdown.successRateScore, max: 2.5, value: '< ' + localThresholds.successRateWarning + '%' },
    { label: 'المدى', score: riskScore.breakdown.rangeScore, max: 2.5, value: '> ' + localThresholds.rangeWarning },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-2xl border ${lc.bg} relative overflow-hidden`}
    >
      <div className={`absolute top-0 right-0 bottom-0 w-1.5 border-r-6 ${riskScore.level === 'danger' ? 'border-rose-500' : riskScore.level === 'moderate' ? 'border-amber-500' : 'border-emerald-500'}`} />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${riskScore.level === 'danger' ? 'bg-rose-100 text-rose-700' : riskScore.level === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {lc.icon}
          </div>
          <div>
            <span className={`text-[10px] font-bold px-2 py-2 rounded-md ${lc.badge} inline-block`}>
              نظام الإنذار الأكاديمي المبكر
            </span>
            <h3 className="text-sm font-extrabold text-slate-800 mt-0.5">
              مؤشر الخطر المركب
            </h3>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>ضبط العتبات</span>
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-4 rounded-xl bg-white border border-slate-200"
        >
          <h4 className="text-xs font-bold text-slate-700 mb-3">تعديل عتبات الإنذار</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {([
              { key: 'meanWarning', label: 'تحذير المتوسط', val: localThresholds.meanWarning },
              { key: 'meanDanger', label: 'خطر المتوسط', val: localThresholds.meanDanger },
              { key: 'sdWarning', label: 'تحذير الانحراف', val: localThresholds.sdWarning },
              { key: 'sdDanger', label: 'خطر الانحراف', val: localThresholds.sdDanger },
              { key: 'successRateWarning', label: 'تحذير النجاح %', val: localThresholds.successRateWarning },
              { key: 'successRateDanger', label: 'خطر النجاح %', val: localThresholds.successRateDanger },
              { key: 'rangeWarning', label: 'تحذير المدى', val: localThresholds.rangeWarning },
              { key: 'rangeDanger', label: 'خطر المدى', val: localThresholds.rangeDanger },
            ] as const).map(({ key, label, val }) => (
              <div key={key}>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">{label}</label>
                <input
                  type="number"
                  value={val}
                  onChange={(e) => setLocalThresholds({ ...localThresholds, [key]: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 text-center"
                  dir="ltr"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => { setLocalThresholds(DEFAULT_RISK_THRESHOLDS); onThresholdsChange(DEFAULT_RISK_THRESHOLDS); setShowSettings(false); }}
              className="text-xs text-slate-500 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              إعادة تعيين
            </button>
            <button
              onClick={handleSave}
              className="text-xs text-white bg-indigo-600 px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              حفظ
            </button>
          </div>
        </motion.div>
      )}

      {/* Main risk gauge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gauge */}
        <div className="bg-white/80 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
          <div className="relative w-24 h-24 mb-2">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#E2E8F0" strokeWidth="8" />
              <circle cx="60" cy="60" r="50" fill="none" stroke={riskScore.total >= 7 ? '#F43F5E' : riskScore.total >= 4 ? '#F59E0B' : '#10B981'} strokeWidth="8"
                strokeDasharray={`${(riskScore.total / 10) * 314} 314`} strokeLinecap="round" />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-xl font-extrabold ${lc.color}`}>
              {riskScore.total.toFixed(1)}
            </span>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${lc.badge}`}>
            {lc.label}
          </span>
          <p className="text-[10px] text-slate-400 mt-1">من 10</p>
        </div>

        {/* Breakdown */}
        <div className="bg-white/80 p-4 rounded-xl border border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 mb-3">تفصيل المؤشر</h4>
          <div className="space-y-2.5">
            {breakdownItems.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-500">{item.label}</span>
                  <span className="text-[10px] font-mono text-slate-400">{item.score.toFixed(1)}/{item.max.toFixed(1)}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${item.score >= 2 ? 'bg-rose-400' : item.score >= 1 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                    style={{ width: `${(item.score / item.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status messages */}
        <div className="bg-white/80 p-4 rounded-xl border border-slate-100 flex flex-col justify-center">
          {riskScore.level === 'danger' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-rose-700">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <p className="text-xs font-bold">إنذار أحمر: تدخل عاجل مطلوب</p>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                المؤشرات تتجاوز العتبات الحرجة في عدة أبعاد. يستدعي الأمر انعقاد مجلس قسم استثنائي ووضع خطة تدخل فورية.
              </p>
            </div>
          )}
          {riskScore.level === 'moderate' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-700">
                <TrendingDown className="w-5 h-5 shrink-0" />
                <p className="text-xs font-bold">مؤشرات تحت المراقبة</p>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                بعض المؤشرات تقترب من العتبات الحرجة. يوصى بتكثيف المتابعة والتدخل الوقائي قبل تدهور الوضع.
              </p>
            </div>
          )}
          {riskScore.level === 'safe' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-700">
                <TrendingUp className="w-5 h-5 shrink-0" />
                <p className="text-xs font-bold">وضع مستقر وآمن</p>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                جميع المؤشرات ضمن العتبات الآمنة. يستمر العمل بالنظام الحالي مع مراقبة دورية للانحرافات الطفيفة.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
