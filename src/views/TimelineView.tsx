import { useAppStore } from '../store/useAppStore';
import { EPISODES } from '../types';
import { Clock } from 'lucide-react';

export const TimelineView = () => {
  const { records } = useAppStore();

  // Group records by episode
  const recordsByEpisode = EPISODES.map(episode => ({
    ...episode,
    records: records
      .filter(r => r.episode_id === episode.id)
      .sort((a, b) => {
        // Simple timestamp comparison
        return a.timestamp_start.localeCompare(b.timestamp_start);
      })
  })).filter(ep => ep.records.length > 0);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Timeline View</h1>
        <p className="text-gray-600 mt-2">View records chronologically by episode and timestamp</p>
      </div>

      {recordsByEpisode.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Clock size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No records to display</p>
        </div>
      ) : (
        <div className="space-y-8">
          {recordsByEpisode.map((episode) => (
            <div key={episode.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-indigo-600">
                  Episode {episode.number}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{episode.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {episode.records.length} scene{episode.records.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

                {/* Records */}
                <div className="space-y-6">
                  {episode.records.map((record) => (
                    <div key={record.id} className="relative flex items-start space-x-4">
                      {/* Timeline dot */}
                      <div className="flex-shrink-0 relative z-10">
                        <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg">
                          <Clock size={24} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-indigo-600 text-lg">
                              {record.timestamp_start}
                              {record.timestamp_end && ` - ${record.timestamp_end}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              by {record.created_by} • {new Date(record.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            record.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            record.status === 'In Review' ? 'bg-yellow-100 text-yellow-700' :
                            record.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {record.status}
                          </span>
                        </div>

                        <div className="flex items-start space-x-4">
                          {record.image_data && (
                            <img
                              src={record.image_data}
                              alt="Scene"
                              className="w-32 h-20 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium mb-2">
                              {record.frame_description}
                            </p>
                            {record.techniques.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {record.techniques.map(techId => (
                                  <span
                                    key={techId}
                                    className="px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded"
                                  >
                                    {techId}
                                  </span>
                                ))}
                              </div>
                            )}
                            {record.quoted_lines && (
                              <p className="text-sm text-gray-600 italic border-l-2 border-gray-300 pl-3">
                                "{record.quoted_lines}"
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
