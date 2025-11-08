import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TECHNIQUES, type RecordStatus } from '../types';
import { MoreVertical } from 'lucide-react';

type GroupBy = 'status' | 'technique';

export const KanbanView = () => {
  const { records, updateRecord } = useAppStore();
  const [groupBy, setGroupBy] = useState<GroupBy>('status');

  const statusColumns: RecordStatus[] = ['Draft', 'In Review', 'Approved', 'Rejected'];

  const getRecordsByStatus = (status: RecordStatus) => {
    return records.filter(r => r.status === status);
  };

  const getRecordsByTechnique = (techniqueId: string) => {
    return records.filter(r => r.techniques.includes(techniqueId));
  };

  const handleStatusChange = (recordId: string, newStatus: RecordStatus) => {
    updateRecord(recordId, { status: newStatus });
  };

  const getStatusColor = (status: RecordStatus) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 border-gray-300 text-gray-700';
      case 'In Review':
        return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      case 'Approved':
        return 'bg-green-50 border-green-300 text-green-800';
      case 'Rejected':
        return 'bg-red-50 border-red-300 text-red-800';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kanban View</h1>
          <p className="text-gray-600 mt-2">Organize records by status or technique</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Group by:</span>
          <button
            onClick={() => setGroupBy('status')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              groupBy === 'status'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Status
          </button>
          <button
            onClick={() => setGroupBy('technique')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              groupBy === 'technique'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Technique
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      {groupBy === 'status' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 overflow-x-auto">
          {statusColumns.map((status) => {
            const columnRecords = getRecordsByStatus(status);
            return (
              <div key={status} className="flex-shrink-0 w-full md:w-auto">
                <div className={`rounded-xl border-2 ${getStatusColor(status)} p-4 mb-4`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{status}</h3>
                    <span className="text-sm font-semibold">{columnRecords.length}</span>
                  </div>
                </div>

                <div className="space-y-3 min-h-[400px]">
                  {columnRecords.map((record) => (
                    <div
                      key={record.id}
                      className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      {record.image_data && (
                        <img
                          src={record.image_data}
                          alt="Scene"
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}

                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-semibold text-indigo-600">
                          Episode {record.episode_id.replace('ep', '')} • {record.timestamp_start}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
                      </div>

                      <p className="text-sm text-gray-800 font-medium mb-2 line-clamp-2">
                        {record.frame_description}
                      </p>

                      {record.techniques.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {record.techniques.map(techId => (
                            <span
                              key={techId}
                              className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded"
                            >
                              {techId}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{record.created_by}</span>
                        <span>{record.confidence}%</span>
                      </div>

                      {/* Quick status change */}
                      <select
                        value={record.status}
                        onChange={(e) => handleStatusChange(record.id, e.target.value as RecordStatus)}
                        className="mt-3 w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {statusColumns.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                  {columnRecords.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-8">
                      No records
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto">
          {TECHNIQUES.map((technique) => {
            const columnRecords = getRecordsByTechnique(technique.id);
            return (
              <div key={technique.id} className="flex-shrink-0 w-full">
                <div className="rounded-xl border-2 bg-indigo-50 border-indigo-300 text-indigo-800 p-4 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg">{technique.id}</h3>
                    <span className="text-sm font-semibold">{columnRecords.length}</span>
                  </div>
                  <p className="text-xs opacity-90">{technique.vietnameseName}</p>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {columnRecords.map((record) => (
                    <div
                      key={record.id}
                      className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                      {record.image_data && (
                        <img
                          src={record.image_data}
                          alt="Scene"
                          className="w-full h-24 object-cover rounded-lg mb-2"
                        />
                      )}

                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        Episode {record.episode_id.replace('ep', '')} • {record.timestamp_start}
                      </div>

                      <p className="text-sm text-gray-800 font-medium mb-2 line-clamp-2">
                        {record.frame_description}
                      </p>

                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          record.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          record.status === 'In Review' ? 'bg-yellow-100 text-yellow-700' :
                          record.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {record.status}
                        </span>
                        <span className="text-gray-500">{record.created_by}</span>
                      </div>
                    </div>
                  ))}
                  {columnRecords.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-8">
                      No records
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
