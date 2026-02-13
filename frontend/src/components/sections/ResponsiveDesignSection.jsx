import React from 'react';
import { Sparkles, Smartphone, Tablet, Monitor, X } from 'lucide-react';
import { BROWSER_OPTIONS } from '../../constants';

const HelpTooltip = ({ text }) => (
  <div className="group relative ml-2">
    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <div className="invisible group-hover:visible absolute z-50 w-64 p-2 text-xs bg-gray-800 text-white rounded-lg -top-2 left-6">{text}</div>
  </div>
);

const BREAKPOINT_CONFIG = [
  { key: 'mobile', label: 'Mobile', icon: Smartphone, color: 'blue', placeholder: '640px' },
  { key: 'tablet', label: 'Tablet', icon: Tablet, color: 'purple', placeholder: '768px' },
  { key: 'desktop', label: 'Desktop', icon: Monitor, color: 'green', placeholder: '1024px' }
];

const ResponsiveDesignSection = ({
  formData,
  handleInputChange,
  handleNestedChange,
  showNotification,
  activeAiField,
  generateUXGuidelines
}) => {
  const updateBreakpoint = (breakpointKey, field, value) => {
    handleInputChange('responsiveDesign', {
      ...formData.responsiveDesign,
      breakpoints: {
        ...formData.responsiveDesign.breakpoints,
        [breakpointKey]: {
          ...formData.responsiveDesign.breakpoints[breakpointKey],
          [field]: value
        }
      }
    });
  };

  const updateCrossPlatform = (key, value) => {
    handleInputChange('responsiveDesign', {
      ...formData.responsiveDesign,
      crossPlatform: {
        ...formData.responsiveDesign.crossPlatform,
        [key]: value
      }
    });
  };

  const toggleBrowser = (browser) => {
    const current = formData.responsiveDesign?.crossPlatform?.browserCompat || [];
    if (current.includes(browser)) {
      updateCrossPlatform('browserCompat', current.filter(b => b !== browser));
    } else {
      updateCrossPlatform('browserCompat', [...current, browser]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <label className="flex items-center text-base font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
            3.5
          </span>
          Responsive Design
          <HelpTooltip text="Configure responsive breakpoints with layout descriptions for each device size, browser compatibility requirements, and mobile vs. web strategy." />
        </label>
        <button
          onClick={async () => {
            const result = await generateUXGuidelines(
              formData.appName,
              formData.platform,
              formData.primaryColor,
              formData.responsiveDesign
            );
            if (result?.success && result.data) {
              if (result.data.responsiveDesign) {
                handleInputChange('responsiveDesign', {
                  ...formData.responsiveDesign,
                  ...result.data.responsiveDesign
                });
              }
              showNotification('Responsive design specs generated successfully!', 'success');
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

      {/* Breakpoints Configuration */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Breakpoints Configuration
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BREAKPOINT_CONFIG.map(({ key, label, icon: Icon, color, placeholder }) => (
            <div key={key} className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 text-${color}-500`} />
                </div>
                <h5 className="text-sm font-bold text-gray-700">{label}</h5>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Width</label>
                  <input
                    type="text"
                    value={(formData.responsiveDesign?.breakpoints?.[key]?.width) || ''}
                    onChange={(e) => updateBreakpoint(key, 'width', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder={placeholder}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Layout Description</label>
                  <textarea
                    value={(formData.responsiveDesign?.breakpoints?.[key]?.layout) || ''}
                    onChange={(e) => updateBreakpoint(key, 'layout', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                    rows="3"
                    placeholder={`Describe the ${label.toLowerCase()} layout: column stacking, sidebar behavior, navigation changes...`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Platform */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          Cross-Platform
        </h4>
        <div className="space-y-4">
          {/* Browser Compatibility */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-blue-200 transition-colors">
            <label className="text-xs font-semibold text-gray-600 mb-3 block">Browser Compatibility</label>
            <div className="flex flex-wrap gap-2">
              {BROWSER_OPTIONS.map((browser) => {
                const isSelected = (formData.responsiveDesign?.crossPlatform?.browserCompat || []).includes(browser);
                return (
                  <button
                    key={browser}
                    onClick={() => toggleBrowser(browser)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {browser}
                    {isSelected && <X className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
            {(formData.responsiveDesign?.crossPlatform?.browserCompat || []).length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                {(formData.responsiveDesign?.crossPlatform?.browserCompat || []).length} browser{(formData.responsiveDesign?.crossPlatform?.browserCompat || []).length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Mobile vs Web */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Mobile vs Web Strategy</label>
            <textarea
              value={formData.responsiveDesign?.crossPlatform?.mobileVsWeb || ''}
              onChange={(e) => updateCrossPlatform('mobileVsWeb', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none text-sm"
              rows="4"
              placeholder="Describe the differences between your mobile and web experiences: feature parity, touch vs. click interactions, offline capabilities, performance considerations..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveDesignSection;
