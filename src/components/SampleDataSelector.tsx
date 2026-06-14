/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PRESETS } from '../utils/analysis';
import { DashboardInputs } from '../types';
import { GraduationCap, AlertTriangle, TrendingUp, HelpCircle } from 'lucide-react';

interface SampleDataSelectorProps {
  onSelect: (inputs: DashboardInputs) => void;
  selectedId: string | null;
}

export default function SampleDataSelector({ onSelect, selectedId }: SampleDataSelectorProps) {
  return (
    <div id="sample-data-selector" className="card-polish p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">تطبيق وضعيات ونماذج بيداغوجية قياسية</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            اختر أحد السيناريوهات الواقعية المألوفة في الوسط المدرسي الجزائري لمعاينة تفاعلية اللوحة ولتسهيل التحليل والمقارنة.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {PRESETS.map((preset) => {
          const isSelected = selectedId === preset.id;
          
          let colorTheme = 'border-slate-250 bg-slate-50';
          let icon = <HelpCircle className="w-4 h-4" />;
          
          if (preset.id === 'excellent') {
            colorTheme = isSelected 
              ? 'border-emerald-500 bg-emerald-50' 
              : 'hover:border-emerald-200 hover:bg-emerald-50/20';
            icon = <GraduationCap className="w-4 h-4 text-emerald-600" />;
          } else if (preset.id === 'polarized') {
            colorTheme = isSelected 
              ? 'border-amber-500 bg-amber-50' 
              : 'hover:border-amber-200 hover:bg-amber-50/20';
            icon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
          } else if (preset.id === 'homogeneous-low') {
            colorTheme = isSelected 
              ? 'border-rose-500 bg-rose-50' 
              : 'hover:border-rose-200 hover:bg-rose-50/20';
            icon = <AlertTriangle className="w-4 h-4 text-rose-600" />;
          } else if (preset.id === 'critical') {
            colorTheme = isSelected 
              ? 'border-red-600 bg-red-50' 
              : 'hover:border-red-200 hover:bg-red-50/20';
            icon = <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />;
          } else if (preset.id === 'average-standard') {
            colorTheme = isSelected 
              ? 'border-blue-500 bg-blue-50' 
              : 'hover:border-blue-200 hover:bg-blue-50/20';
            icon = <TrendingUp className="w-4 h-4 text-blue-600" />;
          }

          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset.inputs)}
              type="button"
              className={`flex flex-col text-right p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'ring-2 ring-offset-2 ring-indigo-500 shadow-xs' 
                  : 'border-slate-100 bg-white'
              } ${colorTheme}`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-white shadow-xs' : 'bg-slate-50'
                }`}>
                  {preset.id === 'excellent' && 'نموذج ريادي'}
                  {preset.id === 'polarized' && 'فجوة نخب'}
                  {preset.id === 'homogeneous-low' && 'عجز عام'}
                  {preset.id === 'critical' && 'طوارئ حمراء'}
                  {preset.id === 'average-standard' && 'اعتدال طردي'}
                </span>
                {icon}
              </div>
              <h3 className="font-semibold text-xs text-slate-800 line-clamp-1">
                {preset.title}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 md:block">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
