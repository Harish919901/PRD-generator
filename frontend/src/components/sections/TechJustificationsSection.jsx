import React from 'react';
import { Sparkles } from 'lucide-react';

const HelpTooltip = ({ text }) => (
  <div className="group relative ml-2">
    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <div className="invisible group-hover:visible absolute z-50 w-64 p-2 text-xs bg-gray-800 text-white rounded-lg -top-2 left-6">{text}</div>
  </div>
);

const TECH_CATEGORY_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  css: 'CSS Framework',
  llm: 'LLM Engine',
  mcp: 'MCP Integrations',
  testing: 'Testing',
  deployment: 'Deployment',
  reporting: 'Enterprise Reporting',
  apis: 'APIs',
  localLlm: 'Local LLM',
  evalTools: 'Eval Tools',
  additional: 'Additional Tools'
};

const TechJustificationsSection = ({
  formData,
  handleInputChange,
  showNotification,
  activeAiField,
  generateTechJustifications
}) => {
  const activeCategories = Object.entries(formData.selectedTechStack || {}).filter(
    ([, items]) => Array.isArray(items) && items.length > 0
  );

  const updateJustification = (category, value) => {
    handleInputChange('techStackJustifications', {
      ...formData.techStackJustifications,
      [category]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <label className="flex items-center text-lg font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">2.3</span>
          Technology Justifications
          <HelpTooltip text="Provide rationale for each technology choice. Consider team expertise, scalability, ecosystem maturity, and cost." />
        </label>
        <button
          onClick={async () => {
            const result = await generateTechJustifications(
              formData.selectedTechStack,
              formData.appName,
              formData.platform,
              formData.numberOfUsers
            );
            if (result?.success && result.data) {
              const updatedJustifications = { ...formData.techStackJustifications };
              Object.entries(result.data).forEach(([category, justification]) => {
                if (justification) {
                  updatedJustifications[category] = justification;
                }
              });
              handleInputChange('techStackJustifications', updatedJustifications);
              showNotification('Technology justifications generated successfully!', 'success');
            }
          }}
          disabled={activeAiField === 'techJustifications'}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {activeAiField === 'techJustifications' ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> AI Generate All</>
          )}
        </button>
      </div>

      {/* Category Justifications */}
      {activeCategories.length === 0 ? (
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500 text-sm">No technologies selected yet. Go to the Technology Stack section above to select technologies first.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeCategories.map(([category, items]) => (
            <div key={category} className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800 text-sm">
                  {TECH_CATEGORY_LABELS[category] || category}
                </h4>
              </div>

              {/* Selected items as chips */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* Justification textarea */}
              <textarea
                value={formData.techStackJustifications?.[category] || ''}
                onChange={(e) => updateJustification(category, e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm resize-none"
                rows="3"
                placeholder={`Why did you choose these ${TECH_CATEGORY_LABELS[category]?.toLowerCase() || category} technologies? Consider team expertise, scalability, and ecosystem maturity...`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechJustificationsSection;
