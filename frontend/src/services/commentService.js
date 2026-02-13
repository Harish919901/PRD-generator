import { supabase } from '../lib/supabase';

/**
 * Comment CRUD service backed by Supabase.
 * Every method gracefully handles the case where supabase is null
 * (env vars not configured) by returning empty/false values.
 */

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/**
 * Get comments for a specific field path within a project.
 * @param {string} projectId - Project UUID
 * @param {string} fieldPath - Dot-notation path (e.g. "appIdea", "appStructure.defaultScreen")
 * @returns {Promise<Array>}
 */
export async function getComments(projectId, fieldPath) {
  if (!supabase || !projectId) return [];

  try {
    let query = supabase
      .from('comments')
      .select('id, project_id, field_path, content, author_id, parent_comment_id, resolved, created_at, updated_at, profiles(id, email, full_name)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (fieldPath) {
      query = query.eq('field_path', fieldPath);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching comments:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('getComments error:', err);
    return [];
  }
}

/**
 * Get all comments for a project regardless of field path.
 * @param {string} projectId
 * @returns {Promise<Array>}
 */
export async function getAllComments(projectId) {
  if (!supabase || !projectId) return [];

  try {
    const { data, error } = await supabase
      .from('comments')
      .select('id, project_id, field_path, content, author_id, parent_comment_id, resolved, created_at, updated_at, profiles(id, email, full_name)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching all comments:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('getAllComments error:', err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

/**
 * Add a comment to a specific field in a project.
 * @param {string} projectId
 * @param {string} fieldPath - Dot-notation field identifier
 * @param {string} content - Comment text
 * @param {string} authorId - User UUID of the commenter
 * @param {string|null} parentCommentId - For threaded replies, the parent comment UUID
 * @returns {Promise<object|null>} Created comment row
 */
export async function addComment(projectId, fieldPath, content, authorId, parentCommentId = null) {
  if (!supabase || !projectId || !content || !authorId) return null;

  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        project_id: projectId,
        field_path: fieldPath || null,
        content,
        author_id: authorId,
        parent_comment_id: parentCommentId,
        resolved: false
      })
      .select('id, project_id, field_path, content, author_id, parent_comment_id, resolved, created_at, updated_at, profiles(id, email, full_name)')
      .single();

    if (error) {
      console.error('Error adding comment:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('addComment error:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

/**
 * Resolve or unresolve a comment.
 * @param {string} commentId - Comment UUID
 * @param {boolean} resolved - Whether to mark as resolved
 * @returns {Promise<boolean>}
 */
export async function resolveComment(commentId, resolved) {
  if (!supabase || !commentId) return false;

  try {
    const { error } = await supabase
      .from('comments')
      .update({
        resolved: !!resolved,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId);

    if (error) {
      console.error('Error resolving comment:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('resolveComment error:', err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

/**
 * Delete a comment by ID.
 * @param {string} commentId - Comment UUID
 * @returns {Promise<boolean>}
 */
export async function deleteComment(commentId) {
  if (!supabase || !commentId) return false;

  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('deleteComment error:', err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Realtime Subscription
// ---------------------------------------------------------------------------

/**
 * Subscribe to realtime changes on comments for a project.
 * @param {string} projectId
 * @param {function} callback - Called with the change payload (INSERT/UPDATE/DELETE)
 * @returns {object|null} Supabase channel subscription (call .unsubscribe() to stop)
 */
export function subscribeToComments(projectId, callback) {
  if (!supabase || !projectId || !callback) return null;

  try {
    const subscription = supabase
      .channel(`comments-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return subscription;
  } catch (err) {
    console.error('subscribeToComments error:', err);
    return null;
  }
}
