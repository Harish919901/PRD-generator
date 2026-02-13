import React from 'react';
import { Sparkles, Plus, Trash2, X } from 'lucide-react';
import {
  DATA_MODEL_TEMPLATE,
  API_ENDPOINT_TEMPLATE,
  FIELD_TYPES,
  RELATIONSHIP_TYPES,
  HTTP_METHODS,
  AUTH_METHOD_OPTIONS
} from '../../constants';

const HelpTooltip = ({ text }) => (
  <div className="group relative ml-2">
    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <div className="invisible group-hover:visible absolute z-50 w-64 p-2 text-xs bg-gray-800 text-white rounded-lg -top-2 left-6">{text}</div>
  </div>
);

const DatabaseArchSection = ({
  formData,
  handleInputChange,
  handleNestedChange,
  addToArray,
  removeFromArray,
  handleArrayItemUpdate,
  showNotification,
  activeAiField,
  generateDatabaseArchitecture
}) => {
  // --- Data Model Helpers ---
  const addEntity = () => {
    const newModel = JSON.parse(JSON.stringify(DATA_MODEL_TEMPLATE));
    handleInputChange('dataModels', [...(formData.dataModels || []), newModel]);
  };

  const removeEntity = (index) => {
    const updated = (formData.dataModels || []).filter((_, i) => i !== index);
    handleInputChange('dataModels', updated);
  };

  const updateEntityName = (index, value) => {
    const updated = [...(formData.dataModels || [])];
    updated[index] = { ...updated[index], entityName: value };
    handleInputChange('dataModels', updated);
  };

  const addField = (modelIndex) => {
    const updated = [...(formData.dataModels || [])];
    updated[modelIndex] = {
      ...updated[modelIndex],
      fields: [...updated[modelIndex].fields, { name: '', type: 'string', required: false }]
    };
    handleInputChange('dataModels', updated);
  };

  const removeField = (modelIndex, fieldIndex) => {
    const updated = [...(formData.dataModels || [])];
    updated[modelIndex] = {
      ...updated[modelIndex],
      fields: updated[modelIndex].fields.filter((_, i) => i !== fieldIndex)
    };
    handleInputChange('dataModels', updated);
  };

  const updateField = (modelIndex, fieldIndex, key, value) => {
    const updated = [...(formData.dataModels || [])];
    const fields = [...updated[modelIndex].fields];
    fields[fieldIndex] = { ...fields[fieldIndex], [key]: value };
    updated[modelIndex] = { ...updated[modelIndex], fields };
    handleInputChange('dataModels', updated);
  };

  const addRelationship = (modelIndex) => {
    const updated = [...(formData.dataModels || [])];
    updated[modelIndex] = {
      ...updated[modelIndex],
      relationships: [...updated[modelIndex].relationships, { type: 'hasMany', relatedEntity: '' }]
    };
    handleInputChange('dataModels', updated);
  };

  const removeRelationship = (modelIndex, relIndex) => {
    const updated = [...(formData.dataModels || [])];
    updated[modelIndex] = {
      ...updated[modelIndex],
      relationships: updated[modelIndex].relationships.filter((_, i) => i !== relIndex)
    };
    handleInputChange('dataModels', updated);
  };

  const updateRelationship = (modelIndex, relIndex, key, value) => {
    const updated = [...(formData.dataModels || [])];
    const relationships = [...updated[modelIndex].relationships];
    relationships[relIndex] = { ...relationships[relIndex], [key]: value };
    updated[modelIndex] = { ...updated[modelIndex], relationships };
    handleInputChange('dataModels', updated);
  };

  // --- API Specification Helpers ---
  const toggleAuthMethod = (method) => {
    const current = formData.apiSpecification?.authMethods || [];
    const updated = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method];
    handleInputChange('apiSpecification', { ...formData.apiSpecification, authMethods: updated });
  };

  const addEndpoint = () => {
    const newEndpoint = { ...API_ENDPOINT_TEMPLATE };
    handleInputChange('apiSpecification', {
      ...formData.apiSpecification,
      coreEndpoints: [...(formData.apiSpecification?.coreEndpoints || []), newEndpoint]
    });
  };

  const removeEndpoint = (index) => {
    const updated = (formData.apiSpecification?.coreEndpoints || []).filter((_, i) => i !== index);
    handleInputChange('apiSpecification', { ...formData.apiSpecification, coreEndpoints: updated });
  };

  const updateEndpoint = (index, key, value) => {
    const endpoints = [...(formData.apiSpecification?.coreEndpoints || [])];
    endpoints[index] = { ...endpoints[index], [key]: value };
    handleInputChange('apiSpecification', { ...formData.apiSpecification, coreEndpoints: endpoints });
  };

  const addIntegrationReq = () => {
    handleInputChange('apiSpecification', {
      ...formData.apiSpecification,
      integrationRequirements: [...(formData.apiSpecification?.integrationRequirements || []), '']
    });
  };

  const removeIntegrationReq = (index) => {
    const updated = (formData.apiSpecification?.integrationRequirements || []).filter((_, i) => i !== index);
    handleInputChange('apiSpecification', { ...formData.apiSpecification, integrationRequirements: updated });
  };

  const updateIntegrationReq = (index, value) => {
    const reqs = [...(formData.apiSpecification?.integrationRequirements || [])];
    reqs[index] = value;
    handleInputChange('apiSpecification', { ...formData.apiSpecification, integrationRequirements: reqs });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <label className="flex items-center text-lg font-bold text-gray-800">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">2.4</span>
          Database & API Architecture
          <HelpTooltip text="Design your data model with entities, fields, and relationships. Define API specifications including auth methods and core endpoints." />
        </label>
        <button
          onClick={async () => {
            const result = await generateDatabaseArchitecture(formData);
            if (result?.success && result.data) {
              if (result.data.dataModels) {
                handleInputChange('dataModels', result.data.dataModels);
              }
              if (result.data.apiSpecification) {
                handleInputChange('apiSpecification', result.data.apiSpecification);
              }
              showNotification('Database & API architecture generated successfully!', 'success');
            }
          }}
          disabled={activeAiField === 'databaseArch'}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {activeAiField === 'databaseArch' ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> AI Generate</>
          )}
        </button>
      </div>

      {/* ===== Data Models Subsection ===== */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-blue-900">Data Models</h3>
          <button
            onClick={addEntity}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-600 border-2 border-blue-300 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Entity
          </button>
        </div>

        {(formData.dataModels || []).length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-dashed border-blue-200 p-6 text-center">
            <p className="text-gray-500 text-sm">No data models yet. Click "Add Entity" to define your first entity, or use AI Generate.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(formData.dataModels || []).map((model, modelIdx) => (
              <div key={modelIdx} className="bg-white rounded-xl border-2 border-gray-200 p-4">
                {/* Entity Header */}
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="text"
                    value={model.entityName || ''}
                    onChange={(e) => updateEntityName(modelIdx, e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    placeholder="Entity Name (e.g., User, Product, Order)"
                  />
                  <button
                    onClick={() => removeEntity(modelIdx)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove entity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Fields Table */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Fields</h5>
                    <button
                      onClick={() => addField(modelIdx)}
                      className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800"
                    >
                      <Plus className="w-3 h-3" /> Add Field
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {/* Table header */}
                    <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider px-1">
                      <div className="col-span-5">Name</div>
                      <div className="col-span-4">Type</div>
                      <div className="col-span-2 text-center">Required</div>
                      <div className="col-span-1"></div>
                    </div>
                    {(model.fields || []).map((field, fieldIdx) => (
                      <div key={fieldIdx} className="grid grid-cols-12 gap-2 items-center">
                        <input
                          type="text"
                          value={field.name || ''}
                          onChange={(e) => updateField(modelIdx, fieldIdx, 'name', e.target.value)}
                          className="col-span-5 px-2 py-1.5 border border-gray-200 rounded text-xs focus:border-blue-400 outline-none"
                          placeholder="field_name"
                        />
                        <select
                          value={field.type || 'string'}
                          onChange={(e) => updateField(modelIdx, fieldIdx, 'type', e.target.value)}
                          className="col-span-4 px-2 py-1.5 border border-gray-200 rounded text-xs focus:border-blue-400 outline-none bg-white"
                        >
                          {FIELD_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <div className="col-span-2 flex justify-center">
                          <input
                            type="checkbox"
                            checked={field.required || false}
                            onChange={(e) => updateField(modelIdx, fieldIdx, 'required', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          onClick={() => removeField(modelIdx, fieldIdx)}
                          className="col-span-1 p-1 text-red-400 hover:text-red-600 rounded transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Relationships */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Relationships</h5>
                    <button
                      onClick={() => addRelationship(modelIdx)}
                      className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800"
                    >
                      <Plus className="w-3 h-3" /> Add Relationship
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {(model.relationships || []).map((rel, relIdx) => (
                      <div key={relIdx} className="flex items-center gap-2">
                        <select
                          value={rel.type || 'hasMany'}
                          onChange={(e) => updateRelationship(modelIdx, relIdx, 'type', e.target.value)}
                          className="px-2 py-1.5 border border-gray-200 rounded text-xs focus:border-blue-400 outline-none bg-white"
                        >
                          {RELATIONSHIP_TYPES.map((rt) => (
                            <option key={rt} value={rt}>{rt}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={rel.relatedEntity || ''}
                          onChange={(e) => updateRelationship(modelIdx, relIdx, 'relatedEntity', e.target.value)}
                          className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-xs focus:border-blue-400 outline-none"
                          placeholder="Related Entity"
                        />
                        <button
                          onClick={() => removeRelationship(modelIdx, relIdx)}
                          className="p-1 text-red-400 hover:text-red-600 rounded transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== API Specification Subsection ===== */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-5">
        <h3 className="text-base font-bold text-blue-900 mb-4">API Specification</h3>

        {/* Auth Methods */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Authentication Methods</h4>
          <div className="flex flex-wrap gap-2">
            {AUTH_METHOD_OPTIONS.map((method) => {
              const isSelected = (formData.apiSpecification?.authMethods || []).includes(method);
              return (
                <button
                  key={method}
                  onClick={() => toggleAuthMethod(method)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {method}
                </button>
              );
            })}
          </div>
        </div>

        {/* Core Endpoints */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700">Core Endpoints</h4>
            <button
              onClick={addEndpoint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-600 border-2 border-blue-300 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Endpoint
            </button>
          </div>
          {(formData.apiSpecification?.coreEndpoints || []).length === 0 ? (
            <div className="bg-white rounded-lg border-2 border-dashed border-blue-200 p-4 text-center">
              <p className="text-gray-500 text-xs">No endpoints defined. Click "Add Endpoint" or use AI Generate.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider px-1">
                <div className="col-span-2">Method</div>
                <div className="col-span-4">Endpoint</div>
                <div className="col-span-5">Description</div>
                <div className="col-span-1"></div>
              </div>
              {(formData.apiSpecification?.coreEndpoints || []).map((ep, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white rounded-lg p-1">
                  <select
                    value={ep.method || 'GET'}
                    onChange={(e) => updateEndpoint(idx, 'method', e.target.value)}
                    className="col-span-2 px-2 py-1.5 border border-gray-200 rounded text-xs font-semibold focus:border-blue-400 outline-none bg-white"
                  >
                    {HTTP_METHODS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={ep.endpoint || ''}
                    onChange={(e) => updateEndpoint(idx, 'endpoint', e.target.value)}
                    className="col-span-4 px-2 py-1.5 border border-gray-200 rounded text-xs font-mono focus:border-blue-400 outline-none"
                    placeholder="/api/v1/resource"
                  />
                  <input
                    type="text"
                    value={ep.description || ''}
                    onChange={(e) => updateEndpoint(idx, 'description', e.target.value)}
                    className="col-span-5 px-2 py-1.5 border border-gray-200 rounded text-xs focus:border-blue-400 outline-none"
                    placeholder="Description"
                  />
                  <button
                    onClick={() => removeEndpoint(idx)}
                    className="col-span-1 p-1 text-red-400 hover:text-red-600 rounded transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Integration Requirements */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700">Integration Requirements</h4>
            <button
              onClick={addIntegrationReq}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-600 border-2 border-blue-300 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Requirement
            </button>
          </div>
          <div className="space-y-2">
            {(formData.apiSpecification?.integrationRequirements || []).map((req, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={req || ''}
                  onChange={(e) => updateIntegrationReq(idx, e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-xs focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  placeholder="e.g., Must integrate with Stripe payment gateway"
                />
                <button
                  onClick={() => removeIntegrationReq(idx)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseArchSection;
