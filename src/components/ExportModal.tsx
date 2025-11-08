import { useState } from 'react';
import { X, Download, FileSpreadsheet, FileText, FileJson, Database } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { exportToExcel, exportToCSV, exportToJSON, exportToWord, backupData } from '../utils/export';

interface ExportModalProps {
  onClose: () => void;
}

export const ExportModal = ({ onClose }: ExportModalProps) => {
  const { records, getFilteredRecords } = useAppStore();
  const [useFilters, setUseFilters] = useState(false);

  const recordsToExport = useFilters ? getFilteredRecords() : records;

  const handleExport = async (format: 'excel' | 'csv' | 'json' | 'word') => {
    if (recordsToExport.length === 0) {
      alert('No records to export');
      return;
    }

    try {
      switch (format) {
        case 'excel':
          exportToExcel(recordsToExport);
          break;
        case 'csv':
          exportToCSV(recordsToExport);
          break;
        case 'json':
          exportToJSON(recordsToExport);
          break;
        case 'word':
          await exportToWord(recordsToExport);
          break;
      }
      alert(`Successfully exported ${recordsToExport.length} records to ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleBackup = () => {
    backupData(records);
    alert(`Backup created with ${records.length} records`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Export Data</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filter Option */}
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useFilters}
              onChange={(e) => setUseFilters(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-800">Use current filters</p>
              <p className="text-sm text-gray-600">
                {useFilters
                  ? `Will export ${recordsToExport.length} filtered records`
                  : `Will export all ${records.length} records`}
              </p>
            </div>
          </label>
        </div>

        {/* Export Options */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Choose Export Format:</h3>

          <button
            onClick={() => handleExport('excel')}
            className="w-full flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
              <FileSpreadsheet className="text-green-600" size={24} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-800">Excel (.xlsx)</p>
              <p className="text-sm text-gray-600">Spreadsheet with all fields and formatting</p>
            </div>
            <Download className="text-gray-400 group-hover:text-green-600" size={20} />
          </button>

          <button
            onClick={() => handleExport('word')}
            className="w-full flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
              <FileText className="text-blue-600" size={24} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-800">Word (.docx)</p>
              <p className="text-sm text-gray-600">Research report grouped by technique</p>
            </div>
            <Download className="text-gray-400 group-hover:text-blue-600" size={20} />
          </button>

          <button
            onClick={() => handleExport('csv')}
            className="w-full flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all group"
          >
            <div className="bg-yellow-100 p-3 rounded-lg group-hover:bg-yellow-200 transition-colors">
              <FileText className="text-yellow-600" size={24} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-800">CSV (.csv)</p>
              <p className="text-sm text-gray-600">Plain text format for data analysis</p>
            </div>
            <Download className="text-gray-400 group-hover:text-yellow-600" size={20} />
          </button>

          <button
            onClick={() => handleExport('json')}
            className="w-full flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
          >
            <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
              <FileJson className="text-purple-600" size={24} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-800">JSON (.json)</p>
              <p className="text-sm text-gray-600">Raw data format for import/export</p>
            </div>
            <Download className="text-gray-400 group-hover:text-purple-600" size={20} />
          </button>
        </div>

        {/* Backup Option */}
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={handleBackup}
            className="w-full flex items-center space-x-4 p-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
          >
            <Database size={24} />
            <div className="flex-1 text-left">
              <p className="font-semibold">Create Full Backup</p>
              <p className="text-sm opacity-90">Save all data with metadata as JSON</p>
            </div>
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
