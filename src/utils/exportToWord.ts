import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, Header, ShadingType,
} from 'docx';
import { DashboardInputs, StatisticalOutput, ComprehensiveReport } from '../types';

const C = {
  primary: '1E3A5F',
  accent: 'C0392B',
  headerBg: '1E3A5F',
  body: '333333',
  white: 'FFFFFF',
};

function p(text: string, opts?: {
  bold?: boolean; size?: number; color?: string; align?: typeof AlignmentType[keyof typeof AlignmentType];
  before?: number; after?: number; line?: number;
}): Paragraph {
  return new Paragraph({
    children: [new TextRun({
      text,
      bold: opts?.bold ?? false,
      size: opts?.size ?? 22,
      font: 'Cairo',
      color: opts?.color ?? C.body,
    })],
    alignment: opts?.align,
    spacing: { before: opts?.before, after: opts?.after, line: opts?.line },
  });
}

function heading(text: string, size = 28): Paragraph {
  return p(text, { bold: true, size, color: C.primary, align: AlignmentType.RIGHT, before: 300, after: 200 });
}

function subLabel(label: string, text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: label, bold: true, size: 22, font: 'Cairo', color: C.primary }),
      new TextRun({ text, size: 22, font: 'Cairo', color: C.body }),
    ],
    spacing: { after: 120, line: 400 },
    alignment: AlignmentType.RIGHT,
    indent: { firstLine: 720 },
  });
}

function bulletList(title: string, items: string[]): Paragraph[] {
  const out: Paragraph[] = [
    p(title, { bold: true, size: 24, color: C.primary, before: 200, after: 100 }),
  ];
  items.forEach((item) => {
    out.push(new Paragraph({
      children: [
        new TextRun({ text: '•  ', size: 22, font: 'Cairo', color: C.accent }),
        new TextRun({ text: item, size: 22, font: 'Cairo', color: C.body }),
      ],
      spacing: { after: 60, line: 360 },
      alignment: AlignmentType.RIGHT,
      indent: { right: 360 },
    }));
  });
  return out;
}

