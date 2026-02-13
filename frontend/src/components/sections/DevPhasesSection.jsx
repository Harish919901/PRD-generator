import React, { useState } from 'react';
import { Sparkles, Plus, X, Trash2, Calendar, AlertTriangle, Layers } from 'lucide-react';
import { DEV_PHASE_TEMPLATE, RISK_TEMPLATE, NEW_HELP_TEXTS } from '../../constants';

const HelpTooltip = ({ text }) => (
  <div className="group relative ml-2">
    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <div className="invisible group-hover:visible absolute z-50 w-64 p-2 text-xs bg-gray-800 text-white rounded-lg -top-2 left-6">{text}</div>
  </div>
);

export default function DevPhasesSection({
  formData,
  handleInputChange,
  handleNestedChange,
  addToArray,
  removeFromArray,
  handleArrayItemUpdate,
  showNotification,
  activeAiField,
  generateDevPhases,
  generateImplementationRoadmap
}) {
  const [newDeliverable, setNewDeliverable] = useState({});
  const [newDependency, setNewDependency] = useState({});
  const [newFeatureOrder, setNewFeatureOrder] = useState('');
  const [newTestMilestone, setNewTestMilestone] = useState('');

  // --- Development Phases Helpers ---

  const addPhase = () => {
    handleInputChange('developmentPhases', [
      ...formData.developmentPhases,
      { ...DEV_PHASE_TEMPLATE, deliverables: [], dependencies: [] }
    ]);
  };

  const removePhase = (index) => {
    const updated = formData.developmentPhases.filter((_, i) => i !== index);
    handleInputChange('developmentPhases', updated);
  };

  const updatePhaseField = (index, field, value) => {
    const updated = [...formData.developmentPhases];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('developmentPhases', updated);
  };

  const addDeliverable = (phaseIndex) => {
    const val = (newDeliverable[phaseIndex] || '').trim();
    if (!val) return;
    const phases = [...formData.developmentPhases];
    phases[phaseIndex] = { ...phases[phaseIndex], deliverables: [...phases[phaseIndex].deliverables, val] };
    handleInputChange('developmentPhases', phases);
    setNewDeliverable({ ...newDeliverable, [phaseIndex]: '' });
  };

  const removeDeliverable = (phaseIndex, itemIndex) => {
    const phases = [...formData.developmentPhases];
    phases[phaseIndex] = {
      ...phases[phaseIndex],
      deliverables: phases[phaseIndex].deliverables.filter((_, i) => i !== itemIndex)
    };
    handleInputChange('developmentPhases', phases);
  };

  const addDependencyItem = (phaseIndex) => {
    const val = (newDependency[phaseIndex] || '').trim();
    if (!val) return;
    const phases = [...formData.developmentPhases];
    phases[phaseIndex] = { ...phases[phaseIndex], dependencies: [...phases[phaseIndex].dependencies, val] };
    handleInputChange('developmentPhases', phases);
    setNewDependency({ ...newDependency, [phaseIndex]: '' });
  };

  const removeDependencyItem = (phaseIndex, itemIndex) => {
    const phases = [...formData.developmentPhases];
    phases[phaseIndex] = {
      ...phases[phaseIndex],
      dependencies: phases[phaseIndex].dependencies.filter((_, i) => i !== itemIndex)
    };
    handleInputChange('developmentPhases', phases);
  };

  // --- Roadmap Helpers ---

  const addWeeklyScheduleItem = () => {
    const schedule = [...(formData.implementationRoadmap.weeklySchedule || [])];
    schedule.push({ week: '', tasks: '' });
    handleNestedChange('implementationRoadmap', 'weeklySchedule', schedule);
  };

  const removeWeeklyScheduleItem = (index) => {
    const schedule = formData.implementationRoadmap.weeklySchedule.filter((_, i) => i !== index);
    handleNestedChange('implementationRoadmap', 'weeklySchedule', schedule);
  };

  const updateWeeklyScheduleItem = (index, field, value) => {
    const schedule = [...formData.implementationRoadmap.weeklySchedule];
    schedule[index] = { ...schedule[index], [field]: value };
    handleNestedChange('implementationRoadmap', 'weeklySchedule', schedule);
  };

  const addFeatureOrderItem = () => {
    if (!newFeatureOrder.trim()) return;
    const featureOrder = [...(formData.implementationRoadmap.featureOrder || []), newFeatureOrder.trim()];
    handleNestedChange('implementationRoadmap', 'featureOrder', featureOrder);
    setNewFeatureOrder('');
  };

  const removeFeatureOrderItem = (index) => {
    const featureOrder = formData.implementationRoadmap.featureOrder.filter((_, i) => i !== index);
    handleNestedChange('implementationRoadmap', 'featureOrder', featureOrder);
  };

  const addTestMilestoneItem = () => {
    if (!newTestMilestone.trim()) return;
    const testMilestones = [...(formData.implementationRoadmap.testMilestones || []), newTestMilestone.trim()];
    handleNestedChange('implementationRoadmap', 'testMilestones', testMilestones);
    setNewTestMilestone('');
  };

  const removeTestMilestoneItem = (index) => {
    const testMilestones = formData.implementationRoadmap.testMilestones.filter((_, i) => i !== index);
    handleNestedChange('implementationRoadmap', 'testMilestones', testMilestones);
  };

  // --- Risk Assessment Helpers ---

  const addRisk = (type) => {
    const risks = [...(formData.riskAssessment[type] || [])];
    risks.push({ ...RISK_TEMPLATE });
    handleNestedChange('riskAssessment', type, risks);
  };

  const removeRisk = (type, index) => {
    const risks = formData.riskAssessment[type].filter((_, i) => i !== index);
    handleNestedChange('riskAssessment', type, risks);
  };

  const updateRisk = (type, index, field, value) => {
    const risks = [...formData.riskAssessment[type]];
    risks[index] = { ...risks[index], [field]: value };
    handleNestedChange('riskAssessment', type, risks);
  };

  // --- Risk Table Renderer ---

  const renderRiskTable = (type, label, iconColor) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-xs font-semibold text-gray-700 flex items-center">
          <AlertTriangle className={`w-3.5 h-3.5 mr-1.5 ${iconColor}`} />
          {label}
        </h5>
        <button
          onClick={() => addRisk(type)}
          className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
        >
          <Plus className="w-3 h-3" /> Add Risk
        </button>
      </div>

      {(formData.riskAssessment[type] || []).length === 0 ? (
        <div className="text-center py-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-xs text-gray-400">No {label.toLowerCase()} defined yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {formData.riskAssessment[type].map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-start bg-white border border-gray-200 rounded-lg p-2.5">
              <div className="col-span-4">
                <label className="text-[10px] font-semibold text-gray-500 mb-0.5 block">Risk</label>
                <input
                  type="text"
                  value={item.risk || ''}
                  onChange={(e) => updateRisk(type, idx, 'risk', e.target.value)}
                  className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="Describe the risk..."
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-semibold text-gray-500 mb-0.5 block">Likelihood</label>
                <select
                  value={item.likelihood || 'medium'}
                  onChange={(e) => updateRisk(type, idx, 'likelihood', e.target.value)}
                  className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-blue-400 outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-semibold text-gray-500 mb-0.5 block">Impact</label>
                <select
                  value={item.impact || 'medium'}
                  onChange={(e) => updateRisk(type, idx, 'impact', e.target.value)}
                  className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-blue-400 outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="col-span-3">
                <label className="text-[10px] font-semibold text-gray-500 mb-0.5 block">Mitigation</label>
                <input
                  type="text"
                  value={item.mitigation || ''}
                  onChange={(e) => updateRisk(type, idx, 'mitigation', e.target.value)}
                  className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="Mitigation plan..."
                />
              </div>
              <div className="col-span-1 flex items-end justify-center pb-0.5">
                <button
                  onClick={() => removeRisk(type, idx)}
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
  );

  return (
    <div>
      {/* ===================== 4.1 Development Phases & Roadmap ===================== */}
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center text-base font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
            4.1
          </span>
          Development Phases & Roadmap
          <HelpTooltip text={NEW_HELP_TEXTS.devPhases} />
        </label>
      </div>

      {/* --- Development Phases --- */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h4 className="flex items-center text-sm font-semibold text-gray-700">
            <Layers className="w-4 h-4 mr-2 text-blue-500" />
            Development Phases
          </h4>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                const result = await generateDevPhases(
                  formData.appName,
                  formData.appIdea,
                  formData.platform,
                  formData.selectedTechStack,
                  formData.featurePriority
                );
                if (result?.success && result.data) {
                  if (result.data.developmentPhases) {
                    handleInputChange('developmentPhases', result.data.developmentPhases);
                  }
                  if (result.data.riskAssessment) {
                    handleInputChange('riskAssessment', result.data.riskAssessment);
                  }
                  showNotification('Development phases generated successfully!', 'success');
                }
              }}
              disabled={activeAiField === 'devPhases'}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              {activeAiField === 'devPhases' ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> AI Generate Phases</>
              )}
            </button>
            <button
              onClick={addPhase}
              className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Phase
            </button>
          </div>
        </div>

        {formData.developmentPhases.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Layers className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No development phases yet. Click "Add Phase" or use AI Generate.</p>
          </div>
        )}

        <div className="space-y-4">
          {formData.developmentPhases.map((phase, pIdx) => (
            <div key={pIdx} className="relative bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-200 transition-colors">
              {/* Remove button */}
              <button
                onClick={() => removePhase(pIdx)}
                className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {pIdx + 1}
                </span>
                <span className="text-sm font-semibold text-gray-700">Phase {pIdx + 1}</span>
              </div>

              {/* Phase Name */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Phase Name</label>
                <input
                  type="text"
                  value={phase.phaseName || ''}
                  onChange={(e) => updatePhaseField(pIdx, 'phaseName', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="e.g., Foundation & Setup"
                />
              </div>

              {/* Deliverables */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Deliverables</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(phase.deliverables || []).map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                      {item}
                      <button onClick={() => removeDeliverable(pIdx, i)} className="hover:text-green-900 ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDeliverable[pIdx] || ''}
                    onChange={(e) => setNewDeliverable({ ...newDeliverable, [pIdx]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); addDeliverable(pIdx); }
                    }}
                    className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-blue-400 outline-none"
                    placeholder="Add a deliverable..."
                  />
                  <button
                    onClick={() => addDeliverable(pIdx)}
                    className="px-2.5 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dependencies */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Dependencies</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(phase.dependencies || []).map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium">
                      {item}
                      <button onClick={() => removeDependencyItem(pIdx, i)} className="hover:text-orange-900 ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDependency[pIdx] || ''}
                    onChange={(e) => setNewDependency({ ...newDependency, [pIdx]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); addDependencyItem(pIdx); }
                    }}
                    className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-blue-400 outline-none"
                    placeholder="Add a dependency..."
                  />
                  <button
                    onClick={() => addDependencyItem(pIdx)}
                    className="px-2.5 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium hover:bg-orange-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Resource Allocation */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Resource Allocation</label>
                <textarea
                  value={phase.resourceAllocation || ''}
                  onChange={(e) => updatePhaseField(pIdx, 'resourceAllocation', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  rows={2}
                  placeholder="Describe resource allocation for this phase..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Implementation Roadmap --- */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h4 className="flex items-center text-sm font-semibold text-gray-700">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            Implementation Roadmap
          </h4>
          <button
            onClick={async () => {
              const result = await generateImplementationRoadmap(
                formData.appName,
                formData.appIdea,
                formData.developmentPhases,
                formData.featurePriority
              );
              if (result?.success && result.data) {
                if (result.data.implementationRoadmap) {
                  handleInputChange('implementationRoadmap', result.data.implementationRoadmap);
                }
                showNotification('Implementation roadmap generated successfully!', 'success');
              }
            }}
            disabled={activeAiField === 'implementationRoadmap'}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            {activeAiField === 'implementationRoadmap' ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> AI Generate Roadmap</>
            )}
          </button>
        </div>

        {/* Weekly Schedule */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-600">Weekly Schedule</label>
            <button
              onClick={addWeeklyScheduleItem}
              className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Week
            </button>
          </div>
          {(formData.implementationRoadmap.weeklySchedule || []).length === 0 ? (
            <div className="text-center py-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-xs text-gray-400">No weekly schedule defined yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {formData.implementationRoadmap.weeklySchedule.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white border border-gray-200 rounded-lg p-2.5">
                  <div className="w-24">
                    <input
                      type="text"
                      value={item.week || ''}
                      onChange={(e) => updateWeeklyScheduleItem(idx, 'week', e.target.value)}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-blue-400 outline-none"
                      placeholder="Week 1"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.tasks || ''}
                      onChange={(e) => updateWeeklyScheduleItem(idx, 'tasks', e.target.value)}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-blue-400 outline-none"
                      placeholder="Tasks for this week..."
                    />
                  </div>
                  <button
                    onClick={() => removeWeeklyScheduleItem(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feature Order */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Feature Delivery Order</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {(formData.implementationRoadmap.featureOrder || []).map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                <span className="w-4 h-4 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
                {item}
                <button onClick={() => removeFeatureOrderItem(idx)} className="hover:text-blue-900 ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newFeatureOrder}
              onChange={(e) => setNewFeatureOrder(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeatureOrderItem(); } }}
              className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-blue-400 outline-none"
              placeholder="Add a feature to the delivery order..."
            />
            <button
              onClick={addFeatureOrderItem}
              className="px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Test Milestones */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Test Milestones</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {(formData.implementationRoadmap.testMilestones || []).map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                {item}
                <button onClick={() => removeTestMilestoneItem(idx)} className="hover:text-purple-900 ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTestMilestone}
              onChange={(e) => setNewTestMilestone(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTestMilestoneItem(); } }}
              className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-blue-400 outline-none"
              placeholder="Add a test milestone..."
            />
            <button
              onClick={addTestMilestoneItem}
              className="px-2.5 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-medium hover:bg-purple-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* --- Risk Assessment --- */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
          Risk Assessment
        </h4>

        {renderRiskTable('technicalRisks', 'Technical Risks', 'text-red-500')}
        {renderRiskTable('businessRisks', 'Business Risks', 'text-orange-500')}

        {/* Dependency Management */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Dependency Management</label>
          <textarea
            value={formData.riskAssessment.dependencyManagement || ''}
            onChange={(e) => handleNestedChange('riskAssessment', 'dependencyManagement', e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
            rows={3}
            placeholder="Describe how external and internal dependencies will be managed..."
          />
        </div>
      </div>
    </div>
  );
}
