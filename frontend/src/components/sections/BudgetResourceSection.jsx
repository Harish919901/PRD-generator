import React from 'react';
import { Sparkles, Plus, Trash2, DollarSign, Users, FileText } from 'lucide-react';
import { TEAM_ROLE_TEMPLATE, NEW_HELP_TEXTS } from '../../constants';

const HelpTooltip = ({ text }) => (
  <div className="group relative ml-2">
    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <div className="invisible group-hover:visible absolute z-50 w-64 p-2 text-xs bg-gray-800 text-white rounded-lg -top-2 left-6">{text}</div>
  </div>
);

export default function BudgetResourceSection({
  formData,
  handleInputChange,
  handleNestedChange,
  addToArray,
  removeFromArray,
  handleArrayItemUpdate,
  showNotification,
  activeAiField,
  generateBudgetEstimation,
  generateDocumentationPlan
}) {
  // --- Cost Helpers ---

  const updateCostField = (field, value) => {
    const updated = {
      ...formData.budgetPlanning,
      costs: { ...formData.budgetPlanning.costs, [field]: value }
    };
    handleInputChange('budgetPlanning', updated);
  };

  // --- Team Role Helpers ---

  const addRole = () => {
    const updated = {
      ...formData.budgetPlanning,
      team: {
        ...formData.budgetPlanning.team,
        requiredRoles: [...(formData.budgetPlanning.team.requiredRoles || []), { ...TEAM_ROLE_TEMPLATE }]
      }
    };
    handleInputChange('budgetPlanning', updated);
  };

  const removeRole = (index) => {
    const updated = {
      ...formData.budgetPlanning,
      team: {
        ...formData.budgetPlanning.team,
        requiredRoles: formData.budgetPlanning.team.requiredRoles.filter((_, i) => i !== index)
      }
    };
    handleInputChange('budgetPlanning', updated);
  };

  const updateRole = (index, field, value) => {
    const roles = [...formData.budgetPlanning.team.requiredRoles];
    roles[index] = { ...roles[index], [field]: value };
    const updated = {
      ...formData.budgetPlanning,
      team: { ...formData.budgetPlanning.team, requiredRoles: roles }
    };
    handleInputChange('budgetPlanning', updated);
  };

  const updateTeamField = (field, value) => {
    const updated = {
      ...formData.budgetPlanning,
      team: { ...formData.budgetPlanning.team, [field]: value }
    };
    handleInputChange('budgetPlanning', updated);
  };

  // --- Documentation Helpers ---

  const updateTechnicalDoc = (field, value) => {
    const updated = {
      ...formData.documentationReqs,
      technical: { ...formData.documentationReqs.technical, [field]: value }
    };
    handleInputChange('documentationReqs', updated);
  };

  const updateUserDoc = (field, value) => {
    const updated = {
      ...formData.documentationReqs,
      user: { ...formData.documentationReqs.user, [field]: value }
    };
    handleInputChange('documentationReqs', updated);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center text-base font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
            4.5
          </span>
          Budget, Resources & Documentation
          <HelpTooltip text={NEW_HELP_TEXTS.budgetPlanning} />
        </label>
      </div>

      {/* ===================== Cost Breakdown ===================== */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h4 className="flex items-center text-sm font-semibold text-gray-700">
            <DollarSign className="w-4 h-4 mr-2 text-green-500" />
            Cost Breakdown
          </h4>
          <button
            onClick={async () => {
              const result = await generateBudgetEstimation(
                formData.appName,
                formData.appIdea,
                formData.platform,
                formData.selectedTechStack,
                formData.developmentPhases
              );
              if (result?.success && result.data) {
                if (result.data.budgetPlanning) {
                  handleInputChange('budgetPlanning', result.data.budgetPlanning);
                }
                showNotification('Budget estimation generated successfully!', 'success');
              }
            }}
            disabled={activeAiField === 'budgetEstimation'}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            {activeAiField === 'budgetEstimation' ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> AI Generate Budget</>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Development Costs */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <label className="text-xs font-semibold text-gray-700">Development Costs</label>
            </div>
            <textarea
              value={formData.budgetPlanning?.costs?.developmentCosts || ''}
              onChange={(e) => updateCostField('developmentCosts', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              rows={4}
              placeholder="Estimate development costs (engineering hours, tools, licenses)..."
            />
          </div>

          {/* Operational Costs */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5 text-green-600" />
              </div>
              <label className="text-xs font-semibold text-gray-700">Operational Costs</label>
            </div>
            <textarea
              value={formData.budgetPlanning?.costs?.operationalCosts || ''}
              onChange={(e) => updateCostField('operationalCosts', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              rows={4}
              placeholder="Estimate operational costs (hosting, monitoring, maintenance)..."
            />
          </div>

          {/* Marketing Costs */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <label className="text-xs font-semibold text-gray-700">Marketing Costs</label>
            </div>
            <textarea
              value={formData.budgetPlanning?.costs?.marketingCosts || ''}
              onChange={(e) => updateCostField('marketingCosts', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              rows={4}
              placeholder="Estimate marketing costs (campaigns, content, launch activities)..."
            />
          </div>
        </div>
      </div>

      {/* ===================== Team Requirements ===================== */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h4 className="flex items-center text-sm font-semibold text-gray-700">
            <Users className="w-4 h-4 mr-2 text-blue-500" />
            Team Requirements
          </h4>
          <button
            onClick={addRole}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Role
          </button>
        </div>

        {/* Required Roles Table */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-600 mb-2 block">Required Roles</label>

          {(formData.budgetPlanning?.team?.requiredRoles || []).length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No roles defined yet. Click "Add Role" or use AI Generate.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 px-2.5 py-1.5">
                <div className="col-span-5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Role</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Count</span>
                </div>
                <div className="col-span-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Timing</span>
                </div>
                <div className="col-span-1"></div>
              </div>

              {formData.budgetPlanning.team.requiredRoles.map((role, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white border border-gray-200 rounded-lg p-2.5">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={role.role || ''}
                      onChange={(e) => updateRole(idx, 'role', e.target.value)}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      placeholder="e.g., Frontend Developer"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={role.count || 1}
                      onChange={(e) => updateRole(idx, 'count', parseInt(e.target.value) || 1)}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-blue-400 outline-none text-center"
                    />
                  </div>
                  <div className="col-span-4">
                    <select
                      value={role.timing || 'full-time'}
                      onChange={(e) => updateRole(idx, 'timing', e.target.value)}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-blue-400 outline-none"
                    >
                      <option value="full-time">Full-Time</option>
                      <option value="part-time">Part-Time</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => removeRole(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scaling Timeline & Contractor Needs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Scaling Timeline</label>
            <textarea
              value={formData.budgetPlanning?.team?.scalingTimeline || ''}
              onChange={(e) => updateTeamField('scalingTimeline', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              rows={3}
              placeholder="Describe team scaling plan over time (e.g., Phase 1: 3 devs, Phase 2: 5 devs + QA)..."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Contractor Needs</label>
            <textarea
              value={formData.budgetPlanning?.team?.contractorNeeds || ''}
              onChange={(e) => updateTeamField('contractorNeeds', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              rows={3}
              placeholder="Describe contractor or freelancer needs (specializations, duration, budget)..."
            />
          </div>
        </div>
      </div>

      {/* ===================== Documentation Requirements ===================== */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="flex items-center text-sm font-semibold text-gray-700">
            <FileText className="w-4 h-4 mr-2 text-blue-500" />
            Documentation Requirements
            <HelpTooltip text={NEW_HELP_TEXTS.documentationReqs} />
          </h4>
          <button
            onClick={async () => {
              const result = await generateDocumentationPlan(
                formData.appName,
                formData.appIdea,
                formData.platform,
                formData.selectedTechStack
              );
              if (result?.success && result.data) {
                if (result.data.documentationReqs) {
                  handleInputChange('documentationReqs', result.data.documentationReqs);
                }
                showNotification('Documentation plan generated successfully!', 'success');
              }
            }}
            disabled={activeAiField === 'documentationPlan'}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            {activeAiField === 'documentationPlan' ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> AI Generate Docs Plan</>
            )}
          </button>
        </div>

        {/* Technical Documentation */}
        <div className="mb-4">
          <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Technical Documentation
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">API Docs</label>
              <textarea
                value={formData.documentationReqs?.technical?.apiDocs || ''}
                onChange={(e) => updateTechnicalDoc('apiDocs', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                rows={3}
                placeholder="API documentation plan (Swagger/OpenAPI specs, endpoint docs, auth guides)..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">DB Schema Docs</label>
              <textarea
                value={formData.documentationReqs?.technical?.dbSchemaDocs || ''}
                onChange={(e) => updateTechnicalDoc('dbSchemaDocs', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                rows={3}
                placeholder="Database schema documentation (ERD, migration guides, data dictionary)..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Deployment Guides</label>
              <textarea
                value={formData.documentationReqs?.technical?.deploymentGuides || ''}
                onChange={(e) => updateTechnicalDoc('deploymentGuides', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                rows={3}
                placeholder="Deployment documentation (setup guides, env configs, runbooks)..."
              />
            </div>
          </div>
        </div>

        {/* User Documentation */}
        <div>
          <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            User Documentation
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Onboarding Materials</label>
              <textarea
                value={formData.documentationReqs?.user?.onboardingMaterials || ''}
                onChange={(e) => updateUserDoc('onboardingMaterials', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                rows={3}
                placeholder="Onboarding materials (welcome guides, quick-start tutorials, walkthroughs)..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Help System</label>
              <textarea
                value={formData.documentationReqs?.user?.helpSystem || ''}
                onChange={(e) => updateUserDoc('helpSystem', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                rows={3}
                placeholder="Help system plan (knowledge base, FAQs, in-app tooltips, chatbot support)..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Training Resources</label>
              <textarea
                value={formData.documentationReqs?.user?.trainingResources || ''}
                onChange={(e) => updateUserDoc('trainingResources', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                rows={3}
                placeholder="Training resources (video tutorials, webinars, certification programs)..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
