import React, { useState } from 'react';
import { Sparkles, Plus, X, Map, BookOpen, RefreshCw } from 'lucide-react';
import { DEFAULT_ONBOARDING_STEPS, USER_STORY_TEMPLATE } from '../../constants';

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

export default function UserJourneySection({
  formData,
  handleInputChange,
  handleNestedChange,
  addToArray,
  removeFromArray,
  handleArrayItemUpdate,
  showNotification,
  activeAiField,
  generateUserJourney,
  generateUserStories
}) {
  const [newMilestone, setNewMilestone] = useState('');

  // --- Onboarding Steps helpers ---
  const updateOnboardingStep = (index, field, value) => {
    const steps = [...(formData.userJourney.onboardingSteps || [])];
    steps[index] = { ...steps[index], [field]: value };
    handleNestedChange('userJourney', 'onboardingSteps', steps);
  };

  const addOnboardingStep = () => {
    const steps = [...(formData.userJourney.onboardingSteps || [])];
    steps.push({ step: '', description: '', estimatedTime: '' });
    handleNestedChange('userJourney', 'onboardingSteps', steps);
  };

  const removeOnboardingStep = (index) => {
    const steps = (formData.userJourney.onboardingSteps || []).filter((_, i) => i !== index);
    handleNestedChange('userJourney', 'onboardingSteps', steps);
  };

  const loadDefaultSteps = () => {
    handleNestedChange('userJourney', 'onboardingSteps', [...DEFAULT_ONBOARDING_STEPS]);
    showNotification('Default onboarding steps loaded', 'success');
  };

  // --- Success Milestones helpers ---
  const addMilestone = (value) => {
    if (!value.trim()) return;
    const milestones = [...(formData.userJourney.successMilestones || []), value.trim()];
    handleNestedChange('userJourney', 'successMilestones', milestones);
  };

  const removeMilestone = (index) => {
    const milestones = (formData.userJourney.successMilestones || []).filter((_, i) => i !== index);
    handleNestedChange('userJourney', 'successMilestones', milestones);
  };

  // --- User Stories helpers ---
  const updateStory = (index, field, value) => {
    const stories = [...(formData.userStories || [])];
    stories[index] = { ...stories[index], [field]: value };
    handleInputChange('userStories', stories);
  };

  const addStory = () => {
    handleInputChange('userStories', [
      ...(formData.userStories || []),
      { ...USER_STORY_TEMPLATE }
    ]);
  };

  const removeStory = (index) => {
    handleInputChange(
      'userStories',
      (formData.userStories || []).filter((_, i) => i !== index)
    );
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center text-base font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
            1.4
          </span>
          User Journey & Stories
          <HelpTooltip text="Map the user journey from onboarding through core usage. Define key milestones that indicate successful adoption." />
        </label>
        <button
          onClick={async () => {
            const result = await generateUserJourney(
              formData.appName,
              formData.appIdea,
              formData.primaryUserPersonas
            );
            if (result?.success && result.data) {
              if (result.data.userJourney) {
                handleInputChange('userJourney', {
                  ...formData.userJourney,
                  ...result.data.userJourney
                });
              }
              showNotification('User journey generated successfully!', 'success');
            }
          }}
          disabled={activeAiField === 'userJourney'}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {activeAiField === 'userJourney' ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> AI Generate</>
          )}
        </button>
      </div>

      {/* Onboarding Steps Table */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Map className="w-4 h-4 text-blue-500" />
            Onboarding Steps
          </h4>
          <button
            onClick={loadDefaultSteps}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Load Defaults
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Step</div>
            <div className="col-span-5">Description</div>
            <div className="col-span-2">Est. Time</div>
            <div className="col-span-1"></div>
          </div>

          {/* Table Rows */}
          {(formData.userJourney.onboardingSteps || []).map((step, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-1 text-xs font-bold text-gray-400">{index + 1}</div>
              <div className="col-span-3">
                <input
                  type="text"
                  value={step.step || ''}
                  onChange={(e) => updateOnboardingStep(index, 'step', e.target.value)}
                  className="w-full px-2 py-1.5 bg-transparent border border-transparent hover:border-gray-200 focus:border-blue-400 rounded text-sm outline-none transition-all"
                  placeholder="Step name"
                />
              </div>
              <div className="col-span-5">
                <input
                  type="text"
                  value={step.description || ''}
                  onChange={(e) => updateOnboardingStep(index, 'description', e.target.value)}
                  className="w-full px-2 py-1.5 bg-transparent border border-transparent hover:border-gray-200 focus:border-blue-400 rounded text-sm outline-none transition-all"
                  placeholder="Description"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  value={step.estimatedTime || ''}
                  onChange={(e) => updateOnboardingStep(index, 'estimatedTime', e.target.value)}
                  className="w-full px-2 py-1.5 bg-transparent border border-transparent hover:border-gray-200 focus:border-blue-400 rounded text-sm outline-none transition-all"
                  placeholder="e.g., 5 min"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => removeOnboardingStep(index)}
                  className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add Row */}
          <button
            onClick={addOnboardingStep}
            className="w-full py-2.5 text-xs font-medium text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add Step
          </button>
        </div>
      </div>

      {/* Core Usage Flow */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Core Usage Flow</h4>
        <textarea
          value={formData.userJourney.coreUsageFlow || ''}
          onChange={(e) => handleNestedChange('userJourney', 'coreUsageFlow', e.target.value)}
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none text-sm"
          rows="3"
          placeholder="Describe the primary user flow from entry to task completion..."
        />
      </div>

      {/* Success Milestones */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-green-500" />
          Success Milestones
        </h4>
        <div className="flex flex-wrap gap-2 mb-2">
          {(formData.userJourney.successMilestones || []).map((milestone, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"
            >
              {milestone}
              <button
                onClick={() => removeMilestone(i)}
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
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addMilestone(newMilestone);
                setNewMilestone('');
              }
            }}
            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-400 outline-none"
            placeholder="Add a success milestone..."
          />
          <button
            onClick={() => {
              addMilestone(newMilestone);
              setNewMilestone('');
            }}
            className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* User Stories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-500" />
            User Stories
          </h4>
          <button
            onClick={async () => {
              const result = await generateUserStories(
                formData.appName,
                formData.appIdea,
                formData.primaryUserPersonas
              );
              if (result?.success && result.data) {
                handleInputChange('userStories', result.data);
                showNotification('User stories generated successfully!', 'success');
              }
            }}
            disabled={activeAiField === 'userStories'}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-xs font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            {activeAiField === 'userStories' ? (
              <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-3 h-3" /> AI Generate Stories</>
            )}
          </button>
        </div>

        <div className="space-y-3">
          {(formData.userStories || []).map((story, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-4 relative hover:border-purple-200 transition-colors"
            >
              <button
                onClick={() => removeStory(index)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-purple-600 mb-1 block">As a...</label>
                  <input
                    type="text"
                    value={story.asA || ''}
                    onChange={(e) => updateStory(index, 'asA', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-purple-400 outline-none"
                    placeholder="role"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-purple-600 mb-1 block">I want to...</label>
                  <input
                    type="text"
                    value={story.iWantTo || ''}
                    onChange={(e) => updateStory(index, 'iWantTo', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-purple-400 outline-none"
                    placeholder="action"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-purple-600 mb-1 block">So that...</label>
                  <input
                    type="text"
                    value={story.soThat || ''}
                    onChange={(e) => updateStory(index, 'soThat', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-purple-400 outline-none"
                    placeholder="benefit"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addStory}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-purple-400 hover:text-purple-500 hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Story
          </button>
        </div>
      </div>
    </div>
  );
}
