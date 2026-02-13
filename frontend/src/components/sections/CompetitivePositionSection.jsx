import React from 'react';
import { Sparkles, Globe, Plus, X } from 'lucide-react';

const HelpTooltip = ({ text }) => (
  <div className="group relative ml-2">
    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <div className="invisible group-hover:visible absolute z-50 w-64 p-2 text-xs bg-gray-800 text-white rounded-lg -top-2 left-6">{text}</div>
  </div>
);

const CompetitivePositionSection = ({
  formData,
  handleInputChange,
  showNotification,
  activeAiField,
  generateCompetitivePositioning
}) => {
  const updatePositioning = (field, value) => {
    handleInputChange('competitivePositioning', {
      ...formData.competitivePositioning,
      [field]: value
    });
  };

  const addDifferentiator = () => {
    const current = formData.competitivePositioning?.keyDifferentiators || [];
    updatePositioning('keyDifferentiators', [...current, '']);
  };

  const removeDifferentiator = (index) => {
    const current = formData.competitivePositioning?.keyDifferentiators || [];
    updatePositioning('keyDifferentiators', current.filter((_, i) => i !== index));
  };

  const updateDifferentiator = (index, value) => {
    const current = [...(formData.competitivePositioning?.keyDifferentiators || [])];
    current[index] = value;
    updatePositioning('keyDifferentiators', current);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <label className="flex items-center text-lg font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">2.7</span>
          <Globe className="w-5 h-5 mr-2 text-blue-600" />
          Competitive Positioning
          <HelpTooltip text="Identify key differentiators, pricing strategy, and market positioning relative to competitors." />
        </label>
        <button
          onClick={async () => {
            const result = await generateCompetitivePositioning(formData);
            if (result?.success && result.data) {
              if (result.data.competitivePositioning) {
                handleInputChange('competitivePositioning', result.data.competitivePositioning);
              } else {
                // Handle flat response shape
                const updated = {};
                if (result.data.keyDifferentiators) updated.keyDifferentiators = result.data.keyDifferentiators;
                if (result.data.pricingStrategy) updated.pricingStrategy = result.data.pricingStrategy;
                if (result.data.marketPositioning) updated.marketPositioning = result.data.marketPositioning;
                handleInputChange('competitivePositioning', {
                  ...formData.competitivePositioning,
                  ...updated
                });
              }
              showNotification('Competitive positioning generated successfully!', 'success');
            }
          }}
          disabled={activeAiField === 'competitivePositioning'}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {activeAiField === 'competitivePositioning' ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> AI Generate</>
          )}
        </button>
      </div>

      {/* ===== Key Differentiators ===== */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-blue-900">Key Differentiators</h3>
          <button
            onClick={addDifferentiator}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-600 border-2 border-blue-300 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Differentiator
          </button>
        </div>

        {(formData.competitivePositioning?.keyDifferentiators || []).length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-dashed border-blue-200 p-6 text-center">
            <p className="text-gray-500 text-sm">No differentiators defined yet. Click "Add Differentiator" or use AI Generate.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {(formData.competitivePositioning?.keyDifferentiators || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={item || ''}
                  onChange={(e) => updateDifferentiator(idx, e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  placeholder="What makes your product unique?"
                />
                <button
                  onClick={() => removeDifferentiator(idx)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Pricing Strategy ===== */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-5">
        <h3 className="text-base font-bold text-blue-900 mb-3">Pricing Strategy</h3>
        <textarea
          value={formData.competitivePositioning?.pricingStrategy || ''}
          onChange={(e) => updatePositioning('pricingStrategy', e.target.value)}
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm resize-none"
          rows="4"
          placeholder="Describe your pricing model and strategy (e.g., freemium with premium tiers, per-seat licensing, usage-based pricing, competitive pricing against alternatives...)"
        />
      </div>

      {/* ===== Market Positioning ===== */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-5">
        <h3 className="text-base font-bold text-blue-900 mb-3">Market Positioning</h3>
        <textarea
          value={formData.competitivePositioning?.marketPositioning || ''}
          onChange={(e) => updatePositioning('marketPositioning', e.target.value)}
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm resize-none"
          rows="4"
          placeholder="How does your product fit in the market? (e.g., premium enterprise solution, affordable alternative for SMBs, niche specialist for vertical X, all-in-one platform displacing multiple tools...)"
        />
      </div>
    </div>
  );
};

export default CompetitivePositionSection;
