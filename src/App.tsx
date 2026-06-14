/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { DashboardInputs, ComprehensiveReport, DEFAULT_RISK_THRESHOLDS, RiskThresholds } from './types';
import { calculateStatistics, getPedagogicalDiagnostic, generateComprehensiveReport, calculateRiskScore, PRESETS } from './utils/analysis';
import { exportToWord } from './utils/exportToWord';
import SampleDataSelector from './components/SampleDataSelector';
import GradeDistributionChart from './components/GradeDistributionChart';
import StatCard from './components/StatCard';
import PedagogicalAnalysis from './components/PedagogicalAnalysis';
import InteractiveForm from './components/InteractiveForm';
import SDAlertModal from './components/SDAlertModal';
import ComprehensiveReportView from './components/ComprehensiveReportView';
import EarlyWarningPanel from './components/EarlyWarningPanel';
import { GraduationCap, BookOpen, FileSpreadsheet, FileText, AlertTriangle } from 'lucide-react';

export default function App() {
  // Initialize with the standard normal distribution preset by default
  const defaultPreset = PRESETS.find(p => p.id === 'average-standard') || PRESETS[0];

  const [inputs, setInputs] = useState<DashboardInputs>(defaultPreset.inputs);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(defaultPreset.id);

  // States for the standard deviation alert trigger system
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [hasShownAlertForCurrentOverload, setHasShownAlertForCurrentOverload] = useState(false);

  // Computed stats on-the-fly
  const stats = useMemo(() => {
    return calculateStatistics(inputs);
  }, [inputs]);

  // Compute diagnostics
  const diagnostic = useMemo(() => {
    return getPedagogicalDiagnostic(inputs, stats.successRate);
  }, [inputs, stats.successRate]);

  // Generate comprehensive report
  const report = useMemo(() => {
    return generateComprehensiveReport(inputs);
  }, [inputs]);

  // Early warning system state
  const [riskThresholds, setRiskThresholds] = useState<RiskThresholds>(DEFAULT_RISK_THRESHOLDS);
  const riskScore = useMemo(() => {
    return calculateRiskScore(inputs, stats.successRate, riskThresholds);
  }, [inputs, stats.successRate, riskThresholds]);

  // Word export handler
  const [isExporting, setIsExporting] = useState(false);
  const handleWordExport = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await exportToWord(inputs, stats, report, 'متوسطة/ثانوية');
    } catch (e) {
      console.error('Word export failed:', e);
    } finally {
      setIsExporting(false);
    }
  }, [inputs, stats, report, isExporting]);

  // Reactive trigger side-effect monitoring the standard deviation threshold
  useEffect(() => {
    if (inputs.standardDeviation >= 3.5) {
      if (!hasShownAlertForCurrentOverload) {
        setIsAlertOpen(true);
        setHasShownAlertForCurrentOverload(true);
      }
    } else {
      // Reset so if they slide back into critical, the psychologist gets warned again
      setHasShownAlertForCurrentOverload(false);
    }
  }, [inputs.standardDeviation, hasShownAlertForCurrentOverload]);

  // Handler for custom preset switch
  const handleSelectPreset = (newInputs: DashboardInputs) => {
    setInputs(newInputs);
    // Find matching preset ID
    const found = PRESETS.find(p =>
      p.inputs.mean === newInputs.mean &&
      p.inputs.standardDeviation === newInputs.standardDeviation &&
      p.inputs.maxGrade === newInputs.maxGrade &&
      p.inputs.minGrade === newInputs.minGrade
    );
    setSelectedPresetId(found ? found.id : null);
  };

  const handleResetPresetId = () => {
    setSelectedPresetId(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-12 font-sans selection:bg-indigo-500 selection:text-white" dir="rtl">

      {/* Prime Header & Branding banner */}
      <header id="dashboard-header" className="bg-white border-b border-slate-100 shadow-xs sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* Branding title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                <img src="/favicon.ico" alt="الوجيز" className="w-full h-full" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-2 rounded-full font-bold">
                    لوحة المستشار البيداغوجي
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-2 rounded-full font-bold">
                    مرحلة التعليم المتوسط والثانوي
                  </span>
                </div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                  نظام التحليل الإحصائي للأداء والتحصيل المدرسي
                </h1>
              </div>
            </div>

            {/* National academic reference information */}
            <div className="flex items-center gap-4 justify-end">
              <div className="text-right border-r-2 border-slate-100 pr-4 hidden sm:block">
                <p className="text-xs text-slate-400 font-medium">إعداد</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">الأستاذ حدادي عبد الرؤوف</p>
              </div>
              <button
                type="button"
                onClick={handleWordExport}
                disabled={isExporting}
                className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs"
              >
                <FileText className="w-4 h-4" />
                <span>{isExporting ? 'جاري التصدير...' : 'Word تصدير'}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>PDF</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

        {/* Presets Selection Section */}
        <SampleDataSelector
          onSelect={handleSelectPreset}
          selectedId={selectedPresetId}
        />

        {/* Responsive Grid layout for inputs vs graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

          {/* Main Chart Output Panel (Visual emphasis, takes 7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <GradeDistributionChart
              mean={inputs.mean}
              standardDeviation={inputs.standardDeviation}
            />
          </div>

          {/* Interactive Form Controls (Data entry panel, takes 5 cols on desktop) */}
          <div className="lg:col-span-5">
            <InteractiveForm
              value={inputs}
              onChange={setInputs}
              selectedPresetId={selectedPresetId}
              onResetPresetId={handleResetPresetId}
            />
          </div>

        </div>

        {/* Section Heading for derived analytics */}
        <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 pb-3">
          <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
          <h2 className="text-lg font-extrabold text-slate-800">
            مؤشرات الفوارق الفردية والتشخيص البيداغوجي للتحصيل
          </h2>
        </div>

        {/* 4 Multi-metric Cards Section */}
        <StatCard metrics={stats} inputs={inputs} />

        {/* Early Warning System */}
        <EarlyWarningPanel
          riskScore={riskScore}
          thresholds={riskThresholds}
          onThresholdsChange={setRiskThresholds}
        />

        {/* Advanced Pedagogical Diagnostics and Actionable Advice Box */}
        <PedagogicalAnalysis diagnostic={diagnostic} />

        {/* Comprehensive Pedagogical Diagnostic Report */}
        <ComprehensiveReportView report={report} />

      </main>

      {/* SD Alert Alert Modal popup (alerts educators on extreme high polarization scenarios) */}
      <SDAlertModal
        standardDeviation={inputs.standardDeviation}
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
      />

      {/* Footer information bar */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-200/60 text-center text-xs text-slate-400">
        <p className="leading-relaxed">
          <strong>اللوحة البيداغوجية لتحليل الأداء المدرسي</strong> • مصممة لمرافقة مستشاري التوجيه المدرسي والأساتذة لتفكيك فجوات التعلق المدرسي وسلوك الامتحانات.
        </p>
        <p className="mt-1">
          حقوق البرمجة والاستخدام محفوظة لمنصة الوجيز © 2026. يدعم البناء السليم للقرارات التربوية التمايزية.
        </p>
      </footer>

    </div>
  );
}
