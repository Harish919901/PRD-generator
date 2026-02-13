import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

const HelpTooltip = ({ text }) => (
  <div className="group relative ml-2">
    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <div className="invisible group-hover:visible absolute z-50 w-64 p-2 text-xs bg-gray-800 text-white rounded-lg -top-2 left-6">{text}</div>
  </div>
);

const PerformanceSection = ({
  formData,
  handleInputChange,
  showNotification,
  activeAiField,
  generatePerformanceTargets
}) => {
  const updatePerformanceTargets = (field, value) => {
    handleInputChange('performanceTargets', {
      ...formData.performanceTargets,
      [field]: value
    });
  };

  const updateScalabilityPlan = (field, value) => {
    handleInputChange('scalabilityPlan', {
      ...formData.scalabilityPlan,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <label className="flex items-center text-lg font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">2.6</span>
          <Zap className="w-5 h-5 mr-2 text-blue-600" />
          Performance & Scalability
          <HelpTooltip text="Set specific performance targets for load time, concurrent users, and data volume. Plan for scalability." />
        </label>
        <button
          onClick={async () => {
            const result = await generatePerformanceTargets(formData);
            if (result?.success && result.data) {
              if (result.data.performanceTargets) {
                handleInputChange('performanceTargets', result.data.performanceTargets);
              }
              if (result.data.scalabilityPlan) {
                handleInputChange('scalabilityPlan', result.data.scalabilityPlan);
              }
              showNotification('Performance targets generated successfully!', 'success');
            }
          }}
          disabled={activeAiField === 'performanceTargets'}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {activeAiField === 'performanceTargets' ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> AI Generate</>
          )}
        </button>
      </div>

      {/* ===== Performance Targets ===== */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-5">
        <h3 className="text-base font-bold text-blue-900 mb-4">Performance Targets</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Load Time */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Load Time</label>
            <div className="relative">
              <input
                type="text"
                value={formData.performanceTargets?.loadTime || ''}
                onChange={(e) => updatePerformanceTargets('loadTime', e.target.value)}
                className="w-full px-4 py-2.5 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm"
                placeholder="e.g., 200"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">ms</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Target page load time</p>
          </div>

          {/* Concurrent Users */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Concurrent Users</label>
            <input
              type="text"
              value={formData.performanceTargets?.concurrentUsers || ''}
              onChange={(e) => updatePerformanceTargets('concurrentUsers', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm"
              placeholder="e.g., 10,000"
            />
            <p className="text-[10px] text-gray-500 mt-1">Simultaneous active users</p>
          </div>

          {/* Data Volume */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Data Volume</label>
            <input
              type="text"
              value={formData.performanceTargets?.dataVolume || ''}
              onChange={(e) => updatePerformanceTargets('dataVolume', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm"
              placeholder="e.g., 500GB"
            />
            <p className="text-[10px] text-gray-500 mt-1">Expected data storage capacity</p>
          </div>
        </div>
      </div>

      {/* ===== Scalability Plan ===== */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-5">
        <h3 className="text-base font-bold text-blue-900 mb-4">Scalability Plan</h3>
        <div className="space-y-4">
          {/* Growth Projections */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Growth Projections</label>
            <textarea
              value={formData.scalabilityPlan?.growthProjections || ''}
              onChange={(e) => updateScalabilityPlan('growthProjections', e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm resize-none"
              rows="3"
              placeholder="Describe anticipated growth patterns (e.g., 10x user growth in 12 months, data growth of 50GB/month, peak traffic patterns during business hours...)"
            />
          </div>

          {/* Infrastructure Scaling */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Infrastructure Scaling</label>
            <textarea
              value={formData.scalabilityPlan?.infrastructureScaling || ''}
              onChange={(e) => updateScalabilityPlan('infrastructureScaling', e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm resize-none"
              rows="3"
              placeholder="How will infrastructure scale? (e.g., auto-scaling groups, horizontal pod autoscaling, database sharding, CDN distribution, caching strategy...)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSection;
