import React from 'react';
import { Sparkles, Layout } from 'lucide-react';

const HelpTooltip = ({ text }) => (
  <div className="group relative ml-2">
    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <div className="invisible group-hover:visible absolute z-50 w-64 p-2 text-xs bg-gray-800 text-white rounded-lg -top-2 left-6">{text}</div>
  </div>
);

const BUTTON_VARIANTS = [
  { key: 'primary', label: 'Primary', borderColor: 'border-blue-200', bgColor: 'bg-blue-50' },
  { key: 'secondary', label: 'Secondary', borderColor: 'border-gray-200', bgColor: 'bg-gray-50' },
  { key: 'ghost', label: 'Ghost', borderColor: 'border-gray-200', bgColor: 'bg-white' }
];

const ComponentSpecsSection = ({
  formData,
  handleInputChange,
  handleNestedChange,
  showNotification,
  activeAiField,
  generateDesignSystem
}) => {
  const updateButtonStyle = (variant, key, value) => {
    handleInputChange('componentSpecs', {
      ...formData.componentSpecs,
      buttonStyles: {
        ...formData.componentSpecs.buttonStyles,
        [variant]: {
          ...formData.componentSpecs.buttonStyles[variant],
          [key]: value
        }
      }
    });
  };

  const updateFormInputSpecs = (key, value) => {
    handleInputChange('componentSpecs', {
      ...formData.componentSpecs,
      formInputSpecs: {
        ...formData.componentSpecs.formInputSpecs,
        [key]: value
      }
    });
  };

  const updateNavComponents = (key, value) => {
    handleInputChange('componentSpecs', {
      ...formData.componentSpecs,
      navComponents: {
        ...formData.componentSpecs.navComponents,
        [key]: value
      }
    });
  };

  const updateDataDisplayComponents = (key, value) => {
    handleInputChange('componentSpecs', {
      ...formData.componentSpecs,
      dataDisplayComponents: {
        ...formData.componentSpecs.dataDisplayComponents,
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
            3.2
          </span>
          Component Specifications
          <HelpTooltip text="Define visual specifications for core UI components including buttons, form inputs, navigation, and data display elements. Ensures design consistency." />
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
              if (result.data.componentSpecs) {
                handleInputChange('componentSpecs', {
                  ...formData.componentSpecs,
                  ...result.data.componentSpecs
                });
              }
              showNotification('Component specs generated successfully!', 'success');
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

      {/* Button Styles */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <Layout className="w-4 h-4 mr-2 text-blue-500" />
          Button Styles
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BUTTON_VARIANTS.map(({ key, label, borderColor, bgColor }) => (
            <div key={key} className={`rounded-xl border-2 ${borderColor} p-4 hover:border-blue-300 transition-colors`}>
              <h5 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">{label}</h5>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(formData.componentSpecs?.buttonStyles?.[key]?.bgColor) || '#0093B6'}
                      onChange={(e) => updateButtonStyle(key, 'bgColor', e.target.value)}
                      className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={(formData.componentSpecs?.buttonStyles?.[key]?.bgColor) || ''}
                      onChange={(e) => updateButtonStyle(key, 'bgColor', e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      placeholder="#0093B6"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(formData.componentSpecs?.buttonStyles?.[key]?.textColor) || '#ffffff'}
                      onChange={(e) => updateButtonStyle(key, 'textColor', e.target.value)}
                      className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={(formData.componentSpecs?.buttonStyles?.[key]?.textColor) || ''}
                      onChange={(e) => updateButtonStyle(key, 'textColor', e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Border Radius</label>
                  <input
                    type="text"
                    value={(formData.componentSpecs?.buttonStyles?.[key]?.borderRadius) || ''}
                    onChange={(e) => updateButtonStyle(key, 'borderRadius', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="e.g., 8px"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Padding</label>
                  <input
                    type="text"
                    value={(formData.componentSpecs?.buttonStyles?.[key]?.padding) || ''}
                    onChange={(e) => updateButtonStyle(key, 'padding', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="e.g., 12px 24px"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Input Specs */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Form Input Specs
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-3 hover:border-blue-200 transition-colors">
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Border Style</label>
            <input
              type="text"
              value={formData.componentSpecs?.formInputSpecs?.borderStyle || ''}
              onChange={(e) => updateFormInputSpecs('borderStyle', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="e.g., 1px solid #d1d5db"
            />
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-3 hover:border-blue-200 transition-colors">
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Focus State</label>
            <input
              type="text"
              value={formData.componentSpecs?.formInputSpecs?.focusState || ''}
              onChange={(e) => updateFormInputSpecs('focusState', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="e.g., 2px solid #0093B6 with ring"
            />
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-3 hover:border-blue-200 transition-colors">
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Error State</label>
            <input
              type="text"
              value={formData.componentSpecs?.formInputSpecs?.errorState || ''}
              onChange={(e) => updateFormInputSpecs('errorState', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="e.g., Red border with error message below"
            />
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-3 hover:border-blue-200 transition-colors">
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Disabled State</label>
            <input
              type="text"
              value={formData.componentSpecs?.formInputSpecs?.disabledState || ''}
              onChange={(e) => updateFormInputSpecs('disabledState', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="e.g., 50% opacity, no pointer events"
            />
          </div>
        </div>
      </div>

      {/* Navigation Components */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Navigation Components
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-3 hover:border-blue-200 transition-colors">
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Header Style</label>
            <textarea
              value={formData.componentSpecs?.navComponents?.headerStyle || ''}
              onChange={(e) => updateNavComponents('headerStyle', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              rows="3"
              placeholder="Describe header layout, colors, fixed/sticky behavior..."
            />
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-3 hover:border-blue-200 transition-colors">
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Sidebar Style</label>
            <textarea
              value={formData.componentSpecs?.navComponents?.sidebarStyle || ''}
              onChange={(e) => updateNavComponents('sidebarStyle', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              rows="3"
              placeholder="Describe sidebar width, collapse behavior, active states..."
            />
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-3 hover:border-blue-200 transition-colors">
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Mobile Menu Style</label>
            <textarea
              value={formData.componentSpecs?.navComponents?.mobileMenuStyle || ''}
              onChange={(e) => updateNavComponents('mobileMenuStyle', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              rows="3"
              placeholder="Describe mobile menu type (hamburger, bottom nav), animations..."
            />
          </div>
        </div>
      </div>

      {/* Data Display Components */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Data Display Components
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-3 hover:border-blue-200 transition-colors">
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Table Style</label>
            <textarea
              value={formData.componentSpecs?.dataDisplayComponents?.tableStyle || ''}
              onChange={(e) => updateDataDisplayComponents('tableStyle', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              rows="3"
              placeholder="Describe table styling: borders, striped rows, hover states, pagination..."
            />
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-3 hover:border-blue-200 transition-colors">
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Card Style</label>
            <textarea
              value={formData.componentSpecs?.dataDisplayComponents?.cardStyle || ''}
              onChange={(e) => updateDataDisplayComponents('cardStyle', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              rows="3"
              placeholder="Describe card styling: shadows, borders, padding, hover effects..."
            />
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-3 hover:border-blue-200 transition-colors">
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">List Style</label>
            <textarea
              value={formData.componentSpecs?.dataDisplayComponents?.listStyle || ''}
              onChange={(e) => updateDataDisplayComponents('listStyle', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              rows="3"
              placeholder="Describe list styling: spacing, dividers, item layout, icons..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentSpecsSection;
