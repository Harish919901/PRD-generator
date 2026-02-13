import React from 'react';
import { Sparkles, Rocket, Server, Monitor, Activity } from 'lucide-react';
import { NEW_HELP_TEXTS } from '../../constants';

const HelpTooltip = ({ text }) => (
  <div className="group relative ml-2">
    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <div className="invisible group-hover:visible absolute z-50 w-64 p-2 text-xs bg-gray-800 text-white rounded-lg -top-2 left-6">{text}</div>
  </div>
);

export default function DeploymentSection({
  formData,
  handleInputChange,
  handleNestedChange,
  addToArray,
  removeFromArray,
  handleArrayItemUpdate,
  showNotification,
  activeAiField,
  generateDeploymentStrategy
}) {
  // --- Deep nested environment change helper ---

  const updateEnvironmentSpecs = (env, value) => {
    const updated = {
      ...formData.deploymentStrategy,
      environments: {
        ...formData.deploymentStrategy.environments,
        [env]: { ...formData.deploymentStrategy.environments[env], specs: value }
      }
    };
    handleInputChange('deploymentStrategy', updated);
  };

  const environments = [
    {
      key: 'development',
      label: 'Development',
      headerBg: 'bg-green-100',
      headerText: 'text-green-800',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      key: 'staging',
      label: 'Staging',
      headerBg: 'bg-yellow-100',
      headerText: 'text-yellow-800',
      borderColor: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      key: 'production',
      label: 'Production',
      headerBg: 'bg-red-100',
      headerText: 'text-red-800',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center text-base font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
            4.4
          </span>
          Deployment Strategy
          <HelpTooltip text={NEW_HELP_TEXTS.deploymentStrategy} />
        </label>
        <button
          onClick={async () => {
            const result = await generateDeploymentStrategy(
              formData.appName,
              formData.appIdea,
              formData.platform,
              formData.selectedTechStack,
              formData.developmentPhases
            );
            if (result?.success && result.data) {
              if (result.data.deploymentStrategy) {
                handleInputChange('deploymentStrategy', result.data.deploymentStrategy);
              }
              if (result.data.launchPlan) {
                handleInputChange('launchPlan', result.data.launchPlan);
              }
              showNotification('Deployment strategy generated successfully!', 'success');
            }
          }}
          disabled={activeAiField === 'deploymentStrategy'}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {activeAiField === 'deploymentStrategy' ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> AI Generate</>
          )}
        </button>
      </div>

      {/* Environments - 3 Cards */}
      <div className="mb-6">
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <Server className="w-4 h-4 mr-2 text-blue-500" />
          Environments
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {environments.map((env) => (
            <div key={env.key} className={`bg-white border-2 ${env.borderColor} rounded-xl overflow-hidden hover:shadow-md transition-all`}>
              {/* Color-coded header */}
              <div className={`${env.headerBg} px-4 py-2.5 flex items-center gap-2`}>
                <div className={`w-6 h-6 ${env.iconBg} rounded-lg flex items-center justify-center`}>
                  <Monitor className={`w-3.5 h-3.5 ${env.iconColor}`} />
                </div>
                <h5 className={`text-sm font-semibold ${env.headerText}`}>{env.label}</h5>
              </div>
              {/* Specs textarea */}
              <div className="p-4">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Specifications</label>
                <textarea
                  value={formData.deploymentStrategy?.environments?.[env.key]?.specs || ''}
                  onChange={(e) => updateEnvironmentSpecs(env.key, e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  rows={4}
                  placeholder={`Describe ${env.label.toLowerCase()} environment specs (e.g., infrastructure, config, access)...`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CI/CD Pipeline & Monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block flex items-center">
            <Activity className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
            CI/CD Pipeline
          </label>
          <textarea
            value={formData.deploymentStrategy?.cicdPipeline || ''}
            onChange={(e) => {
              const updated = { ...formData.deploymentStrategy, cicdPipeline: e.target.value };
              handleInputChange('deploymentStrategy', updated);
            }}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
            rows={4}
            placeholder="Describe CI/CD pipeline setup (e.g., GitHub Actions, build steps, deploy triggers, rollback strategy)..."
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block flex items-center">
            <Monitor className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
            Monitoring
          </label>
          <textarea
            value={formData.deploymentStrategy?.monitoring || ''}
            onChange={(e) => {
              const updated = { ...formData.deploymentStrategy, monitoring: e.target.value };
              handleInputChange('deploymentStrategy', updated);
            }}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
            rows={4}
            placeholder="Describe monitoring setup (e.g., logging, alerting, APM, error tracking, uptime monitoring)..."
          />
        </div>
      </div>

      {/* Launch Plan */}
      <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <Rocket className="w-4 h-4 mr-2 text-blue-500" />
          Launch Plan
        </h4>

        <div className="space-y-4">
          {/* Soft Launch Strategy */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Soft Launch Strategy</label>
            <textarea
              value={formData.launchPlan?.softLaunchStrategy || ''}
              onChange={(e) => handleNestedChange('launchPlan', 'softLaunchStrategy', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              rows={3}
              placeholder="Describe soft launch approach (target audience, feature flags, rollout percentage, feedback mechanisms)..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Beta Testing */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Beta Testing</label>
              <textarea
                value={formData.launchPlan?.betaTesting || ''}
                onChange={(e) => handleNestedChange('launchPlan', 'betaTesting', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                rows={3}
                placeholder="Describe beta testing plan (participants, duration, feedback collection, success criteria)..."
              />
            </div>

            {/* Public Launch Timeline */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Public Launch Timeline</label>
              <textarea
                value={formData.launchPlan?.publicLaunchTimeline || ''}
                onChange={(e) => handleNestedChange('launchPlan', 'publicLaunchTimeline', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                rows={3}
                placeholder="Describe public launch timeline (announcement, marketing, phased rollout, support readiness)..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
