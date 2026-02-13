import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getProjects, createProject, deleteProject } from '../services/projectService';

/**
 * ProjectDashboard - Landing page after login.
 * Shows the user's projects with options to create, open, and delete.
 */
export default function ProjectDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // Load projects on mount
  const loadProjects = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getProjects(user.id);
      setProjects(data || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Create new project
  const handleNewProject = async () => {
    setCreating(true);
    try {
      const project = await createProject(user.id, newProjectName.trim() || 'Untitled Project');
      if (project) {
        setShowNameDialog(false);
        setNewProjectName('');
        navigate(`/app/project/${project.id}`);
      }
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setCreating(false);
    }
  };

  // Delete project
  const handleDelete = async (projectId) => {
    setDeleting(true);
    try {
      const success = await deleteProject(projectId);
      if (success) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    } finally {
      setDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Status badge colors
  const getStatusStyle = (status) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'archived':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-amber-100 text-amber-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'archived': return 'Archived';
      default: return 'Draft';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0093B6] to-cyan-400 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">My Projects</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:inline">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Row */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {loading ? 'Loading projects...' : `${projects.length} project${projects.length !== 1 ? 's' : ''}`}
          </p>
          <button
            onClick={() => setShowNameDialog(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#0093B6] to-cyan-500 hover:from-[#007a99] hover:to-cyan-600 shadow-sm transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-[#0093B6]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 mb-4">
              <svg className="w-8 h-8 text-[#0093B6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No projects yet</h3>
            <p className="text-sm text-gray-500 mb-6">Create your first PRD project to get started.</p>
            <button
              onClick={() => setShowNameDialog(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#0093B6] to-cyan-500 hover:from-[#007a99] hover:to-cyan-600 shadow-sm transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create First Project
            </button>
          </div>
        )}

        {/* Project Grid */}
        {!loading && projects.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                {/* Card Top Accent */}
                <div className="h-1 bg-gradient-to-r from-[#0093B6] to-cyan-400" />

                <div className="p-5">
                  {/* Title + Status */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 flex-1 mr-2">
                      {project.title || 'Untitled Project'}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${getStatusStyle(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>

                  {/* Updated At */}
                  <p className="text-xs text-gray-400 mb-4">
                    Updated {formatDate(project.updated_at)}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/app/project/${project.id}`)}
                      className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-white bg-[#0093B6] hover:bg-[#007a99] transition-colors"
                    >
                      Open
                    </button>

                    {/* Delete Button */}
                    {deleteConfirmId === project.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(project.id)}
                          disabled={deleting}
                          className="py-2 px-3 rounded-lg text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          {deleting ? '...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="py-2 px-3 rounded-lg text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(project.id)}
                        className="py-2 px-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete project"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Name Your Project Dialog */}
      {showNameDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Name Your Project</h2>
            <p className="text-sm text-gray-500 mb-4">Give your PRD project a name to get started.</p>
            <input
              type="text"
              autoFocus
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !creating) handleNewProject(); }}
              placeholder="Enter project name..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0093B6] focus:border-transparent"
            />
            <div className="flex items-center justify-end gap-3 mt-5">
              <button
                onClick={() => { setShowNameDialog(false); setNewProjectName(''); }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleNewProject}
                disabled={creating}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#0093B6] to-cyan-500 hover:from-[#007a99] hover:to-cyan-600 shadow-sm transition-all disabled:opacity-50"
              >
                {creating && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
