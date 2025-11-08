import * as XLSX from 'xlsx';
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from 'docx';
import { saveAs } from 'file-saver';
import type { SceneRecord } from '../types';
import { TECHNIQUES, EPISODES } from '../types';

// Export to Excel
export const exportToExcel = (records: SceneRecord[], filename?: string) => {
  const data = records.map(record => ({
    'ID': record.id,
    'Episode': EPISODES.find(ep => ep.id === record.episode_id)?.number || record.episode_id,
    'Timestamp Start': record.timestamp_start,
    'Timestamp End': record.timestamp_end || '',
    'Sacred Sign Type': record.sacred_sign_type,
    'Techniques': record.techniques.join(', '),
    'Humor Devices': record.humor_devices.join(', '),
    'Narrative Function': record.narrative_function,
    'Frame Description': record.frame_description,
    'Quoted Lines': record.quoted_lines || '',
    'Translation Notes': record.translation_notes || '',
    'Visual Cues': record.visual_cues || '',
    'Audio Cues': record.audio_cues || '',
    'Recontextualization Note': record.recontext_note || '',
    'Technique Reasoning': record.technique_reasoning || '',
    'Confidence': record.confidence,
    'Tags': record.tags?.join(', ') || '',
    'Status': record.status,
    'Created By': record.created_by,
    'Created At': new Date(record.created_at).toLocaleString(),
    'Updated By': record.updated_by || '',
    'Updated At': record.updated_at ? new Date(record.updated_at).toLocaleString() : ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'PSG Records');

  // Auto-size columns
  const maxWidth = data.reduce((w: any, r: any) => {
    Object.keys(r).forEach(k => {
      const value = r[k]?.toString() || '';
      w[k] = Math.max(w[k] || 10, value.length);
    });
    return w;
  }, {});

  worksheet['!cols'] = Object.keys(data[0] || {}).map(k => ({ wch: Math.min(maxWidth[k] || 10, 50) }));

  const fileName = filename || `PSG_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Export to CSV
export const exportToCSV = (records: SceneRecord[], filename?: string) => {
  const data = records.map(record => ({
    'ID': record.id,
    'Episode': EPISODES.find(ep => ep.id === record.episode_id)?.number || record.episode_id,
    'Timestamp Start': record.timestamp_start,
    'Timestamp End': record.timestamp_end || '',
    'Sacred Sign Type': record.sacred_sign_type,
    'Techniques': record.techniques.join('; '),
    'Humor Devices': record.humor_devices.join('; '),
    'Narrative Function': record.narrative_function,
    'Frame Description': record.frame_description,
    'Quoted Lines': record.quoted_lines || '',
    'Translation Notes': record.translation_notes || '',
    'Visual Cues': record.visual_cues || '',
    'Audio Cues': record.audio_cues || '',
    'Recontextualization Note': record.recontext_note || '',
    'Technique Reasoning': record.technique_reasoning || '',
    'Confidence': record.confidence,
    'Tags': record.tags?.join('; ') || '',
    'Status': record.status,
    'Created By': record.created_by,
    'Created At': new Date(record.created_at).toLocaleString()
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const fileName = filename || `PSG_Export_${new Date().toISOString().split('T')[0]}.csv`;
  saveAs(blob, fileName);
};

// Export to JSON
export const exportToJSON = (records: SceneRecord[], filename?: string) => {
  const json = JSON.stringify(records, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const fileName = filename || `PSG_Export_${new Date().toISOString().split('T')[0]}.json`;
  saveAs(blob, fileName);
};

// Export to Word (Research Report)
export const exportToWord = async (records: SceneRecord[], filename?: string) => {
  // Group records by technique
  const recordsByTechnique = TECHNIQUES.map(tech => ({
    technique: tech,
    records: records.filter(r => r.techniques.includes(tech.id))
  })).filter(group => group.records.length > 0);

  const children: any[] = [];

  // Title
  children.push(
    new Paragraph({
      text: 'PSG Research Report',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );

  // Subtitle
  children.push(
    new Paragraph({
      text: 'Panty & Stocking with Garterbelt: Sacred Inversion Analysis',
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    })
  );

  // Date
  children.push(
    new Paragraph({
      text: new Date().toLocaleDateString(),
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );

  // Summary
  children.push(
    new Paragraph({
      text: 'Summary',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 }
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: `Total Records: `, bold: true }),
        new TextRun({ text: records.length.toString() })
      ],
      spacing: { after: 100 }
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: `Episodes Analyzed: `, bold: true }),
        new TextRun({ text: new Set(records.map(r => r.episode_id)).size.toString() })
      ],
      spacing: { after: 400 }
    })
  );

  // Records by Technique
  for (const group of recordsByTechnique) {
    children.push(
      new Paragraph({
        text: `${group.technique.id}: ${group.technique.englishName}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: group.technique.vietnameseName, italics: true })
        ],
        spacing: { after: 200 }
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Total Instances: `, bold: true }),
          new TextRun({ text: group.records.length.toString() })
        ],
        spacing: { after: 200 }
      })
    );

    // List records
    for (const record of group.records) {
      const episodeNum = EPISODES.find(ep => ep.id === record.episode_id)?.number || 'N/A';

      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Episode ${episodeNum} (${record.timestamp_start})`, bold: true }),
            new TextRun({ text: ` - ${record.status}` })
          ],
          spacing: { before: 200, after: 100 }
        })
      );

      children.push(
        new Paragraph({
          text: record.frame_description,
          spacing: { after: 100 }
        })
      );

      if (record.quoted_lines) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `"${record.quoted_lines}"`, italics: true })
            ],
            spacing: { after: 100 }
          })
        );
      }

      if (record.technique_reasoning) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Analysis: ', bold: true }),
              new TextRun({ text: record.technique_reasoning })
            ],
            spacing: { after: 200 }
          })
        );
      }
    }
  }

  // Create document
  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }]
  });

  // Generate and save
  const blob = await Packer.toBlob(doc);
  const fileName = filename || `PSG_Research_Report_${new Date().toISOString().split('T')[0]}.docx`;
  saveAs(blob, fileName);
};

// Backup data to JSON
export const backupData = (records: SceneRecord[]) => {
  const backup = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    recordCount: records.length,
    records: records
  };

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const fileName = `PSG_Backup_${new Date().toISOString().replace(/:/g, '-')}.json`;
  saveAs(blob, fileName);
};

// Import data from JSON
export const importData = (file: File): Promise<SceneRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // Handle both direct array and backup format
        const records = Array.isArray(data) ? data : data.records || [];
        resolve(records);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
