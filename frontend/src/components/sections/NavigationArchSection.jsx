import React, { useState } from 'react';
import { Sparkles, Plus, X, Navigation, Map, ArrowRightLeft } from 'lucide-react';

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

export default function NavigationArchSection({
  formData,
  handleInputChange,
  handleNestedChange,
  addToArray,
  removeFromArray,
  showNotification,
  activeAiField,
  generateNavArchitecture
}) {
  const [newPrimaryNav, setNewPrimaryNav] = useState('');
  const [newSecondaryNav, setNewSecondaryNav] = useState('');

  // Add a nav item to primary or secondary
  const addNavItem = (type, value) => {
    if (!value.trim()) return;
    const updated = {
      ...formData.navigationArchitecture,
      [type]: [...(formData.navigationArchitecture[type] || []), value.trim()]
    };
    handleInputChange('navigationArchitecture', updated);
  };

  // Remove a nav item from primary or secondary
  const removeNavItem = (type, index) => {
    const updated = {
      ...formData.navigationArchitecture,
      [type]: formData.navigationArchitecture[type].filter((_, i) => i !== index)
    };
    handleInputChange('navigationArchitecture', updated);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center text-base font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
            2.2
          </span>
          Navigation Architecture
          <HelpTooltip text="Define the primary and secondary navigation structure. Map screen flow connections to ensure intuitive user paths." />
        </label>
        <button
          onClick={async () => {
            const result = await generateNavArchitecture(
              formData.appName,
              formData.appIdea,
              formData.appStructure,
              formData.platform
            );
            if (result?.success && result.data) {
              handleInputChange('navigationArchitecture', {
                ...formData.navigationArchitecture,
                ...result.data
              });
              showNotification('Navigation architecture generated successfully!', 'success');
            }
          }}
          disabled={activeAiField === 'navArchitecture'}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {activeAiField === 'navArchitecture' ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> AI Generate</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Primary Navigation */}
        <div className="bg-white border-2 border-blue-200 rounded-xl overflow-hidden">
          <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
            <h4 className="text-sm font-bold text-blue-700 flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              Primary Navigation
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">Main menu items visible at all times</p>
          </div>

          <div className="p-4">
            {/* Nav Items */}
            <div className="space-y-2 mb-3 min-h-[80px]">
              {(formData.navigationArchitecture.primaryNav || []).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium group"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-200 text-blue-700 rounded flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </span>
                    {item}
                  </span>
                  <button
                    onClick={() => removeNavItem('primaryNav', i)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-600 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {(formData.navigationArchitecture.primaryNav || []).length === 0 && (
                <div className="text-xs text-gray-400 text-center py-4 italic">
                  No primary navigation items
                </div>
              )}
            </div>

            {/* Add Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newPrimaryNav}
                onChange={(e) => setNewPrimaryNav(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addNavItem('primaryNav', newPrimaryNav);
                    setNewPrimaryNav('');
                  }
                }}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 outline-none"
                placeholder="Add nav item..."
              />
              <button
                onClick={() => {
                  addNavItem('primaryNav', newPrimaryNav);
                  setNewPrimaryNav('');
                }}
                className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Map className="w-4 h-4" />
              Secondary Navigation
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">Sub-menus, footer links, and utility pages</p>
          </div>

          <div className="p-4">
            {/* Nav Items */}
            <div className="space-y-2 mb-3 min-h-[80px]">
              {(formData.navigationArchitecture.secondaryNav || []).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium group"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-gray-200 text-gray-600 rounded flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </span>
                    {item}
                  </span>
                  <button
                    onClick={() => removeNavItem('secondaryNav', i)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-600 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {(formData.navigationArchitecture.secondaryNav || []).length === 0 && (
                <div className="text-xs text-gray-400 text-center py-4 italic">
                  No secondary navigation items
                </div>
              )}
            </div>

            {/* Add Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSecondaryNav}
                onChange={(e) => setNewSecondaryNav(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addNavItem('secondaryNav', newSecondaryNav);
                    setNewSecondaryNav('');
                  }
                }}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 outline-none"
                placeholder="Add nav item..."
              />
              <button
                onClick={() => {
                  addNavItem('secondaryNav', newSecondaryNav);
                  setNewSecondaryNav('');
                }}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Flow Connections */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
          <ArrowRightLeft className="w-4 h-4 text-purple-500" />
          Screen Flow Connections
        </h4>
        <textarea
          value={formData.navigationArchitecture.screenFlowConnections || ''}
          onChange={(e) => {
            const updated = {
              ...formData.navigationArchitecture,
              screenFlowConnections: e.target.value
            };
            handleInputChange('navigationArchitecture', updated);
          }}
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none text-sm"
          rows="4"
          placeholder="Describe how screens connect to each other. e.g., Dashboard -> Project List -> Project Detail -> Task View..."
        />
      </div>
    </div>
  );
}
