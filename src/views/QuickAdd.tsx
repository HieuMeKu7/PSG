import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TECHNIQUES, EPISODES, type SacredSignType, type RecordStatus } from '../types';
import { Image as ImageIcon, Save, X, Check } from 'lucide-react';

const SACRED_SIGN_TYPES: SacredSignType[] = ['Symbol', 'Ritual', 'Role', 'Object'];

const HUMOR_DEVICES = [
  'Parody',
  'Satire',
  'Slapstick',
  'Wordplay',
  'Visual Gag',
  'Irony',
  'Absurdism',
  'Pop Culture Reference'
];

export const QuickAdd = () => {
  const { addRecord, currentUser } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    episode_id: '',
    timestamp_start: '',
    timestamp_end: '',
    sacred_sign_type: '' as SacredSignType,
    techniques: [] as string[],
    humor_devices: [] as string[],
    narrative_function: '',
    frame_description: '',
    quoted_lines: '',
    translation_notes: '',
    visual_cues: '',
    audio_cues: '',
    recontext_note: '',
    technique_reasoning: '',
    confidence: 50,
    tags: '',
    status: 'Draft' as RecordStatus,
    image_data: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  // Handle image paste
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              setFormData(prev => ({ ...prev, image_data: event.target?.result as string }));
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle techniques with 1-6 keys
      if (e.key >= '1' && e.key <= '6' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

        e.preventDefault();
        const techniqueId = `T${e.key}`;
        toggleTechnique(techniqueId);
      }

      // Save with S key
      if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

        e.preventDefault();
        handleSubmit(e as any);
      }

      // Cancel with Esc key
      if (e.key === 'Escape') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, image_data: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTechnique = (techId: string) => {
    setFormData(prev => ({
      ...prev,
      techniques: prev.techniques.includes(techId)
        ? prev.techniques.filter(t => t !== techId)
        : [...prev.techniques, techId]
    }));
  };

  const toggleHumorDevice = (device: string) => {
    setFormData(prev => ({
      ...prev,
      humor_devices: prev.humor_devices.includes(device)
        ? prev.humor_devices.filter(d => d !== device)
        : [...prev.humor_devices, device]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.episode_id || !formData.timestamp_start || !formData.frame_description) {
      alert('Please fill in required fields: Episode, Timestamp, and Frame Description');
      return;
    }

    const newRecord = {
      id: `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      episode_id: formData.episode_id,
      timestamp_start: formData.timestamp_start,
      timestamp_end: formData.timestamp_end || undefined,
      sacred_sign_type: formData.sacred_sign_type,
      techniques: formData.techniques,
      humor_devices: formData.humor_devices,
      narrative_function: formData.narrative_function,
      frame_description: formData.frame_description,
      quoted_lines: formData.quoted_lines || undefined,
      translation_notes: formData.translation_notes || undefined,
      visual_cues: formData.visual_cues || undefined,
      audio_cues: formData.audio_cues || undefined,
      recontext_note: formData.recontext_note || undefined,
      technique_reasoning: formData.technique_reasoning || undefined,
      confidence: formData.confidence,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined,
      status: formData.status,
      image_data: formData.image_data || undefined,
      created_by: currentUser!,
      created_at: new Date().toISOString()
    };

    addRecord(newRecord);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      episode_id: '',
      timestamp_start: '',
      timestamp_end: '',
      sacred_sign_type: '' as SacredSignType,
      techniques: [],
      humor_devices: [],
      narrative_function: '',
      frame_description: '',
      quoted_lines: '',
      translation_notes: '',
      visual_cues: '',
      audio_cues: '',
      recontext_note: '',
      technique_reasoning: '',
      confidence: 50,
      tags: '',
      status: 'Draft',
      image_data: ''
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-fade-in">
          <Check size={20} />
          <span>Record saved successfully!</span>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quick Add Scene</h1>
        <p className="text-gray-600 mt-2">Add a new scene record quickly</p>
        <p className="text-sm text-gray-500 mt-1">
          Shortcuts: Ctrl+V (paste image) • 1-6 (toggle techniques) • S (save) • Esc (cancel)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Episode and Timestamp */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Episode <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.episode_id}
                onChange={(e) => setFormData(prev => ({ ...prev, episode_id: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="">Select Episode</option>
                {EPISODES.map(ep => (
                  <option key={ep.id} value={ep.id}>
                    Episode {ep.number}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timestamp Start <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="00:00:00"
                value={formData.timestamp_start}
                onChange={(e) => setFormData(prev => ({ ...prev, timestamp_start: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timestamp End (Optional)
              </label>
              <input
                type="text"
                placeholder="00:00:00"
                value={formData.timestamp_end}
                onChange={(e) => setFormData(prev => ({ ...prev, timestamp_end: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Screenshot Upload */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Screenshot</h2>
          <div className="space-y-4">
            {formData.image_data ? (
              <div className="relative">
                <img
                  src={formData.image_data}
                  alt="Uploaded screenshot"
                  className="max-w-full h-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image_data: '' }))}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
              >
                <div className="flex flex-col items-center space-y-2">
                  <ImageIcon size={48} className="text-gray-400" />
                  <p className="text-gray-600">Click to upload or paste image (Ctrl+V)</p>
                  <p className="text-sm text-gray-500">Supports JPG, PNG, GIF</p>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Sacred Sign Type */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sacred Sign Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SACRED_SIGN_TYPES.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, sacred_sign_type: type }))}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  formData.sacred_sign_type === type
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Techniques */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Six Techniques (Press 1-6 to toggle)
          </h2>
          <p className="text-sm text-gray-500 mb-4">Select one or more techniques</p>
          <div className="space-y-2">
            {TECHNIQUES.map((tech, index) => (
              <button
                key={tech.id}
                type="button"
                onClick={() => toggleTechnique(tech.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  formData.techniques.includes(tech.id)
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-sm">{index + 1}</span>
                  <div className="text-left">
                    <p className="font-semibold">{tech.id}: {tech.englishName}</p>
                    <p className="text-sm opacity-90">{tech.vietnameseName}</p>
                  </div>
                </div>
                {formData.techniques.includes(tech.id) && <Check size={20} />}
              </button>
            ))}
          </div>
        </div>

        {/* Humor Devices */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Humor Devices</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {HUMOR_DEVICES.map(device => (
              <button
                key={device}
                type="button"
                onClick={() => toggleHumorDevice(device)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  formData.humor_devices.includes(device)
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {device}
              </button>
            ))}
          </div>
        </div>

        {/* Text Fields */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Narrative Function
            </label>
            <input
              type="text"
              value={formData.narrative_function}
              onChange={(e) => setFormData(prev => ({ ...prev, narrative_function: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., Comic relief, Plot advancement, Character development"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frame Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.frame_description}
              onChange={(e) => setFormData(prev => ({ ...prev, frame_description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Describe what's happening in the scene..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visual Cues
              </label>
              <textarea
                value={formData.visual_cues}
                onChange={(e) => setFormData(prev => ({ ...prev, visual_cues: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Visual elements, symbols, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audio Cues
              </label>
              <textarea
                value={formData.audio_cues}
                onChange={(e) => setFormData(prev => ({ ...prev, audio_cues: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Sound effects, music, dialogue tone"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quoted Lines
            </label>
            <textarea
              value={formData.quoted_lines}
              onChange={(e) => setFormData(prev => ({ ...prev, quoted_lines: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Exact dialogue from the scene"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Translation Notes
            </label>
            <textarea
              value={formData.translation_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, translation_notes: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Notes about translation, cultural context"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recontextualization Note
            </label>
            <textarea
              value={formData.recontext_note}
              onChange={(e) => setFormData(prev => ({ ...prev, recontext_note: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="How the sacred is recontextualized"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technique Reasoning
            </label>
            <textarea
              value={formData.technique_reasoning}
              onChange={(e) => setFormData(prev => ({ ...prev, technique_reasoning: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Why did you select these techniques?"
            />
          </div>
        </div>

        {/* Meta Fields */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Meta Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as RecordStatus }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Draft">Draft</option>
                <option value="In Review">In Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confidence: {formData.confidence}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.confidence}
                onChange={(e) => setFormData(prev => ({ ...prev, confidence: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center space-x-2"
          >
            <X size={20} />
            <span>Cancel (Esc)</span>
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium flex items-center space-x-2"
          >
            <Save size={20} />
            <span>Save Record (S)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
