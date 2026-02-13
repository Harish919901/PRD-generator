import React from 'react';
import { Sparkles } from 'lucide-react';
import { WCAG_LEVELS } from '../../constants';

const HelpTooltip = ({ text }) => (
  <div className="group relative ml-2">
    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <div className="invisible group-hover:visible absolute z-50 w-64 p-2 text-xs bg-gray-800 text-white rounded-lg -top-2 left-6">{text}</div>
  </div>
);

const UXGuidelinesSection = ({
  formData,
  handleInputChange,
  handleNestedChange,
  showNotification,
  activeAiField,
  generateUXGuidelines
}) => {
  const updateInteractionPattern = (key, value) => {
    handleInputChange('uxGuidelines', {
      ...formData.uxGuidelines,
      interactionPatterns: {
        ...formData.uxGuidelines.interactionPatterns,
        [key]: value
      }
    });
  };

  const updateAccessibility = (key, value) => {
    handleInputChange('uxGuidelines', {
      ...formData.uxGuidelines,
      accessibility: {
        ...formData.uxGuidelines.accessibility,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <label className="flex items-center text-base font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
            3.4
          </span>
          UX Guidelines
          <HelpTooltip text="Define interaction patterns, animation guidelines, loading and error state behaviors, and accessibility standards for a consistent user experience." />
        </label>
        <button
          onClick={async () => {
            const result = await generateUXGuidelines(
              formData.appName,
              formData.platform,
              formData.primaryColor,
              formData.uxGuidelines
            );
            if (result?.success && result.data) {
              handleInputChange('uxGuidelines', {
                ...formData.uxGuidelines,
                ...result.data
              });
              showNotification('UX guidelines generated successfully!', 'success');
            }
          }}
          disabled={activeAiField === 'uxGuidelines'}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {activeAiField === 'uxGuidelines' ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> AI Generate</>
          )}
        </button>
      </div>

      {/* Interaction Patterns */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          Interaction Patterns
        </h4>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Click Targets</label>
            <textarea
              value={formData.uxGuidelines?.interactionPatterns?.clickTargets || ''}
              onChange={(e) => updateInteractionPattern('clickTargets', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none text-sm"
              rows="3"
              placeholder="Define minimum click target sizes, hover states, touch-friendly areas (e.g., 44x44px minimum tap targets for mobile)..."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Animation Guidelines</label>
            <textarea
              value={formData.uxGuidelines?.interactionPatterns?.animationGuidelines || ''}
              onChange={(e) => updateInteractionPattern('animationGuidelines', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none text-sm"
              rows="3"
              placeholder="Define animation timing, easing functions, micro-interactions (e.g., 200ms ease-in-out for transitions, subtle scale on hover)..."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Loading States</label>
            <textarea
              value={formData.uxGuidelines?.interactionPatterns?.loadingStates || ''}
              onChange={(e) => updateInteractionPattern('loadingStates', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none text-sm"
              rows="3"
              placeholder="Define loading indicators, skeleton screens, progress bars, spinner styles (e.g., skeleton placeholders for content, spinner for actions)..."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Error States</label>
            <textarea
              value={formData.uxGuidelines?.interactionPatterns?.errorStates || ''}
              onChange={(e) => updateInteractionPattern('errorStates', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none text-sm"
              rows="3"
              placeholder="Define error message styles, validation feedback, empty states, 404/500 pages (e.g., inline errors in red, toast notifications for actions)..."
            />
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Accessibility
        </h4>
        <div className="space-y-4">
          {/* WCAG Level */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-blue-200 transition-colors">
            <label className="text-xs font-semibold text-gray-600 mb-2 block">WCAG Compliance Level</label>
            <div className="flex gap-3">
              {WCAG_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => updateAccessibility('wcagLevel', level)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                    formData.uxGuidelines?.accessibility?.wcagLevel === level
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  WCAG {level}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {formData.uxGuidelines?.accessibility?.wcagLevel === 'A' && 'Level A: Minimum accessibility. Removes the most significant barriers.'}
              {formData.uxGuidelines?.accessibility?.wcagLevel === 'AA' && 'Level AA: Mid-range accessibility. Addresses major barriers for most users. Recommended standard.'}
              {formData.uxGuidelines?.accessibility?.wcagLevel === 'AAA' && 'Level AAA: Highest accessibility. Most comprehensive coverage for all user needs.'}
            </p>
          </div>

          {/* Screen Reader Compatible Toggle */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-gray-700 block">Screen Reader Compatible</label>
                <p className="text-xs text-gray-400 mt-0.5">Ensure all content is accessible via screen readers with proper ARIA labels and semantic HTML.</p>
              </div>
              <button
                onClick={() => updateAccessibility('screenReaderCompat', !formData.uxGuidelines?.accessibility?.screenReaderCompat)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  formData.uxGuidelines?.accessibility?.screenReaderCompat
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    formData.uxGuidelines?.accessibility?.screenReaderCompat
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Keyboard Navigation Toggle */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-gray-700 block">Keyboard Navigation</label>
                <p className="text-xs text-gray-400 mt-0.5">Support full keyboard navigation with visible focus indicators and logical tab order.</p>
              </div>
              <button
                onClick={() => updateAccessibility('keyboardNav', !formData.uxGuidelines?.accessibility?.keyboardNav)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  formData.uxGuidelines?.accessibility?.keyboardNav
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    formData.uxGuidelines?.accessibility?.keyboardNav
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UXGuidelinesSection;
