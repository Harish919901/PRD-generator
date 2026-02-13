import React from 'react';
import { Sparkles, Type } from 'lucide-react';

const HelpTooltip = ({ text }) => (
  <div className="group relative ml-2">
    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <div className="invisible group-hover:visible absolute z-50 w-64 p-2 text-xs bg-gray-800 text-white rounded-lg -top-2 left-6">{text}</div>
  </div>
);

const FONT_SIZE_LABELS = {
  xs: 'XS',
  sm: 'SM',
  base: 'Base',
  lg: 'LG',
  xl: 'XL',
  '2xl': '2XL',
  '3xl': '3XL',
  '4xl': '4XL',
  '5xl': '5XL'
};

const LINE_HEIGHT_LABELS = {
  tight: 'Tight',
  normal: 'Normal',
  relaxed: 'Relaxed'
};

const FONT_WEIGHT_LABELS = {
  light: 'Light',
  normal: 'Normal',
  medium: 'Medium',
  semibold: 'Semibold',
  bold: 'Bold'
};

const TypeScaleSection = ({
  formData,
  handleInputChange,
  handleNestedChange,
  showNotification,
  activeAiField,
  generateDesignSystem
}) => {
  const updateTypeScale = (section, key, value) => {
    handleInputChange('typeScale', {
      ...formData.typeScale,
      [section]: { ...formData.typeScale[section], [key]: value }
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <label className="flex items-center text-base font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
            3.2
          </span>
          Type Scale System
          <HelpTooltip text="Define a consistent typographic scale with font sizes, line heights, and font weights. This ensures visual hierarchy and readability across your application." />
        </label>
        <button
          onClick={async () => {
            const result = await generateDesignSystem(
              formData.primaryColor,
              formData.secondaryColor,
              formData.accentColor,
              formData.primaryFont,
              formData.headingsFont,
              formData.platform
            );
            if (result?.success && result.data) {
              if (result.data.typeScale) {
                handleInputChange('typeScale', {
                  ...formData.typeScale,
                  ...result.data.typeScale
                });
              }
              showNotification('Type scale generated successfully!', 'success');
            }
          }}
          disabled={activeAiField === 'designSystem'}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {activeAiField === 'designSystem' ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> AI Generate</>
          )}
        </button>
      </div>

      {/* Font Sizes */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <Type className="w-4 h-4 mr-2 text-blue-500" />
          Font Sizes
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(FONT_SIZE_LABELS).map(([key, label]) => (
            <div key={key} className="bg-white rounded-xl border-2 border-gray-200 p-3 hover:border-blue-200 transition-colors">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{label}</label>
              <input
                type="text"
                value={(formData.typeScale?.fontSizes || {})[key] || ''}
                onChange={(e) => updateTypeScale('fontSizes', key, e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                placeholder="e.g., 16px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Line Heights */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Line Heights
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(LINE_HEIGHT_LABELS).map(([key, label]) => (
            <div key={key} className="bg-white rounded-xl border-2 border-gray-200 p-3 hover:border-blue-200 transition-colors">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{label}</label>
              <input
                type="text"
                value={(formData.typeScale?.lineHeights || {})[key] || ''}
                onChange={(e) => updateTypeScale('lineHeights', key, e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                placeholder="e.g., 1.5"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Font Weights */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Font Weights
        </h4>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(FONT_WEIGHT_LABELS).map(([key, label]) => (
            <div key={key} className="bg-white rounded-xl border-2 border-gray-200 p-3 hover:border-blue-200 transition-colors">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{label}</label>
              <input
                type="text"
                value={(formData.typeScale?.fontWeights || {})[key] || ''}
                onChange={(e) => updateTypeScale('fontWeights', key, e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                placeholder="e.g., 400"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Usage Guidelines */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Usage Guidelines
        </h4>
        <textarea
          value={formData.typeScale?.usageGuidelines || ''}
          onChange={(e) => handleInputChange('typeScale', {
            ...formData.typeScale,
            usageGuidelines: e.target.value
          })}
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none text-sm"
          rows="4"
          placeholder="Describe typography usage guidelines, e.g., when to use each font size, heading hierarchy rules, body text standards..."
        />
      </div>
    </div>
  );
};

export default TypeScaleSection;
