import React, { useState } from 'react';
import { Sparkles, Plus, X, Users, User, Target, TrendingUp } from 'lucide-react';

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

export default function UserPersonasSection({
  formData,
  handleInputChange,
  addToArray,
  removeFromArray,
  handleArrayItemUpdate,
  showNotification,
  activeAiField,
  generateUserPersonas
}) {
  const [newPainPoint, setNewPainPoint] = useState({});
  const [newGoal, setNewGoal] = useState({});
  const [newMetric, setNewMetric] = useState({});

  // Update a field within a specific persona
  const updatePersonaField = (index, field, value) => {
    const updated = [...formData.primaryUserPersonas];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('primaryUserPersonas', updated);
  };

  // Add a string item to a persona's array field (painPoints, goals, successMetrics)
  const addPersonaArrayItem = (personaIndex, field, value) => {
    if (!value.trim()) return;
    const updated = [...formData.primaryUserPersonas];
    updated[personaIndex] = {
      ...updated[personaIndex],
      [field]: [...(updated[personaIndex][field] || []), value.trim()]
    };
    handleInputChange('primaryUserPersonas', updated);
  };

  // Remove a string item from a persona's array field
  const removePersonaArrayItem = (personaIndex, field, itemIndex) => {
    const updated = [...formData.primaryUserPersonas];
    updated[personaIndex] = {
      ...updated[personaIndex],
      [field]: updated[personaIndex][field].filter((_, i) => i !== itemIndex)
    };
    handleInputChange('primaryUserPersonas', updated);
  };

  // Add a new empty persona
  const addPersona = () => {
    const newPersona = {
      demographic: '',
      role: '',
      painPoints: [],
      goals: [],
      successMetrics: []
    };
    handleInputChange('primaryUserPersonas', [...formData.primaryUserPersonas, newPersona]);
  };

  // Remove a persona by index
  const removePersona = (index) => {
    handleInputChange(
      'primaryUserPersonas',
      formData.primaryUserPersonas.filter((_, i) => i !== index)
    );
  };

  // Update a secondary user field
  const updateSecondaryUser = (index, field, value) => {
    const updated = [...formData.secondaryUsers];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('secondaryUsers', updated);
  };

  // Add a new secondary user
  const addSecondaryUser = () => {
    handleInputChange('secondaryUsers', [
      ...formData.secondaryUsers,
      { role: '', description: '' }
    ]);
  };

  // Remove a secondary user
  const removeSecondaryUser = (index) => {
    handleInputChange(
      'secondaryUsers',
      formData.secondaryUsers.filter((_, i) => i !== index)
    );
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center text-base font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
            1.3
          </span>
          User Personas
          <HelpTooltip text="Define detailed user personas including demographics, roles, pain points, goals, and success metrics. This helps align the product with real user needs." />
        </label>
        <button
          onClick={async () => {
            const result = await generateUserPersonas(
              formData.appName,
              formData.appIdea,
              formData.targetAudienceDemography
            );
            if (result?.success && result.data) {
              if (result.data.primaryUserPersonas) {
                handleInputChange('primaryUserPersonas', result.data.primaryUserPersonas);
              }
              if (result.data.secondaryUsers) {
                handleInputChange('secondaryUsers', result.data.secondaryUsers);
              }
              showNotification('User personas generated successfully!', 'success');
            }
          }}
          disabled={activeAiField === 'userPersonas'}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {activeAiField === 'userPersonas' ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> AI Generate</>
          )}
        </button>
      </div>

      {/* Primary User Personas */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          Primary User Personas
        </h4>

        {formData.primaryUserPersonas.map((persona, pIndex) => (
          <div
            key={pIndex}
            className="bg-white border-2 border-gray-200 rounded-xl p-5 relative hover:border-blue-200 transition-colors"
          >
            {/* Remove Persona Button */}
            <button
              onClick={() => removePersona(pIndex)}
              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove persona"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-xs font-bold text-blue-500 mb-3 uppercase tracking-wide">
              Persona {pIndex + 1}
            </div>

            {/* Demographic + Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Demographic</label>
                <input
                  type="text"
                  value={persona.demographic || ''}
                  onChange={(e) => updatePersonaField(pIndex, 'demographic', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="e.g., 25-35 year old professionals"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Role</label>
                <input
                  type="text"
                  value={persona.role || ''}
                  onChange={(e) => updatePersonaField(pIndex, 'role', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="e.g., Product Manager"
                />
              </div>
            </div>

            {/* Pain Points */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                <Target className="w-3 h-3 text-red-400" />
                Pain Points
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(persona.painPoints || []).map((point, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium"
                  >
                    {point}
                    <button
                      onClick={() => removePersonaArrayItem(pIndex, 'painPoints', i)}
                      className="hover:text-red-900 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPainPoint[pIndex] || ''}
                  onChange={(e) => setNewPainPoint({ ...newPainPoint, [pIndex]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPersonaArrayItem(pIndex, 'painPoints', newPainPoint[pIndex] || '');
                      setNewPainPoint({ ...newPainPoint, [pIndex]: '' });
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-blue-400 outline-none"
                  placeholder="Add a pain point..."
                />
                <button
                  onClick={() => {
                    addPersonaArrayItem(pIndex, 'painPoints', newPainPoint[pIndex] || '');
                    setNewPainPoint({ ...newPainPoint, [pIndex]: '' });
                  }}
                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Goals */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                Goals
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(persona.goals || []).map((goal, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"
                  >
                    {goal}
                    <button
                      onClick={() => removePersonaArrayItem(pIndex, 'goals', i)}
                      className="hover:text-green-900 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGoal[pIndex] || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, [pIndex]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPersonaArrayItem(pIndex, 'goals', newGoal[pIndex] || '');
                      setNewGoal({ ...newGoal, [pIndex]: '' });
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-blue-400 outline-none"
                  placeholder="Add a goal..."
                />
                <button
                  onClick={() => {
                    addPersonaArrayItem(pIndex, 'goals', newGoal[pIndex] || '');
                    setNewGoal({ ...newGoal, [pIndex]: '' });
                  }}
                  className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Success Metrics */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-blue-500" />
                Success Metrics
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(persona.successMetrics || []).map((metric, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {metric}
                    <button
                      onClick={() => removePersonaArrayItem(pIndex, 'successMetrics', i)}
                      className="hover:text-blue-900 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMetric[pIndex] || ''}
                  onChange={(e) => setNewMetric({ ...newMetric, [pIndex]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPersonaArrayItem(pIndex, 'successMetrics', newMetric[pIndex] || '');
                      setNewMetric({ ...newMetric, [pIndex]: '' });
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-blue-400 outline-none"
                  placeholder="Add a success metric..."
                />
                <button
                  onClick={() => {
                    addPersonaArrayItem(pIndex, 'successMetrics', newMetric[pIndex] || '');
                    setNewMetric({ ...newMetric, [pIndex]: '' });
                  }}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Persona Button */}
        <button
          onClick={addPersona}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Persona
        </button>
      </div>

      {/* Secondary Users */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-gray-500" />
          Secondary Users
        </h4>

        <div className="space-y-3">
          {formData.secondaryUsers.map((user, index) => (
            <div
              key={index}
              className="flex gap-3 items-start bg-white border border-gray-200 rounded-lg p-3"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={user.role || ''}
                  onChange={(e) => updateSecondaryUser(index, 'role', e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 outline-none"
                  placeholder="Role (e.g., Admin)"
                />
                <input
                  type="text"
                  value={user.description || ''}
                  onChange={(e) => updateSecondaryUser(index, 'description', e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 outline-none"
                  placeholder="Description"
                />
              </div>
              <button
                onClick={() => removeSecondaryUser(index)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            onClick={addSecondaryUser}
            className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-xs font-medium text-gray-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-3 h-3" />
            Add Secondary User
          </button>
        </div>
      </div>
    </div>
  );
}
