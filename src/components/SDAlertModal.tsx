/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertOctagon, X, Check, Users, ShieldAlert, Award, FileText } from 'lucide-react';

interface SDAlertModalProps {
  standardDeviation: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function SDAlertModal({ standardDeviation, isOpen, onClose }: SDAlertModalProps) {
  // Simple state to let the user prevent the modal from constantly popping up during slide adjustments
  const [remindMe, setRemindMe] = useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Modal Content container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative bg-white w-full max-w-4xl rounded-2xl border border-rose-150 shadow-2xl z-10 overflow-hidden text-right"
          dir="rtl"
        >
          {/* Top colored aesthetic status strip */}
          <div className="bg-rose-600 h-2 w-full" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all cursor-pointer"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6">

            {/* Modal Heading & Icon */}
            <div className="flex items-start gap-4 mb-5 border-b border-slate-50 pb-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0 animate-bounce">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs bg-rose-100 text-rose-800 font-extrabold px-2.5 py-2 rounded-md uppercase leading-none inline-block">
                  إنذار بيداغوجي مبكر: تشتت حرج (σ = {standardDeviation.toFixed(2)})
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1.5">
                  تنبيه التباين القياسي الحاد والفروق الفردية المفرطة
                </h3>
              </div>
            </div>

            {/* Core Psychopedagogical assessment */}
            <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4.5 mb-5 space-y-2.5">
              <h4 className="font-bold text-rose-900 text-sm flex items-center gap-1.5 justify-start">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                تحليل المستشار النفسي البيداغوجي:
              </h4>
              <p className="text-xs text-rose-800 leading-relaxed font-medium">
                تجاوز هذا الانحراف المعياري لعتبة <strong className="text-rose-900">3.50</strong> يؤكد بأن القسم قد دخل رسمياً مرحلة "الاستقطاب الحرج". هناك فجوة سحيقة تفصل النخبة المتفوقة عن الفئة المتعثرة المعزولة بالخلف. إن تجاهل هذا التباين يؤدي حتماً إلى ارتفاع الهدر المعرفي أو التسرب المدرسي الخفي.
              </p>
            </div>

            {/* Corrective measures recommendations checklist */}
            <div className="mb-6 space-y-3.5">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 justify-start mb-2.5">
                <FileText className="w-4 h-4 text-indigo-500" />
                الإجراءات التصحيحية الفورية المطلوبة من الأستاذ ومجلس القسم:
              </h4>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    title: 'تطبيق بيداغوجيا التدريس التمايزي (Différenciation)',
                    desc: 'تعديل وتوزيع أنشطة التقويم إلى مستويات كفاءة تناسب الفئتين المتباعدتين لمنع إحباط المتعثرين أو تراجع دافعية النخبة.'
                  },
                  {
                    title: 'إطلاق فوري لـ "خطة معالجة تربوية" مستهدفة',
                    desc: 'تخصيص حصص للمفاهيم والمخرجات الأساسية (تعلم القواعد المفتاحية) دون تحميل المتعثر ذهنياً بالمعارف الثانوية.'
                  },
                  {
                    title: 'تفعيل التعلم بالقرين ومجموعات الدعم المرنة',
                    desc: 'مرافقة النخبة لزملائهم بطرق ودية مرنة تُشرف عليها خلية التوجيه بالمؤسسة لتقليص الانحراف تدريجياً.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-right bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{item.title}</h5>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Panel Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-500 select-none">
                <input
                  type="checkbox"
                  checked={!remindMe}
                  onChange={(e) => setRemindMe(!e.target.checked)}
                  className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-650 cursor-pointer"
                />
                <span>تجاوز تنبيه نافذة التشتت مؤقتاً خلال جلسة الضبط الفنية الحالية</span>
              </label>

              <button
                onClick={() => {
                  if (!remindMe) {
                    // Tell App to save memory or simply close
                    onClose();
                  } else {
                    onClose();
                  }
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all duration-200 shadow-sm cursor-pointer"
              >
                استيعاب التوصيات والمتابعة
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
