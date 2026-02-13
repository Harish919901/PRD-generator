import React, { useState, useEffect } from 'react';
import { History, X, RotateCcw, Save, Clock } from 'lucide-react';
import { projectService } from '../services/projectService';

const VersionHistory = ({ projectId, currentFormData, isOpen, onClose, onRestore, userId }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(null);

  useEffect(() => {
    if (isOpen && projectId) {
      loadVersions();
    }
  }, [isOpen, projectId]);

  const loadVersions = async () => {
    setLoading(true);
    const data = await projectService.getVersions(projectId);
    setVersions(data || []);
    setLoading(false);
  };

  const handleSaveVersion = async () => {
    await projectService.saveVersion(projectId, currentFormData, 'manual_save', userId);
    await loadVersions();
  };

  const handleRestore = async (version) => {
    if (!window.confirm(`Restore to version ${version.version_number}? Current changes will be saved as a new version first.`)) return;
    setRestoring(version.id);
    await projectService.saveVersion(projectId, currentFormData, 'pre_restore_backup', userId);
    await projectService.restoreVersion(projectId, version.form_data);
    if (onRestore) onRestore(version.form_data);
    setRestoring(null);
    await loadVersions();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getChangeTypeLabel = (type) => {
    const labels = {
      'manual_save': 'Manual Save',
      'auto_save': 'Auto Save',
      'pre_restore_backup': 'Pre-Restore Backup',
      'ai_generation': 'AI Generation',
      'import': 'Import'
    };
    return labels[type] || type || 'Save';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" />
          Version History
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveVersion}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save Version
          </button>
          <button onClick={onClose} className="p-1 hover:bg-blue-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No versions saved yet</p>
            <p className="text-xs mt-1">Click "Save Version" to create a snapshot</p>
          </div>
        ) : (
          versions.map((version) => (
            <div key={version.id} className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">v{version.version_number}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {getChangeTypeLabel(version.change_type)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatDate(version.created_at)}
                  </div>
                  {version.author_email && (
                    <p className="text-xs text-gray-400 mt-0.5">by {version.author_email}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRestore(version)}
                  disabled={restoring === version.id}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {restoring === version.id ? (
                    <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <RotateCcw className="w-3.5 h-3.5" />
                  )}
                  Restore
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VersionHistory;
