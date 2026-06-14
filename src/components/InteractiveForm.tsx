/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DashboardInputs } from '../types';
import { SlidersIcon, HelpCircle, AlertCircle, RefreshCw, Layers } from 'lucide-react';

interface InteractiveFormProps {
  value: DashboardInputs;
  onChange: (inputs: DashboardInputs) => void;
  selectedPresetId: string | null;
  onResetPresetId: () => void;
}

export default function InteractiveForm({ value, onChange, selectedPresetId, onResetPresetId }: InteractiveFormProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [warnings, setWarnings] = useState<string[]>([]);

  // Monitor outputs to build validations and warnings in real-time
  useEffect(() => {
    const listErrors: { [key: string]: string } = {};
    const listWarnings: string[] = [];

    // Validations (Errors)
    if (value.maxGrade < value.minGrade) {
      listErrors.gradeBounds = 'خطأ رياضي: لا يمكن لأعلى معدل أن يكون أقل من أدنى معدل في الصف.';
    }

    if (value.passingStudents > value.totalStudents) {
      listErrors.studentBounds = 'خطأ بيداغوجي: لا يمكن لعدد التلاميذ الناجحين أن يتجاوز العدد الإجمالي للقسم.';
    }

    if (value.mean > value.maxGrade) {
      listErrors.meanMax = 'خطأ إحصائي: المتوسط الحسابي لا يمكن منطقياً أن يكون أكبر من أعلى علامة محققة.';
    }

    if (value.mean < value.minGrade) {
      listErrors.meanMin = 'خطأ إحصائي: المتوسط الحسابي لا يمكن منطقياً أن يكون أقل من أدنى علامة محققة.';
    }

    // Warnings (Advisory prompts for educational psychologists)
    if (value.mean >= 10 && value.passingStudents < (value.totalStudents * 0.4)) {
      listWarnings.push('تنبيه: المتوسط العام إيجابي ولكن نسبة النجاح الفعلية متدنية جداً (أقل من %40). يؤكد هذا وجود استقطاب نخبة غير معتدل.');
    }

    if (value.mean < 10 && value.passingStudents > (value.totalStudents * 0.6)) {
      listWarnings.push('تنبيه: المتوسط العام للقسم راسب ولكن نسبة النجاح عالية (%60+). قد يشير هذا لتجمع تلاميذ متميزين مع معدلات شديدة التدني للبقية.');
    }

    if (value.standardDeviation > (value.maxGrade - value.minGrade) / 2) {
      listWarnings.push('ملاحظة رياضية: الانحراف المعياري كبير جداً مقارنة بالمدى الفعلي، مما يؤشر على عدم منطقية توزيع عينة البيانات المدخلة.');
    }

    setErrors(listErrors);
    setWarnings(listWarnings);
  }, [value]);

  const handleFieldChange = (field: keyof DashboardInputs, numValue: number) => {
    // If the user manual edits, we break selection highlight of preset
    if (selectedPresetId) {
      onResetPresetId();
    }

    // Safely structure inputs
    const updated = {
      ...value,
      [field]: numValue
    };

    onChange(updated);
  };

  return (
    <div id="interactive-inputs-form" className="card-polish p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <SlidersIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">بيانات الأداء والنتائج المدرسية</h3>
              <p className="text-xs text-slate-400 mt-0.5">أدخل معايير التحصيل الإحصائي للقسم الدراسي.</p>
            </div>
          </div>
          {selectedPresetId && (
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-sans font-medium">
              النموذج مفعّل
            </span>
          )}
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* 1. Mean (المتوسط الحسابي) */}
          <div className="space-y-1.5 text-right">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-700">المتوسط الحسابي</label>
                <div className="relative group inline-block">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-help" />
                  <div className="absolute z-50 hidden group-hover:block bg-slate-900 text-slate-100 text-xs font-medium leading-relaxed rounded-xl p-3 shadow-xl -top-3 right-0 -translate-y-full w-64 border border-slate-750 transition-all duration-200">
                    <p className="font-bold text-indigo-400 mb-1">المتوسط الحسابي (μ)</p>
                    <p className="mb-1.5"><strong className="text-white">طريقة حسابه:</strong> مجموع معدلات التلاميذ مقسوماً على عددهم.</p>
                    <p><strong className="text-white">التأثير البيداغوجي:</strong> يحدد النواة المركزية للقسم. المعدل دون 10 يشخص عجزاً جماعياً أو صعوبة اختبار حادة، بينما المعدل الإيجابي قد يكون "مضللاً" في حال ترافقه مع تشتت حاد.</p>
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-sm">
                {value.mean.toFixed(2)}
              </span>
            </div>
            <input
              type="number"
              min="0"
              max="20"
              step="0.01"
              value={value.mean}
              onChange={(e) => handleFieldChange('mean', Math.max(0, Math.min(20, parseFloat(e.target.value) || 0)))}
              className="w-full text-right bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2 text-sm font-semibold font-mono"
            />
            <input
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={value.mean}
              onChange={(e) => handleFieldChange('mean', parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* 2. Standard Deviation (الانحراف المعياري) */}
          <div className="space-y-1.5 text-right">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-700">الانحراف المعياري</label>
                <div className="relative group inline-block">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-help" />
                  <div className="absolute z-50 hidden group-hover:block bg-slate-900 text-slate-100 text-xs font-medium leading-relaxed rounded-xl p-3 shadow-xl -top-3 right-0 -translate-y-full w-64 border border-slate-750 transition-all duration-200">
                    <p className="font-bold text-indigo-400 mb-1">الانحراف المعياري (σ)</p>
                    <p className="mb-1.5"><strong className="text-white">معناه:</strong> مقياس لمدى تباعد علامات التلاميذ عن المتوسط العام.</p>
                    <p><strong className="text-white">التأثير البيداغوجي:</strong> المؤشر الأساسي لتجانس القسم؛ الأقل من 2 يعبر عن انسجام كامل ويسمح بنسق تدريس جماعي، أما الأكثر من 3.5 فيعني تشتتاً حاداً وصعوبة بالغة في القيادة العادية وتفرداً مطلقاً للمستويات.</p>
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-sm">
                {value.standardDeviation.toFixed(2)}
              </span>
            </div>
            <input
              type="number"
              min="0"
              max="10"
              step="0.01"
              value={value.standardDeviation}
              onChange={(e) => handleFieldChange('standardDeviation', Math.max(0, Math.min(10, parseFloat(e.target.value) || 0)))}
              className="w-full text-right bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2 text-sm font-semibold font-mono"
            />
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.05"
              value={value.standardDeviation}
              onChange={(e) => handleFieldChange('standardDeviation', parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* 3. Max Grade (أعلى معدل) */}
          <div className="space-y-1.5 text-right">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-700">أعلى علامة</label>
                <div className="relative group inline-block">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-help" />
                  <div className="absolute z-50 hidden group-hover:block bg-slate-900 text-slate-100 text-xs font-medium leading-relaxed rounded-xl p-3 shadow-xl -top-3 right-0 -translate-y-full w-64 border border-slate-750 transition-all duration-200">
                    <p className="font-bold text-indigo-400 mb-1">أعلى معدل محقق</p>
                    <p className="mb-1.5"><strong className="text-white">معناه:</strong> النقطة القصوى المحققة من التلميذ المتفوق بالقسم.</p>
                    <p><strong className="text-white">التأثير البيداغوجي:</strong> تشير لتحديد سقف التحصيل الدراسي، وتكشف الفوارق مع المعدل الأدنى لحساب مدى تشتت القطب المتفوق وتمايز النخبة الرائدة.</p>
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-sm">
                {value.maxGrade.toFixed(2)}
              </span>
            </div>
            <input
              type="number"
              min="0"
              max="20"
              step="0.1"
              value={value.maxGrade}
              onChange={(e) => handleFieldChange('maxGrade', Math.max(0, Math.min(20, parseFloat(e.target.value) || 0)))}
              className="w-full text-right bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2 text-sm font-semibold font-mono"
            />
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={value.maxGrade}
              onChange={(e) => handleFieldChange('maxGrade', parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* 4. Min Grade (أدنى معدل) */}
          <div className="space-y-1.5 text-right">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-700">أدنى علامة</label>
                <div className="relative group inline-block">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-help" />
                  <div className="absolute z-50 hidden group-hover:block bg-slate-900 text-slate-100 text-xs font-medium leading-relaxed rounded-xl p-3 shadow-xl -top-3 right-0 -translate-y-full w-64 border border-slate-750 transition-all duration-200">
                    <p className="font-bold text-indigo-400 mb-1">أدنى علامة مسجلة</p>
                    <p className="mb-1.5"><strong className="text-white">معناها:</strong> نقطة ضعف التحصيل أو عتبة المخرجات الدنيوية للصف.</p>
                    <p><strong className="text-white">التأثير البيداغوجي:</strong> ترصد الفئة المتأخرة المستهدفة حتماً ببرنامج المعالجة التربوية الفردية الاستدراكية (Soutien Ciblé)؛ وانخفاضها عن 5 ينذر بوجود فوارق ذهنية أو فقر معرفي مسبق.</p>
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-sm">
                {value.minGrade.toFixed(2)}
              </span>
            </div>
            <input
              type="number"
              min="0"
              max="20"
              step="0.1"
              value={value.minGrade}
              onChange={(e) => handleFieldChange('minGrade', Math.max(0, Math.min(20, parseFloat(e.target.value) || 0)))}
              className="w-full text-right bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2 text-sm font-semibold font-mono"
            />
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={value.minGrade}
              onChange={(e) => handleFieldChange('minGrade', parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* 5. Total Students (عدد التلاميذ الإجمالي) */}
          <div className="space-y-1.5 text-right">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-700">العدد الإجمالي للتلاميذ</label>
                <div className="relative group inline-block">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-help" />
                  <div className="absolute z-50 hidden group-hover:block bg-slate-900 text-slate-100 text-xs font-medium leading-relaxed rounded-xl p-3 shadow-xl -top-3 right-0 -translate-y-full w-64 border border-slate-750 transition-all duration-200">
                    <p className="font-bold text-indigo-400 mb-1">العدد الكلي للقسم (N)</p>
                    <p className="mb-1.5"><strong className="text-white">دوره:</strong> الحجم الكامل للمجموعة الصفية للمستشار البيداغوجي.</p>
                    <p><strong className="text-white">التأثير البيداغوجي:</strong> يشكل القاعدة الرياضية الأساسية للمقارنة والنسب المئوية؛ ويدير كفاءة توزيع المهام، ومقدار الرعاية المعطاة للتلميذ الواحد في الحصة الدراسية.</p>
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-sm">
                {value.totalStudents} تلميذ
              </span>
            </div>
            <input
              type="number"
              min="1"
              max="100"
              value={value.totalStudents}
              onChange={(e) => handleFieldChange('totalStudents', Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full text-right bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2 text-sm font-semibold font-mono"
            />
            <input
              type="range"
              min="10"
              max="60"
              step="1"
              value={value.totalStudents}
              onChange={(e) => handleFieldChange('totalStudents', parseInt(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* 6. Students with Grade >= 10 (عدد الناجحين) */}
          <div className="space-y-1.5 text-right">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-700">عدد التلاميذ الناجحين</label>
                <div className="relative group inline-block">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-help" />
                  <div className="absolute z-50 hidden group-hover:block bg-slate-900 text-slate-100 text-xs font-medium leading-relaxed rounded-xl p-3 shadow-xl -top-3 right-0 -translate-y-full w-64 border border-slate-750 transition-all duration-200">
                    <p className="font-bold text-indigo-400 mb-1">الناجحون والمكتسبون للكفاءة</p>
                    <p className="mb-1.5"><strong className="text-white">معناه:</strong> التلاميذ الحاصلون علامة 10 فما فوق في التقويم الختامي.</p>
                    <p><strong className="text-white">التأثير البيداغوجي:</strong> مقياس نسبة النجاح الرسمية في المدارس الجزائرية. تقاطع النسبة مع المتوسط هو ما يشخص حالات التقاطب المضللة أو الضعف المتجانس.</p>
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-sm">
                {value.passingStudents} تلميذ
              </span>
            </div>
            <input
              type="number"
              min="0"
              max={value.totalStudents}
              value={value.passingStudents}
              onChange={(e) => handleFieldChange('passingStudents', Math.max(0, Math.min(value.totalStudents, parseInt(e.target.value) || 0)))}
              className="w-full text-right bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2 text-sm font-semibold font-mono"
            />
            <input
              type="range"
              min="0"
              max={value.totalStudents}
              step="1"
              value={value.passingStudents}
              onChange={(e) => handleFieldChange('passingStudents', parseInt(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

        </div>
      </div>

      {/* Real-time Validations and Advisory Box */}
      <div className="mt-5 space-y-2 pt-4 border-t border-slate-100">

        {/* Errors Block */}
        {Object.values(errors).length > 0 && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 flex items-start gap-2.5 text-xs text-right animate-pulse">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">يرجى مراجعة تناسق المدخلات:</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                {Object.values(errors).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Warnings / Educational advice Block */}
        {Object.values(errors).length === 0 && warnings.length > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 flex items-start gap-2.5 text-xs text-right">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">المعايرة غير المتسقة بيداغوجياً:</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                {warnings.map((warn, idx) => (
                  <li key={idx}>{warn}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Clean status */}
        {Object.values(errors).length === 0 && warnings.length === 0 && (
          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-700 flex items-center gap-2.5 text-xs text-right">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <p className="font-medium">المعطيات الإحصائية متجانسة وخالية من التناقضات البنيوية.</p>
          </div>
        )}

      </div>
    </div>
  );
}
