import { useAppStore } from '../store/useAppStore';
import { TECHNIQUES, EPISODES } from '../types';
import { BarChart3, Users, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const Dashboard = () => {
  const { records, currentUser, setCurrentView } = useAppStore();

  // Calculate statistics
  const stats = {
    total: records.length,
    byUser: {
      Hieu: records.filter(r => r.created_by === 'Hieu').length,
      Ha: records.filter(r => r.created_by === 'Ha').length,
      Dai: records.filter(r => r.created_by === 'Dai').length,
    },
    byStatus: {
      Draft: records.filter(r => r.status === 'Draft').length,
      'In Review': records.filter(r => r.status === 'In Review').length,
      Approved: records.filter(r => r.status === 'Approved').length,
      Rejected: records.filter(r => r.status === 'Rejected').length,
    },
    byTechnique: TECHNIQUES.map(tech => ({
      ...tech,
      count: records.filter(r => r.techniques.includes(tech.id)).length
    })),
    byEpisode: EPISODES.map(ep => ({
      ...ep,
      count: records.filter(r => r.episode_id === ep.id).length
    }))
  };

  const recentRecords = [...records]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {currentUser}!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Records</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
            </div>
            <div className="bg-indigo-100 rounded-full p-3">
              <FileText className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Approved</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.byStatus.Approved}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">In Review</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.byStatus['In Review']}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Draft</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.byStatus.Draft}</p>
            </div>
            <div className="bg-gray-100 rounded-full p-3">
              <AlertCircle className="text-gray-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Records by User */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="text-indigo-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Records by User</h2>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.byUser).map(([user, count]) => (
              <div key={user} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                    {user.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-700">{user}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="font-bold text-gray-800 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Records by Technique */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="text-indigo-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Records by Technique</h2>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stats.byTechnique.map((tech) => (
              <div key={tech.id} className="flex items-center justify-between text-sm">
                <div className="flex-1">
                  <span className="font-semibold text-indigo-600">{tech.id}</span>
                  <span className="text-gray-600 ml-2 text-xs">{tech.vietnameseName}</span>
                </div>
                <span className="font-bold text-gray-800 ml-2">{tech.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Records */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Records</h2>
        {recentRecords.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No records yet</p>
            <button
              onClick={() => setCurrentView('quick-add')}
              className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Add Your First Record
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-semibold text-indigo-600">
                      {EPISODES.find(ep => ep.id === record.episode_id)?.number || record.episode_id}
                    </span>
                    <span className="text-xs text-gray-500">{record.timestamp_start}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      record.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      record.status === 'In Review' ? 'bg-yellow-100 text-yellow-700' :
                      record.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                  <p className="text-gray-800 font-medium line-clamp-1">{record.frame_description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">by {record.created_by}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {new Date(record.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  {record.image_data && (
                    <img
                      src={record.image_data}
                      alt="Scene thumbnail"
                      className="w-20 h-12 object-cover rounded"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
