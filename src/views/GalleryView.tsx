import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { EPISODES } from '../types';
import { Images, X, ZoomIn } from 'lucide-react';

export const GalleryView = () => {
  const { records } = useAppStore();
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [filterEpisode, setFilterEpisode] = useState('');

  const recordsWithImages = records
    .filter(r => r.image_data)
    .filter(r => !filterEpisode || r.episode_id === filterEpisode);

  const selectedRecordData = selectedRecord
    ? records.find(r => r.id === selectedRecord)
    : null;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gallery View</h1>
        <p className="text-gray-600 mt-2">Browse screenshots from all scenes</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Images className="text-indigo-600" size={24} />
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">Filter by Episode:</label>
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
        </div>
        <div className="text-sm text-gray-500">
          {recordsWithImages.length} image{recordsWithImages.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Gallery Grid */}
      {recordsWithImages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Images size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No images to display</p>
          <p className="text-sm text-gray-400 mt-2">
            Upload screenshots when adding scene records
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recordsWithImages.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
              onClick={() => setSelectedRecord(record.id)}
            >
              <div className="relative aspect-video bg-gray-100">
                <img
                  src={record.image_data!}
                  alt="Scene"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <ZoomIn
                    size={32}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                {/* Episode badge */}
                <div className="absolute top-2 left-2 bg-indigo-500 text-white px-2 py-1 rounded text-xs font-bold">
                  Ep {record.episode_id.replace('ep0', '').replace('ep', '')}
                </div>
                {/* Status badge */}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
                  record.status === 'Approved' ? 'bg-green-500 text-white' :
                  record.status === 'In Review' ? 'bg-yellow-500 text-white' :
                  record.status === 'Rejected' ? 'bg-red-500 text-white' :
                  'bg-gray-500 text-white'
                }`}>
                  {record.status}
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-indigo-600 font-semibold mb-1">
                  {record.timestamp_start}
                  {record.timestamp_end && ` - ${record.timestamp_end}`}
                </p>
                <p className="text-sm text-gray-800 font-medium line-clamp-2 mb-2">
                  {record.frame_description}
                </p>
                {record.techniques.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {record.techniques.slice(0, 3).map(techId => (
                      <span
                        key={techId}
                        className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded"
                      >
                        {techId}
                      </span>
                    ))}
                    {record.techniques.length > 3 && (
                      <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded">
                        +{record.techniques.length - 3}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{record.created_by}</span>
                  <span>{new Date(record.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedRecord && selectedRecordData && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRecord(null)}
        >
          <button
            onClick={() => setSelectedRecord(null)}
            className="absolute top-4 right-4 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
          >
            <X size={24} />
          </button>

          <div
            className="max-w-6xl w-full bg-white rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="bg-gray-900 flex items-center justify-center p-4">
                <img
                  src={selectedRecordData.image_data!}
                  alt="Scene"
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>

              {/* Details */}
              <div className="p-6 overflow-y-auto max-h-[80vh]">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      Episode {selectedRecordData.episode_id.replace('ep0', '').replace('ep', '')}
                    </h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      selectedRecordData.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      selectedRecordData.status === 'In Review' ? 'bg-yellow-100 text-yellow-700' :
                      selectedRecordData.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedRecordData.status}
                    </span>
                  </div>
                  <p className="text-indigo-600 font-semibold">
                    {selectedRecordData.timestamp_start}
                    {selectedRecordData.timestamp_end && ` - ${selectedRecordData.timestamp_end}`}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
                    <p className="text-gray-800">{selectedRecordData.frame_description}</p>
                  </div>

                  {selectedRecordData.techniques.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Techniques</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecordData.techniques.map(techId => (
                          <span
                            key={techId}
                            className="px-3 py-1 text-sm font-semibold bg-indigo-100 text-indigo-700 rounded-lg"
                          >
                            {techId}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedRecordData.quoted_lines && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Quoted Lines</h4>
                      <p className="text-gray-800 italic border-l-2 border-indigo-500 pl-3">
                        "{selectedRecordData.quoted_lines}"
                      </p>
                    </div>
                  )}

                  {selectedRecordData.narrative_function && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Narrative Function</h4>
                      <p className="text-gray-800">{selectedRecordData.narrative_function}</p>
                    </div>
                  )}

                  {selectedRecordData.technique_reasoning && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Technique Reasoning</h4>
                      <p className="text-gray-800">{selectedRecordData.technique_reasoning}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-600">Created by:</span>
                      <span className="ml-2 font-semibold text-gray-800">
                        {selectedRecordData.created_by}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Confidence:</span>
                      <span className="ml-2 font-semibold text-gray-800">
                        {selectedRecordData.confidence}%
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    {new Date(selectedRecordData.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
