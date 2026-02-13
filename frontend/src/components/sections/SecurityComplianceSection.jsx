import React from 'react';
import { Sparkles, Shield } from 'lucide-react';
import {
  ENCRYPTION_OPTIONS,
  AUTH_METHOD_OPTIONS,
  ACCESS_CONTROL_OPTIONS,
  DATA_RESIDENCY_OPTIONS
} from '../../constants';

const HelpTooltip = ({ text }) => (
  <div className="group relative ml-2">
    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <div className="invisible group-hover:visible absolute z-50 w-64 p-2 text-xs bg-gray-800 text-white rounded-lg -top-2 left-6">{text}</div>
  </div>
);

const SecurityComplianceSection = ({
  formData,
  handleInputChange,
  showNotification,
  activeAiField,
  generateSecurityCompliance
}) => {
  const updateSecurity = (field, value) => {
    handleInputChange('security', { ...formData.security, [field]: value });
  };

  const updateCompliance = (field, value) => {
    handleInputChange('compliance', { ...formData.compliance, [field]: value });
  };

  const toggleChip = (field, parentKey, item) => {
    const current = formData[parentKey]?.[field] || [];
    const updated = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    if (parentKey === 'security') {
      updateSecurity(field, updated);
    } else {
      updateCompliance(field, updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <label className="flex items-center text-lg font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">2.5</span>
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          Security & Compliance
          <HelpTooltip text="Specify security measures (encryption, authentication, access control) and compliance requirements (GDPR, SOC2, HIPAA)." />
        </label>
        <button
          onClick={async () => {
            const result = await generateSecurityCompliance(formData);
            if (result?.success && result.data) {
              if (result.data.security) {
                handleInputChange('security', result.data.security);
              }
              if (result.data.compliance) {
                handleInputChange('compliance', result.data.compliance);
              }
              showNotification('Security & compliance settings generated successfully!', 'success');
            }
          }}
          disabled={activeAiField === 'securityCompliance'}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {activeAiField === 'securityCompliance' ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> AI Generate</>
          )}
        </button>
      </div>

      {/* ===== Security Subsection ===== */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-5">
        <h3 className="text-base font-bold text-blue-900 mb-4">Security</h3>

        {/* Data Encryption */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Data Encryption</h4>
          <div className="flex flex-wrap gap-2">
            {ENCRYPTION_OPTIONS.map((option) => {
              const isSelected = (formData.security?.dataEncryption || []).includes(option);
              return (
                <button
                  key={option}
                  onClick={() => toggleChip('dataEncryption', 'security', option)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Auth Methods */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Authentication Methods</h4>
          <div className="flex flex-wrap gap-2">
            {AUTH_METHOD_OPTIONS.map((option) => {
              const isSelected = (formData.security?.authMethods || []).includes(option);
              return (
                <button
                  key={option}
                  onClick={() => toggleChip('authMethods', 'security', option)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Access Control */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Access Control</h4>
          <div className="flex flex-wrap gap-2">
            {ACCESS_CONTROL_OPTIONS.map((option) => {
              const isSelected = (formData.security?.accessControl || []).includes(option);
              return (
                <button
                  key={option}
                  onClick={() => toggleChip('accessControl', 'security', option)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== Compliance Subsection ===== */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-5">
        <h3 className="text-base font-bold text-blue-900 mb-4">Compliance</h3>

        {/* Toggle Switches */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {/* GDPR */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-800">GDPR</h4>
              <p className="text-[10px] text-gray-500">EU Data Protection</p>
            </div>
            <button
              onClick={() => updateCompliance('gdpr', !formData.compliance?.gdpr)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                formData.compliance?.gdpr ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  formData.compliance?.gdpr ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* SOC2 */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-800">SOC 2</h4>
              <p className="text-[10px] text-gray-500">Security Controls</p>
            </div>
            <button
              onClick={() => updateCompliance('soc2', !formData.compliance?.soc2)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                formData.compliance?.soc2 ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  formData.compliance?.soc2 ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* HIPAA */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-800">HIPAA</h4>
              <p className="text-[10px] text-gray-500">Health Data</p>
            </div>
            <button
              onClick={() => updateCompliance('hipaa', !formData.compliance?.hipaa)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                formData.compliance?.hipaa ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  formData.compliance?.hipaa ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Data Residency Dropdown */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Data Residency</h4>
          <select
            value={formData.compliance?.dataResidency || ''}
            onChange={(e) => updateCompliance('dataResidency', e.target.value)}
            className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm"
          >
            <option value="">Select data residency region...</option>
            {DATA_RESIDENCY_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SecurityComplianceSection;
