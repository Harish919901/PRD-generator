import React, { useState } from 'react';
import { Sparkles, Plus, X, LayoutGrid } from 'lucide-react';
import { PRIORITY_CATEGORIES } from '../../constants';

const HelpTooltip = ({ text }) => (
  <div className="group relative ml-2">
    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <div className="invisible group-hover:visible absolute z-50 w-64 p-2 text-xs bg-gray-800 text-white rounded-lg -top-2 left-6">
      {text}
    </div>
  </div>
);

// Color mappings for each MoSCoW category
const COLOR_MAP = {
  red: {
    border: 'border-red-200',
    bg: 'bg-red-50',
    badge: 'bg-red-100 text-red-700',
    chip: 'bg-red-50 text-red-700',
    button: 'bg-red-50 text-red-600 hover:bg-red-100',
    header: 'text-red-700'
  },
  orange: {
    border: 'border-orange-200',
    bg: 'bg-orange-50',
    badge: 'bg-orange-100 text-orange-700',
    chip: 'bg-orange-50 text-orange-700',
    button: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    header: 'text-orange-700'
  },
  blue: {
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    badge: 'bg-blue-100 text-blue-700',
    chip: 'bg-blue-50 text-blue-700',
    button: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    header: 'text-blue-700'
  },
  gray: {
    border: 'border-gray-200',
    bg: 'bg-gray-50',
    badge: 'bg-gray-200 text-gray-700',
    chip: 'bg-gray-100 text-gray-700',
    button: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    header: 'text-gray-700'
  }
};

export default function FeaturePrioritySection({
  formData,
  handleInputChange,
  addToArray,
  removeFromArray,
  showNotification,
  activeAiField,
  generateMVPFeatures
}) {
  const [newFeature, setNewFeature] = useState({});

  // Add a feature to a specific priority category
  const addFeature = (category, feature) => {
    if (!feature.trim()) return;
    const updated = {
      ...formData.featurePriority,
      [category]: [...(formData.featurePriority[category] || []), feature.trim()]
    };
    handleInputChange('featurePriority', updated);
  };

  // Remove a feature from a specific category
  const removeFeature = (category, index) => {
    const updated = {
      ...formData.featurePriority,
      [category]: formData.featurePriority[category].filter((_, i) => i !== index)
    };
    handleInputChange('featurePriority', updated);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center text-base font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
            1.5
          </span>
          MVP Feature Prioritization
          <HelpTooltip text="Prioritize features using the MoSCoW method: Must Have (critical for launch), Should Have (important), Could Have (nice to have), Won't Have (out of scope for v1)." />
        </label>
        <button
          onClick={async () => {
            const result = await generateMVPFeatures(
              formData.appName,
              formData.appIdea,
              formData.primaryUserPersonas,
              formData.userStories
            );
            if (result?.success && result.data) {
              handleInputChange('featurePriority', {
                ...formData.featurePriority,
                ...result.data
              });
              showNotification('MVP features generated successfully!', 'success');
            }
          }}
          disabled={activeAiField === 'mvpFeatures'}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {activeAiField === 'mvpFeatures' ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> AI Generate</>
          )}
        </button>
      </div>

      {/* MoSCoW 4-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {PRIORITY_CATEGORIES.map((cat) => {
          const colors = COLOR_MAP[cat.color] || COLOR_MAP.gray;
          const features = formData.featurePriority[cat.key] || [];

          return (
            <div
              key={cat.key}
              className={`border-2 ${colors.border} rounded-xl overflow-hidden`}
            >
              {/* Column Header */}
              <div className={`${colors.bg} px-4 py-3 border-b ${colors.border}`}>
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold ${colors.header}`}>{cat.label}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${colors.badge}`}>
                    {features.length}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
              </div>

              {/* Feature List */}
              <div className="p-3 space-y-2 min-h-[120px]">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-3 py-2 ${colors.chip} rounded-lg text-xs font-medium group`}
                  >
                    <span className="flex-1 mr-2">{feature}</span>
                    <button
                      onClick={() => removeFeature(cat.key, i)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-600 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {features.length === 0 && (
                  <div className="text-xs text-gray-400 text-center py-4 italic">
                    No features yet
                  </div>
                )}
              </div>

              {/* Add Feature Input */}
              <div className="px-3 pb-3">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newFeature[cat.key] || ''}
                    onChange={(e) => setNewFeature({ ...newFeature, [cat.key]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature(cat.key, newFeature[cat.key] || '');
                        setNewFeature({ ...newFeature, [cat.key]: '' });
                      }
                    }}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:border-blue-400 outline-none"
                    placeholder="Add feature..."
                  />
                  <button
                    onClick={() => {
                      addFeature(cat.key, newFeature[cat.key] || '');
                      setNewFeature({ ...newFeature, [cat.key]: '' });
                    }}
                    className={`px-2.5 py-1.5 ${colors.button} rounded-lg text-xs font-medium transition-colors`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
