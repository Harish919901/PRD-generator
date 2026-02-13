import { supabase } from '../lib/supabase';
import { INITIAL_FORM_DATA } from '../constants';

/**
 * Project CRUD service backed by Supabase.
 * Every method gracefully handles the case where supabase is null
 * (env vars not configured) by returning empty/false values.
 */

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

/**
 * List projects owned by the user plus projects they collaborate on.
 * @param {string} userId - Auth user UUID
 * @returns {Promise<Array>} Array of project objects
 */
export async function getProjects(userId) {
  if (!supabase || !userId) return [];

  try {
    // Fetch projects the user owns
    const { data: ownedProjects, error: ownedError } = await supabase
      .from('projects')
      .select('id, title, status, created_at, updated_at, owner_id')
      .eq('owner_id', userId)
      .order('updated_at', { ascending: false });

    if (ownedError) {
      console.error('Error fetching owned projects:', ownedError.message);
      return [];
    }

    // Fetch projects the user collaborates on
    const { data: collabRows, error: collabError } = await supabase
      .from('project_collaborators')
      .select('project_id')
      .eq('user_id', userId);

    if (collabError) {
      console.error('Error fetching collaborations:', collabError.message);
      return ownedProjects || [];
    }

    const collabProjectIds = (collabRows || []).map(r => r.project_id);

    if (collabProjectIds.length === 0) {
      return ownedProjects || [];
    }

    const { data: collabProjects, error: collabProjError } = await supabase
      .from('projects')
      .select('id, title, status, created_at, updated_at, owner_id')
      .in('id', collabProjectIds)
      .order('updated_at', { ascending: false });

    if (collabProjError) {
      console.error('Error fetching collab projects:', collabProjError.message);
      return ownedProjects || [];
    }

    // Merge and deduplicate
    const allProjects = [...(ownedProjects || [])];
    const ownedIds = new Set(allProjects.map(p => p.id));
    for (const p of (collabProjects || [])) {
      if (!ownedIds.has(p.id)) {
        allProjects.push(p);
      }
    }

    return allProjects;
  } catch (err) {
    console.error('getProjects error:', err);
    return [];
  }
}

/**
 * Fetch a single project by ID including its form_data.
 * @param {string} projectId - Project UUID
 * @returns {Promise<object|null>}
 */
export async function getProject(projectId) {
  if (!supabase || !projectId) return null;

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      console.error('Error fetching project:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('getProject error:', err);
    return null;
  }
}

/**
 * Create a new project with a blank INITIAL_FORM_DATA.
 * @param {string} userId - Owner UUID
 * @param {string} title - Project title
 * @returns {Promise<object|null>} Created project row
 */
export async function createProject(userId, title) {
  if (!supabase || !userId) return null;

  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        owner_id: userId,
        title: title || 'Untitled Project',
        form_data: INITIAL_FORM_DATA,
        status: 'draft'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('createProject error:', err);
    return null;
  }
}

/**
 * Update the form_data JSONB column for a project.
 * @param {string} projectId - Project UUID
 * @param {object} formData - The form data to persist
 * @returns {Promise<boolean>} True if successful
 */
export async function updateProject(projectId, formData) {
  if (!supabase || !projectId) return false;

  try {
    const { error } = await supabase
      .from('projects')
      .update({
        form_data: formData,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId);

    if (error) {
      console.error('Error updating project:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('updateProject error:', err);
    return false;
  }
}

/**
 * Delete a project by ID.
 * @param {string} projectId - Project UUID
 * @returns {Promise<boolean>} True if successful
 */
export async function deleteProject(projectId) {
  if (!supabase || !projectId) return false;

  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      console.error('Error deleting project:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('deleteProject error:', err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Versions
// ---------------------------------------------------------------------------

/**
 * Save a snapshot of the current form_data as a version.
 * @param {string} projectId
 * @param {object} formData
 * @param {string} changeType - e.g. "manual_save", "auto_save", "ai_generation"
 * @param {string} userId - Author of this version
 * @returns {Promise<object|null>} Created version row
 */
export async function saveVersion(projectId, formData, changeType, userId) {
  if (!supabase || !projectId) return null;

  try {
    const { data, error } = await supabase
      .from('project_versions')
      .insert({
        project_id: projectId,
        form_data: formData,
        change_type: changeType || 'manual_save',
        created_by: userId || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving version:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('saveVersion error:', err);
    return null;
  }
}

/**
 * List all versions for a project, newest first.
 * @param {string} projectId
 * @returns {Promise<Array>}
 */
export async function getVersions(projectId) {
  if (!supabase || !projectId) return [];

  try {
    const { data, error } = await supabase
      .from('project_versions')
      .select('id, project_id, change_type, created_by, created_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching versions:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('getVersions error:', err);
    return [];
  }
}

/**
 * Restore a version by overwriting the project's current form_data.
 * @param {string} projectId
 * @param {object} versionFormData - The form_data from the version to restore
 * @returns {Promise<boolean>}
 */
export async function restoreVersion(projectId, versionFormData) {
  if (!supabase || !projectId) return false;

  try {
    const { error } = await supabase
      .from('projects')
      .update({
        form_data: versionFormData,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId);

    if (error) {
      console.error('Error restoring version:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('restoreVersion error:', err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Collaborators
// ---------------------------------------------------------------------------

/**
 * Add a collaborator by email. Looks up the user in auth.users,
 * then inserts into project_collaborators.
 * @param {string} projectId
 * @param {string} email - Collaborator's email
 * @param {string} role - "editor" | "viewer" | "commenter"
 * @returns {Promise<object|null>}
 */
export async function addCollaborator(projectId, email, role) {
  if (!supabase || !projectId || !email) return null;

  try {
    // Look up user by email in profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (profileError || !profileData) {
      console.error('User not found for email:', email);
      return null;
    }

    const { data, error } = await supabase
      .from('project_collaborators')
      .insert({
        project_id: projectId,
        user_id: profileData.id,
        role: role || 'viewer'
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding collaborator:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('addCollaborator error:', err);
    return null;
  }
}

/**
 * Remove a collaborator from a project.
 * @param {string} projectId
 * @param {string} userId - Collaborator's user UUID
 * @returns {Promise<boolean>}
 */
export async function removeCollaborator(projectId, userId) {
  if (!supabase || !projectId || !userId) return false;

  try {
    const { error } = await supabase
      .from('project_collaborators')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing collaborator:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('removeCollaborator error:', err);
    return false;
  }
}

/**
 * List all collaborators for a project.
 * @param {string} projectId
 * @returns {Promise<Array>}
 */
export async function getCollaborators(projectId) {
  if (!supabase || !projectId) return [];

  try {
    const { data, error } = await supabase
      .from('project_collaborators')
      .select('id, user_id, role, created_at, profiles(id, email, full_name)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching collaborators:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('getCollaborators error:', err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Realtime Subscription
// ---------------------------------------------------------------------------

/**
 * Subscribe to realtime changes on a project row.
 * @param {string} projectId
 * @param {function} callback - Called with the updated project payload
 * @returns {object|null} Supabase subscription (call .unsubscribe() to stop)
 */
export function subscribeToProject(projectId, callback) {
  if (!supabase || !projectId || !callback) return null;

  try {
    const subscription = supabase
      .channel(`project-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return subscription;
  } catch (err) {
    console.error('subscribeToProject error:', err);
    return null;
  }
}
