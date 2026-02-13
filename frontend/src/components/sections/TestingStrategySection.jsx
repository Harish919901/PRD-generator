import React, { useState } from 'react';
import { Sparkles, Plus, X, TestTube, Shield, Search, Code } from 'lucide-react';
import { NEW_HELP_TEXTS } from '../../constants';

const HelpTooltip = ({ text }) => (
  <div className="group relative ml-2">
    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <div className="invisible group-hover:visible absolute z-50 w-64 p-2 text-xs bg-gray-800 text-white rounded-lg -top-2 left-6">{text}</div>
  </div>
);

export default function TestingStrategySection({
  formData,
  handleInputChange,
  handleNestedChange,
  addToArray,
  removeFromArray,
  handleArrayItemUpdate,
  showNotification,
  activeAiField,
  generateTestingStrategy
}) {
  const [newCriticalPath, setNewCriticalPath] = useState('');

  // --- E2E Critical Paths Helpers ---

  const addCriticalPath = () => {
    if (!newCriticalPath.trim()) return;
    const currentPaths = formData.testingStrategy?.e2eTesting?.criticalPaths || [];
    const updated = {
      ...formData.testingStrategy,
      e2eTesting: {
        ...formData.testingStrategy.e2eTesting,
        criticalPaths: [...currentPaths, newCriticalPath.trim()]
      }
    };
    handleInputChange('testingStrategy', updated);
    setNewCriticalPath('');
  };

  const removeCriticalPath = (index) => {
    const updated = {
      ...formData.testingStrategy,
      e2eTesting: {
        ...formData.testingStrategy.e2eTesting,
        criticalPaths: formData.testingStrategy.e2eTesting.criticalPaths.filter((_, i) => i !== index)
      }
    };
    handleInputChange('testingStrategy', updated);
  };

  // --- Deep nested change helper ---

  const updateTestingField = (section, field, value) => {
    const updated = {
      ...formData.testingStrategy,
      [section]: {
        ...formData.testingStrategy[section],
        [field]: value
      }
    };
    handleInputChange('testingStrategy', updated);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center text-base font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
            4.3
          </span>
          Testing Strategy
          <HelpTooltip text={NEW_HELP_TEXTS.testingStrategy} />
        </label>
        <button
          onClick={async () => {
            const result = await generateTestingStrategy(
              formData.appName,
              formData.appIdea,
              formData.platform,
              formData.selectedTechStack,
              formData.developmentPhases
            );
            if (result?.success && result.data) {
              if (result.data.testingStrategy) {
                handleInputChange('testingStrategy', result.data.testingStrategy);
              }
              if (result.data.qaProcess) {
                handleInputChange('qaProcess', result.data.qaProcess);
              }
              showNotification('Testing strategy generated successfully!', 'success');
            }
          }}
          disabled={activeAiField === 'testingStrategy'}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {activeAiField === 'testingStrategy' ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> AI Generate</>
          )}
        </button>
      </div>

      {/* Testing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Unit Testing Card */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-700">Unit Testing</h4>
          </div>
          <div className="mb-3">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Coverage Target</label>
            <input
              type="text"
              value={formData.testingStrategy?.unitTesting?.target || ''}
              onChange={(e) => updateTestingField('unitTesting', 'target', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="e.g., 80%"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Tools</label>
            <input
              type="text"
              value={formData.testingStrategy?.unitTesting?.tools || ''}
              onChange={(e) => updateTestingField('unitTesting', 'tools', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="e.g., Jest, Vitest"
            />
          </div>
        </div>

        {/* Integration Testing Card */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-purple-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-700">Integration Testing</h4>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Specifications</label>
            <textarea
              value={formData.testingStrategy?.integrationTesting?.specs || ''}
              onChange={(e) => updateTestingField('integrationTesting', 'specs', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              rows={4}
              placeholder="Describe integration testing approach, API testing, service-to-service testing..."
            />
          </div>
        </div>

        {/* E2E Testing Card */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
              <TestTube className="w-4 h-4 text-green-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-700">E2E Testing</h4>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Critical Paths</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(formData.testingStrategy?.e2eTesting?.criticalPaths || []).map((path, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                  {path}
                  <button onClick={() => removeCriticalPath(idx)} className="hover:text-green-900 ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCriticalPath}
                onChange={(e) => setNewCriticalPath(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCriticalPath(); } }}
                className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-blue-400 outline-none"
                placeholder="Add a critical path..."
              />
              <button
                onClick={addCriticalPath}
                className="px-2.5 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QA Process */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <Shield className="w-4 h-4 mr-2 text-blue-500" />
          QA Process
        </h4>

        <div className="space-y-4">
          {/* Code Review Process */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Code Review Process</label>
            <textarea
              value={formData.qaProcess?.codeReviewProcess || ''}
              onChange={(e) => handleNestedChange('qaProcess', 'codeReviewProcess', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              rows={3}
              placeholder="Describe the code review process, tools, and standards (e.g., PR review requirements, linting rules, approval workflows)..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Performance Testing */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Performance Testing</label>
              <textarea
                value={formData.qaProcess?.performanceTesting || ''}
                onChange={(e) => handleNestedChange('qaProcess', 'performanceTesting', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                rows={3}
                placeholder="Describe performance testing approach (load testing, stress testing, benchmarks)..."
              />
            </div>

            {/* Security Testing */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Security Testing</label>
              <textarea
                value={formData.qaProcess?.securityTesting || ''}
                onChange={(e) => handleNestedChange('qaProcess', 'securityTesting', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                rows={3}
                placeholder="Describe security testing strategy (penetration testing, vulnerability scanning, OWASP)..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
