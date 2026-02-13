import React, { useState, useEffect } from 'react';
import { Users, X, UserPlus, Trash2, Mail, Shield, Eye, Edit3, CheckCircle } from 'lucide-react';
import { projectService } from '../services/projectService';

const ROLE_OPTIONS = [
  { value: 'editor', label: 'Editor', icon: Edit3, description: 'Can edit all fields' },
  { value: 'reviewer', label: 'Reviewer', icon: CheckCircle, description: 'Can comment and approve' },
  { value: 'viewer', label: 'Viewer', icon: Eye, description: 'Read-only access' }
];

const CollaboratorDialog = ({ projectId, isOpen, onClose, currentUserId }) => {
  const [collaborators, setCollaborators] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && projectId) {
      loadCollaborators();
    }
  }, [isOpen, projectId]);

  const loadCollaborators = async () => {
    setLoading(true);
    const data = await projectService.getCollaborators(projectId);
    setCollaborators(data || []);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setAdding(true);
    setError('');
    try {
      await projectService.addCollaborator(projectId, email.trim(), role);
      setEmail('');
      await loadCollaborators();
    } catch (err) {
      setError(err.message || 'Failed to add collaborator');
    }
    setAdding(false);
  };

  const handleRemove = async (userId) => {
    if (!window.confirm('Remove this collaborator?')) return;
    await projectService.removeCollaborator(projectId, userId);
    await loadCollaborators();
  };

  const getRoleIcon = (roleValue) => {
    const option = ROLE_OPTIONS.find(r => r.value === roleValue);
    return option ? option.icon : Eye;
  };

  const getRoleBadgeColor = (roleValue) => {
    const colors = { editor: 'bg-blue-100 text-blue-700', reviewer: 'bg-purple-100 text-purple-700', viewer: 'bg-gray-100 text-gray-700' };
    return colors[roleValue] || colors.viewer;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Share Project
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 border-b border-gray-200">
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              >
                {ROLE_OPTIONS.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={!email.trim() || adding}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {adding ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              Invite
            </button>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            {collaborators.length} Collaborator{collaborators.length !== 1 ? 's' : ''}
          </p>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : collaborators.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No collaborators yet</p>
          ) : (
            collaborators.map((collab) => {
              const RoleIcon = getRoleIcon(collab.role);
              return (
                <div key={collab.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {(collab.email || '?')[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{collab.full_name || collab.email}</p>
                      <p className="text-xs text-gray-500">{collab.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(collab.role)}`}>
                      <RoleIcon className="w-3 h-3" />
                      {collab.role}
                    </span>
                    {collab.user_id !== currentUserId && (
                      <button
                        onClick={() => handleRemove(collab.user_id)}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaboratorDialog;
