import React, { useState } from 'react';
import { Plus, X, Layout, Monitor } from 'lucide-react';

const HelpTooltip = ({ text }) => (
  <div className="group relative ml-2">
    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <div className="invisible group-hover:visible absolute z-50 w-64 p-2 text-xs bg-gray-800 text-white rounded-lg -top-2 left-6">{text}</div>
  </div>
);

const BREAKPOINT_LABELS = {
  mobile: { label: 'Mobile', icon: '📱' },
  tablet: { label: 'Tablet', icon: '📋' },
  desktop: { label: 'Desktop', icon: '🖥️' },
  wide: { label: 'Wide', icon: '🖥️' }
};

const DashboardLayoutSection = ({
  formData,
  handleInputChange,
  handleNestedChange,
  showNotification,
  activeAiField
}) => {
  const [newElement, setNewElement] = useState('');

  const updateDashboardLayout = (key, value) => {
    handleInputChange('dashboardLayout', {
      ...formData.dashboardLayout,
      [key]: value
    });
  };

  const updateBreakpoint = (breakpointKey, value) => {
    handleInputChange('dashboardLayout', {
      ...formData.dashboardLayout,
      responsiveBreakpoints: {
        ...formData.dashboardLayout.responsiveBreakpoints,
        [breakpointKey]: value
      }
    });
  };

  const addInteractiveElement = () => {
    const trimmed = newElement.trim();
    if (!trimmed) return;
    const current = formData.dashboardLayout?.interactiveElements || [];
    if (current.includes(trimmed)) {
      showNotification('This element already exists.', 'warning');
      return;
    }
    handleInputChange('dashboardLayout', {
      ...formData.dashboardLayout,
      interactiveElements: [...current, trimmed]
    });
    setNewElement('');
  };

  const removeInteractiveElement = (index) => {
    const current = formData.dashboardLayout?.interactiveElements || [];
    handleInputChange('dashboardLayout', {
      ...formData.dashboardLayout,
      interactiveElements: current.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <label className="flex items-center text-base font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
            3.3
          </span>
          Dashboard Layout
          <HelpTooltip text="Define the grid system, responsive breakpoints, information hierarchy, and interactive elements for your application's dashboard and main layout." />
        </label>
      </div>

      {/* Grid System */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <Layout className="w-4 h-4 mr-2 text-blue-500" />
          Grid System
        </h4>
        <input
          type="text"
          value={formData.dashboardLayout?.gridSystem || ''}
          onChange={(e) => updateDashboardLayout('gridSystem', e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm"
          placeholder="e.g., 12-column CSS Grid with 24px gutters"
        />
      </div>

      {/* Responsive Breakpoints */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <Monitor className="w-4 h-4 mr-2 text-blue-500" />
          Responsive Breakpoints
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(BREAKPOINT_LABELS).map(([key, { label, icon }]) => (
            <div key={key} className="bg-white rounded-xl border-2 border-gray-200 p-3 hover:border-blue-200 transition-colors">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center">
                <span className="mr-1.5">{icon}</span> {label}
              </label>
              <input
                type="text"
                value={(formData.dashboardLayout?.responsiveBreakpoints || {})[key] || ''}
                onChange={(e) => updateBreakpoint(key, e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                placeholder="e.g., 768px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Information Hierarchy */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Information Hierarchy
        </h4>
        <textarea
          value={formData.dashboardLayout?.infoHierarchy || ''}
          onChange={(e) => updateDashboardLayout('infoHierarchy', e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none text-sm"
          rows="4"
          placeholder="Describe the information hierarchy: What content takes priority? How are sections ordered? What data is above the fold vs. requires scrolling?"
        />
      </div>

      {/* Interactive Elements */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          Interactive Elements
        </h4>

        {/* Existing elements as chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          {(formData.dashboardLayout?.interactiveElements || []).map((element, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
            >
              {element}
              <button
                onClick={() => removeInteractiveElement(idx)}
                className="hover:text-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        {(formData.dashboardLayout?.interactiveElements || []).length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mb-3">
            <p className="text-sm text-gray-400">No interactive elements added yet.</p>
          </div>
        )}

        {/* Add new element */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newElement}
            onChange={(e) => setNewElement(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addInteractiveElement();
              }
            }}
            className="flex-1 px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            placeholder="Add interactive element (e.g., Drag-and-drop widgets, Filter panels, Search bar)..."
          />
          <button
            onClick={addInteractiveElement}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayoutSection;
