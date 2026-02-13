import React, { useState } from 'react';
import { Sparkles, Plus, X, BarChart3, Zap, TrendingUp, DollarSign, Calendar } from 'lucide-react';

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

// Metric category definitions
const METRIC_CATEGORIES = [
  {
    key: 'activationMetrics',
    label: 'Activation Metrics',
    description: 'Initial engagement indicators',
    icon: Zap,
    colors: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      chip: 'bg-amber-50 text-amber-700',
      button: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
      icon: 'text-amber-500',
      header: 'text-amber-700'
    }
  },
  {
    key: 'engagementMetrics',
    label: 'Engagement Metrics',
    description: 'Ongoing usage tracking',
    icon: TrendingUp,
    colors: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      chip: 'bg-blue-50 text-blue-700',
      button: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      icon: 'text-blue-500',
      header: 'text-blue-700'
    }
  },
  {
    key: 'businessMetrics',
    label: 'Business Metrics',
    description: 'Revenue & growth KPIs',
    icon: DollarSign,
    colors: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      chip: 'bg-green-50 text-green-700',
      button: 'bg-green-50 text-green-600 hover:bg-green-100',
      icon: 'text-green-500',
      header: 'text-green-700'
    }
  }
];

export default function SuccessMetricsSection({
  formData,
  handleInputChange,
  handleNestedChange,
  addToArray,
  removeFromArray,
  showNotification,
  activeAiField,
  generateSuccessMetrics
}) {
  const [newMetric, setNewMetric] = useState({});

  // Add a metric to a specific category
  const addMetric = (category, metric) => {
    if (!metric.trim()) return;
    const updated = {
      ...formData.successMetrics,
      [category]: [...(formData.successMetrics[category] || []), metric.trim()]
    };
    handleInputChange('successMetrics', updated);
  };

  // Remove a metric from a specific category
  const removeMetric = (category, index) => {
    const updated = {
      ...formData.successMetrics,
      [category]: formData.successMetrics[category].filter((_, i) => i !== index)
    };
    handleInputChange('successMetrics', updated);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center text-base font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
            1.6
          </span>
          Success Metrics & KPIs
          <HelpTooltip text="Define KPIs across activation (initial engagement), engagement (ongoing usage), and business (revenue/growth) categories." />
        </label>
        <button
          onClick={async () => {
            const result = await generateSuccessMetrics(
              formData.appName,
              formData.appIdea,
              formData.primaryUserPersonas,
              formData.featurePriority
            );
            if (result?.success && result.data) {
              if (result.data.successMetrics) {
                handleInputChange('successMetrics', {
                  ...formData.successMetrics,
                  ...result.data.successMetrics
                });
              }
              if (result.data.successTimeline) {
                handleInputChange('successTimeline', {
                  ...formData.successTimeline,
                  ...result.data.successTimeline
                });
              }
              showNotification('Success metrics generated successfully!', 'success');
            }
          }}
          disabled={activeAiField === 'successMetrics'}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {activeAiField === 'successMetrics' ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> AI Generate</>
          )}
        </button>
      </div>

      {/* KPI Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {METRIC_CATEGORIES.map((cat) => {
          const IconComp = cat.icon;
          const metrics = formData.successMetrics[cat.key] || [];

          return (
            <div
              key={cat.key}
              className={`border-2 ${cat.colors.border} rounded-xl overflow-hidden`}
            >
              {/* Category Header */}
              <div className={`${cat.colors.bg} px-4 py-3 border-b ${cat.colors.border}`}>
                <div className="flex items-center gap-2">
                  <IconComp className={`w-4 h-4 ${cat.colors.icon}`} />
                  <div>
                    <h4 className={`text-sm font-bold ${cat.colors.header}`}>{cat.label}</h4>
                    <p className="text-xs text-gray-500">{cat.description}</p>
                  </div>
                </div>
              </div>

              {/* Metrics List */}
              <div className="p-3 space-y-2 min-h-[100px]">
                {metrics.map((metric, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-3 py-2 ${cat.colors.chip} rounded-lg text-xs font-medium group`}
                  >
                    <span className="flex-1 mr-2">{metric}</span>
                    <button
                      onClick={() => removeMetric(cat.key, i)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-600 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {metrics.length === 0 && (
                  <div className="text-xs text-gray-400 text-center py-4 italic">
                    No metrics defined
                  </div>
                )}
              </div>

              {/* Add Metric Input */}
              <div className="px-3 pb-3">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newMetric[cat.key] || ''}
                    onChange={(e) => setNewMetric({ ...newMetric, [cat.key]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addMetric(cat.key, newMetric[cat.key] || '');
                        setNewMetric({ ...newMetric, [cat.key]: '' });
                      }
                    }}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:border-blue-400 outline-none"
                    placeholder="Add metric..."
                  />
                  <button
                    onClick={() => {
                      addMetric(cat.key, newMetric[cat.key] || '');
                      setNewMetric({ ...newMetric, [cat.key]: '' });
                    }}
                    className={`px-2.5 py-1.5 ${cat.colors.button} rounded-lg text-xs font-medium transition-colors`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Success Timeline */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-blue-500" />
          Success Timeline
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 30-Day Goals */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <label className="text-xs font-bold text-gray-600 mb-2 block flex items-center gap-1.5">
              <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-[10px] font-bold">30</span>
              30-Day Goals
            </label>
            <textarea
              value={formData.successTimeline.thirtyDayGoals || ''}
              onChange={(e) => handleNestedChange('successTimeline', 'thirtyDayGoals', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 outline-none resize-none"
              rows="3"
              placeholder="What should be achieved in the first 30 days..."
            />
          </div>

          {/* 90-Day Goals */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <label className="text-xs font-bold text-gray-600 mb-2 block flex items-center gap-1.5">
              <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-[10px] font-bold">90</span>
              90-Day Goals
            </label>
            <textarea
              value={formData.successTimeline.ninetyDayGoals || ''}
              onChange={(e) => handleNestedChange('successTimeline', 'ninetyDayGoals', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 outline-none resize-none"
              rows="3"
              placeholder="Mid-term milestones and targets..."
            />
          </div>

          {/* 1-Year Vision */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <label className="text-xs font-bold text-gray-600 mb-2 block flex items-center gap-1.5">
              <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-[10px] font-bold">1Y</span>
              1-Year Vision
            </label>
            <textarea
              value={formData.successTimeline.oneYearVision || ''}
              onChange={(e) => handleNestedChange('successTimeline', 'oneYearVision', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 outline-none resize-none"
              rows="3"
              placeholder="Long-term vision and growth targets..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
