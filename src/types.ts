/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DashboardInputs {
  mean: number; // 0 to 20
  standardDeviation: number; // 0 to 10
  maxGrade: number; // 0 to 20
  minGrade: number; // 0 to 20
  totalStudents: number; // Integer > 0
  passingStudents: number; // Students with grade >= 10
}

export interface StatisticalOutput {
  range: number;
  variance: number;
  successRate: number;
  homogeneityStatus: string;
  homogeneityLevel: 'high' | 'medium' | 'low';
  homogeneityBadgeColor: string;
}

export interface PedagogicalDiagnostic {
  title: string;
  category: 'excellent' | 'polarized' | 'homogeneous-low' | 'critical' | 'excellent-dispersion' | 'average-homogeneous' | 'average-normal' | 'low-normal';
  description: string;
  severity: 'success' | 'warning' | 'info' | 'danger';
  recommendations: string[];
}

export interface PresetScenario {
  id: string;
  title: string;
  subTitle: string;
  inputs: DashboardInputs;
  description: string;
}

export interface ReportSection {
  title: string;
  content: string;
}

export interface RiskThresholds {
  meanWarning: number;
  meanDanger: number;
  sdWarning: number;
  sdDanger: number;
  successRateWarning: number;
  successRateDanger: number;
  rangeWarning: number;
  rangeDanger: number;
}

export const DEFAULT_RISK_THRESHOLDS: RiskThresholds = {
  meanWarning: 10,
  meanDanger: 8,
  sdWarning: 3,
  sdDanger: 4,
  successRateWarning: 60,
  successRateDanger: 40,
  rangeWarning: 10,
  rangeDanger: 14,
};

export interface RiskScore {
  total: number;
  level: 'safe' | 'moderate' | 'danger';
  breakdown: {
    meanScore: number;
    sdScore: number;
    successRateScore: number;
    rangeScore: number;
  };
}

export interface InterventionQueueItem {
  label: string;
  riskScore: number;
  inputs: DashboardInputs;
  stats: StatisticalOutput;
}

export interface ComprehensiveReport {
  section1: ReportSection & {
    range: number;
    variance: number;
    successRate: number;
    homogeneityDescription: string;
    homogeneityLevelText: string;
  };
  section2: ReportSection & {
    sdTeachingAnalysis: string;
    eliteVsBalanced: string;
    maxMinGapAnalysis: string;
  };
  section3: ReportSection & {
    teacherProfile: string;
    studentDynamics: string;
    adminParentRelation: string;
  };
  section4: {
    title: string;
    administrative: string[];
    pedagogical: string[];
    psychological: string[];
  };
  section5: ReportSection;
  section6: ReportSection;
}