export async function exportToWord(
  inputs: DashboardInputs,
  stats: StatisticalOutput,
  report: ComprehensiveReport,
  institutionName = 'متوسطة/ثانوية',
): Promise<void> {
  const headerChildren = [
    p('الجمهورية الجزائرية الديمقراطية الشعبية', { bold: true, size: 20, color: C.primary, align: AlignmentType.CENTER, after: 40 }),
    p('وزارة التربية الوطنية', { bold: true, size: 22, color: C.primary, align: AlignmentType.CENTER, after: 40 }),
    p(institutionName, { size: 20, color: C.body, align: AlignmentType.CENTER, after: 200 }),
  ];

  const tableData: [string, string, string][] = [
    ['المؤشر', 'القيمة', 'التفسير'],
    ['المتوسط الحسابي', inputs.mean.toFixed(2) + ' / 20', 'مستوى التحصيل العام للقسم'],
    ['الانحراف المعياري', inputs.standardDeviation.toFixed(2), 'مقدار تشتت العلامات حول المتوسط'],
    ['المدى الإحصائي', stats.range.toFixed(2), 'الفارق بين أعلى وأدنى معدل'],
    ['التباين', stats.variance.toFixed(2), 'مربع الانحراف المعياري'],
    ['نسبة النجاح', stats.successRate.toFixed(1) + '%', inputs.passingStudents + ' ناجح من ' + inputs.totalStudents + ' تلميذ'],
    ['درجة التجانس', stats.homogeneityStatus, 'حسب قيمة الانحراف المعياري'],
  ];

  const tableRows = tableData.map((row, idx) => {
    const isHead = idx === 0;
    return new TableRow({
      tableHeader: isHead,
      children: row.map((cellText) => new TableCell({
        children: [new Paragraph({
          children: [new TextRun({
            text: cellText,
            bold: isHead,
            size: 20,
            font: 'Cairo',
            color: isHead ? C.white : C.body,
          })],
          alignment: AlignmentType.CENTER,
        })],
        shading: isHead ? { type: ShadingType.SOLID as any, color: C.headerBg, fill: C.headerBg } : undefined,
        width: { size: 33, type: WidthType.PERCENTAGE },
      })),
    });
  });

  const doc = new Document({
    sections: [
      {
        headers: {
          default: new Header({ children: headerChildren }),
        },
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, right: 1440, left: 1440 },
          },
        },
        children: [
          p('تقرير تشخيصي بيداغوجي', { bold: true, size: 36, color: C.primary, align: AlignmentType.CENTER, before: 200, after: 60 }),
          p('لتحليل الأداء والتحصيل المدرسي', { size: 26, color: C.accent, align: AlignmentType.CENTER, after: 40 }),
          p('——', { size: 20, color: 'B0BEC5', align: AlignmentType.CENTER, after: 300 }),

          heading('القسم الأول: القراءة الإحصائية والمؤشرات المستنتجة', 28),
          new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } }),
          p(''),
          new Paragraph({
            children: [
              new TextRun({ text: 'تحليل المؤشرات: ', bold: true, size: 22, font: 'Cairo', color: C.primary }),
              new TextRun({ text: report.section1.content, size: 22, font: 'Cairo', color: C.body }),
            ],
            spacing: { after: 200, line: 400 },
            alignment: AlignmentType.RIGHT,
            indent: { firstLine: 720 },
          }),

          heading('القسم الثاني: التشخيص التربوي والبيداغوجي المعمق'),
          subLabel('تحليل الانحراف المعياري والفروق الفردية: ', report.section2.sdTeachingAnalysis),
          subLabel('الاستقطاب أو التوازن الجماعي: ', report.section2.eliteVsBalanced),
          subLabel('تحليل الفجوة بين الأقصى والأدنى: ', report.section2.maxMinGapAnalysis),

          heading('القسم الثالث: السيناريو الواقعي للبيانات'),
          new Paragraph({
            children: [new TextRun({ text: report.section3.content, size: 22, font: 'Cairo', color: C.body })],
            spacing: { after: 120, line: 400 },
            alignment: AlignmentType.RIGHT,
          }),
          subLabel('ملف الأستاذ وطرائق التدريس: ', report.section3.teacherProfile),
          subLabel('الديناميكية النفسية والاجتماعية للتلاميذ: ', report.section3.studentDynamics),
          subLabel('العلاقة بين الإدارة والأولياء والدعم التربوي: ', report.section3.adminParentRelation),

          heading('القسم الرابع: التوصيات الاستراتيجية والخطة العلاجية'),
          ...bulletList('أولاً: الإجراءات الإدارية والتنظيمية', report.section4.administrative),
          ...bulletList('ثانياً: المعالجة البيداغوجية والتدريس التمايزي', report.section4.pedagogical),
          ...bulletList('ثالثاً: الإرشاد والتوجيه المدرسي لدعم الفئات الهشة', report.section4.psychological),

          heading('القسم الخامس: تقرير المكاشفة والملاحظات الموجهة للأستاذ'),
          new Paragraph({
            children: [new TextRun({ text: report.section5.content, size: 22, font: 'Cairo', color: C.body })],
            spacing: { after: 200, line: 400 },
            alignment: AlignmentType.RIGHT,
            indent: { firstLine: 720 },
          }),

          heading('القسم السادس: تقرير المساءلة والملاحظات الموجهة للمدير'),
          new Paragraph({
            children: [new TextRun({ text: report.section6.content, size: 22, font: 'Cairo', color: C.body })],
            spacing: { after: 200, line: 400 },
            alignment: AlignmentType.RIGHT,
            indent: { firstLine: 720 },
          }),

          p('', { before: 400 }),
          new Paragraph({
            children: [
              new TextRun({ text: '——  ', size: 20, font: 'Cairo', color: 'B0BEC5' }),
              new TextRun({ text: 'حرر بتاريخ: ' + new Date().toLocaleDateString('ar-DZ'), size: 20, font: 'Cairo', color: C.body }),
              new TextRun({ text: '  ——', size: 20, font: 'Cairo', color: 'B0BEC5' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
          }),
          p('توقيع المستشار البيداغوجي: ...........................', { align: AlignmentType.CENTER, after: 100 }),
          p('توقيع مدير المؤسسة: .......................................', { align: AlignmentType.CENTER }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  a.download = `تقرير_بيداغوجي_${dateStr}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
