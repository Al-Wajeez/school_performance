import React from 'react';
import { ComprehensiveReport } from '../types';
import { FileText, BookOpen, Users, Lightbulb, ClipboardList, BarChart3, Trophy, Info, GraduationCap, School, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  report: ComprehensiveReport;
}

export default function ComprehensiveReportView({ report }: Props) {
  const { section1, section2, section3, section4, section5, section6 } = report;

  const sections = [
    {
      ...section1,
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      iconBg: 'bg-indigo-100 text-indigo-700',
      accent: 'border-indigo-500',
    },
    {
      ...section2,
      icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-700',
      accent: 'border-emerald-500',
    },
    {
      ...section3,
      icon: <Users className="w-5 h-5" />,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-700',
      accent: 'border-amber-500',
    },
  ];

  return (
    <div id="comprehensive-report" className="space-y-6 mt-8" dir="rtl">

      {/* Section title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2.5 mb-5 border-b border-slate-100 pb-3"
      >
        <div className="w-1.5 h-6 bg-violet-600 rounded-full" />
        <h2 className="text-lg font-extrabold text-slate-800">
          التقرير التشخيصي البيداغوجي الشامل
        </h2>
      </motion.div>

      {/* Sections 1-3 */}
      {sections.map((sec, idx) => {
        const isSection3 = idx === 2;
        const isSection2 = idx === 1;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-5 rounded-2xl border border-slate-100 bg-white relative overflow-hidden`}
          >
            <div className={`absolute top-0 right-0 bottom-0 w-1.5 ${sec.accent}`} />

            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-xl ${sec.iconBg}`}>
                {sec.icon}
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  القسم {idx === 0 ? 'الأول' : idx === 1 ? 'الثاني' : 'الثالث'}
                </span>
                <h3 className="text-sm font-extrabold text-slate-800 mt-0.5">
                  {sec.title}
                </h3>
              </div>
            </div>

            {/* Main content block */}
            {idx === 0 ? (
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100/50 leading-relaxed text-sm text-slate-700">
                {sec.content}
              </div>
            ) : (
              <div className="space-y-4">
                {isSection2 && (
                  <>
                    <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100/50 leading-relaxed text-sm text-slate-700">
                      {sec.content}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg border border-violet-100 bg-violet-50/40">
                        <h4 className="text-xs font-bold text-violet-700 mb-2 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> تحليل الانحراف المعياري والفروق الفردية
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{section2.sdTeachingAnalysis}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-emerald-100 bg-emerald-50/40">
                        <h4 className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5" /> الاستقطاب أم التوازن الجماعي
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{section2.eliteVsBalanced}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-amber-100 bg-amber-50/40">
                        <h4 className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" /> تحليل الفجوة بين الأقصى والأدنى
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{section2.maxMinGapAnalysis}</p>
                      </div>
                    </div>
                  </>
                )}
                {isSection3 && (
                  <>
                    <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100/50 leading-relaxed text-sm text-slate-700">
                      {sec.content}
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-3 rounded-lg border border-blue-100 bg-blue-50/40">
                        <h4 className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" /> ملف الأستاذ وطرائق التدريس
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{section3.teacherProfile}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-teal-100 bg-teal-50/40">
                        <h4 className="text-xs font-bold text-teal-700 mb-2 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> الديناميكية النفسية والاجتماعية للتلاميذ
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{section3.studentDynamics}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-purple-100 bg-purple-50/40">
                        <h4 className="text-xs font-bold text-purple-700 mb-2 flex items-center gap-1.5">
                          <ClipboardList className="w-3.5 h-3.5" /> العلاقة بين الإدارة والأولياء والدعم التربوي
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{section3.adminParentRelation}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Section 4: Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-5 rounded-2xl border border-slate-100 bg-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 bottom-0 w-1.5 border-r-6 border-rose-500" />

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              القسم الرابع
            </span>
            <h3 className="text-sm font-extrabold text-slate-800 mt-0.5">
              {section4.title}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Administrative */}
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-indigo-800">الإجراءات الإدارية والتنظيمية</h4>
            </div>
            <ul className="space-y-2">
              {section4.administrative.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                  <span className="mt-0.5 min-w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[9px] font-bold shrink-0">{i + 1}</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Pedagogical */}
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-emerald-800">المعالجة البيداغوجية والتدريس التمايزي</h4>
            </div>
            <ul className="space-y-2">
              {section4.pedagogical.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                  <span className="mt-0.5 min-w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[9px] font-bold shrink-0">{i + 1}</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Psychological */}
          <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/40">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-amber-800">الإرشاد والتوجيه المدرسي لدعم الفئات الهشة</h4>
            </div>
            <ul className="space-y-2">
              {section4.psychological.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                  <span className="mt-0.5 min-w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[9px] font-bold shrink-0">{i + 1}</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Section 5: Teacher Accountability */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-5 rounded-2xl border border-slate-100 bg-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 bottom-0 w-1.5 border-r-6 border-orange-500" />
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-orange-100 text-orange-700">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              القسم الخامس
            </span>
            <h3 className="text-sm font-extrabold text-slate-800 mt-0.5">
              {section5.title}
            </h3>
          </div>
        </div>
        <div className="bg-orange-50/40 p-4 rounded-xl border border-orange-100 leading-relaxed text-sm text-slate-700">
          {section5.content}
        </div>
      </motion.div>

      {/* Section 6: Principal Accountability */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="p-5 rounded-2xl border border-slate-100 bg-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 bottom-0 w-1.5 border-r-6 border-sky-500" />
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
            <School className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              القسم السادس
            </span>
            <h3 className="text-sm font-extrabold text-slate-800 mt-0.5">
              {section6.title}
            </h3>
          </div>
        </div>
        <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100 leading-relaxed text-sm text-slate-700">
          {section6.content}
        </div>
      </motion.div>
    </div>
  );
}
