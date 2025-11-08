import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { EPISODES } from '../types';
import { Edit, Trash2, Eye, Filter } from 'lucide-react';

export const TableView = () => {
  const { records, deleteRecord } = useAppStore();
  const [sortBy, setSortBy] = useState<'created_at' | 'episode' | 'confidence'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterEpisode, setFilterEpisode] = useState('');

  const sortedRecords = [...records]
    .filter(r => !filterEpisode || r.episode_id === filterEpisode)
    .sort((a, b) => {
      let compareA: any, compareB: any;

      switch (sortBy) {
        case 'created_at':
          compareA = new Date(a.created_at).getTime();
          compareB = new Date(b.created_at).getTime();
          break;
        case 'episode':
          compareA = a.episode_id;
          compareB = b.episode_id;
          break;
        case 'confidence':
          compareA = a.confidence;
          compareB = b.confidence;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      deleteRecord(id);
    }
  };

  const toggleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Table View</h1>
        <p className="text-gray-600 mt-2">View and manage all records in a table</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center space-x-4">
        <Filter className="text-gray-500" size={20} />
        <div className="flex-1 flex items-center space-x-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">Episode:</label>
            <select
              value={filterEpisode}
              onChange={(e) => setFilterEpisode(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Episodes</option>
              {EPISODES.map(ep => (
                <option key={ep.id} value={ep.id}>Episode {ep.number}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-500">
            Showing {sortedRecords.length} record{sortedRecords.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thumbnail
                </th>
                <th
                  onClick={() => toggleSort('episode')}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Episode {sortBy === 'episode' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Techniques
                </th>
                <th
                  onClick={() => toggleSort('confidence')}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Confidence {sortBy === 'confidence' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created By
                </th>
                <th
                  onClick={() => toggleSort('created_at')}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Date {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                sortedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {record.image_data ? (
                        <img
                          src={record.image_data}
                          alt="Scene"
                          className="w-16 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <Eye size={16} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {EPISODES.find(ep => ep.id === record.episode_id)?.number || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {record.timestamp_start}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {record.frame_description}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {record.techniques.map(techId => (
                          <span
                            key={techId}
                            className="px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded"
                          >
                            {techId}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              record.confidence >= 70 ? 'bg-green-500' :
                              record.confidence >= 40 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${record.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{record.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        record.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        record.status === 'In Review' ? 'bg-yellow-100 text-yellow-700' :
                        record.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {record.created_by}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(record.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
