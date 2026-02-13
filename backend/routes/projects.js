const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// ---------------------------------------------------------------------------
// Helper: check supabase availability
// ---------------------------------------------------------------------------
function requireSupabase(res) {
  if (!supabase) {
    res.json({ success: true, data: [] });
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// GET /api/projects - List user's projects (owned + collaborated)
// ---------------------------------------------------------------------------
router.get('/', async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    // Owned projects
    const { data: ownedProjects, error: ownedError } = await supabase
      .from('projects')
      .select('id, title, status, created_at, updated_at, owner_id')
      .eq('owner_id', userId)
      .order('updated_at', { ascending: false });

    if (ownedError) {
      return res.status(500).json({ success: false, error: ownedError.message });
    }

    // Collaborated projects
    const { data: collabRows, error: collabError } = await supabase
      .from('project_collaborators')
      .select('project_id')
      .eq('user_id', userId);

    let collabProjects = [];
    if (!collabError && collabRows && collabRows.length > 0) {
      const collabIds = collabRows.map(r => r.project_id);
      const { data: cp, error: cpErr } = await supabase
        .from('projects')
        .select('id, title, status, created_at, updated_at, owner_id')
        .in('id', collabIds)
        .order('updated_at', { ascending: false });

      if (!cpErr && cp) {
        collabProjects = cp;
      }
    }

    // Merge & deduplicate
    const allProjects = [...(ownedProjects || [])];
    const ownedIds = new Set(allProjects.map(p => p.id));
    for (const p of collabProjects) {
      if (!ownedIds.has(p.id)) {
        allProjects.push(p);
      }
    }

    res.json({ success: true, data: allProjects });
  } catch (err) {
    console.error('GET /api/projects error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/projects - Create a new project
// ---------------------------------------------------------------------------
router.post('/', async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const { title, form_data } = req.body;

    const { data, error } = await supabase
      .from('projects')
      .insert({
        owner_id: userId,
        title: title || 'Untitled Project',
        form_data: form_data || {},
        status: 'draft'
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('POST /api/projects error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/projects/:id - Get a single project
// ---------------------------------------------------------------------------
router.get('/:id', async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error('GET /api/projects/:id error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// PUT /api/projects/:id - Update a project
// ---------------------------------------------------------------------------
router.put('/:id', async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const { id } = req.params;
    const { form_data, title, status } = req.body;

    const updateFields = { updated_at: new Date().toISOString() };
    if (form_data !== undefined) updateFields.form_data = form_data;
    if (title !== undefined) updateFields.title = title;
    if (status !== undefined) updateFields.status = status;

    const { data, error } = await supabase
      .from('projects')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error('PUT /api/projects/:id error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/projects/:id - Delete a project
// ---------------------------------------------------------------------------
router.delete('/:id', async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data: { deleted: true } });
  } catch (err) {
    console.error('DELETE /api/projects/:id error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/projects/:id/versions - Save a version snapshot
// ---------------------------------------------------------------------------
router.post('/:id/versions', async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const { id } = req.params;
    const { form_data, change_type } = req.body;
    const userId = req.user?.id;

    const { data, error } = await supabase
      .from('project_versions')
      .insert({
        project_id: id,
        form_data: form_data || {},
        change_type: change_type || 'manual_save',
        created_by: userId || null
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('POST /api/projects/:id/versions error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/projects/:id/versions - List versions for a project
// ---------------------------------------------------------------------------
router.get('/:id/versions', async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('project_versions')
      .select('id, project_id, change_type, created_by, created_at')
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error('GET /api/projects/:id/versions error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/projects/:id/versions/:versionId/restore - Restore a version
// ---------------------------------------------------------------------------
router.post('/:id/versions/:versionId/restore', async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const { id, versionId } = req.params;

    // Fetch the version's form_data
    const { data: version, error: versionError } = await supabase
      .from('project_versions')
      .select('form_data')
      .eq('id', versionId)
      .eq('project_id', id)
      .single();

    if (versionError || !version) {
      return res.status(404).json({ success: false, error: 'Version not found' });
    }

    // Overwrite the project's current form_data
    const { data, error } = await supabase
      .from('projects')
      .update({
        form_data: version.form_data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error('POST /api/projects/:id/versions/:versionId/restore error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/projects/:id/collaborators - Add a collaborator
// ---------------------------------------------------------------------------
router.post('/:id/collaborators', async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const { id } = req.params;
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // Look up user by email in profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ success: false, error: 'User not found with that email' });
    }

    const { data, error } = await supabase
      .from('project_collaborators')
      .insert({
        project_id: id,
        user_id: profile.id,
        role: role || 'viewer'
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('POST /api/projects/:id/collaborators error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/projects/:id/collaborators - List collaborators
// ---------------------------------------------------------------------------
router.get('/:id/collaborators', async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('project_collaborators')
      .select('id, user_id, role, created_at, profiles(id, email, full_name)')
      .eq('project_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error('GET /api/projects/:id/collaborators error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/projects/:id/collaborators/:userId - Remove a collaborator
// ---------------------------------------------------------------------------
router.delete('/:id/collaborators/:userId', async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const { id, userId } = req.params;

    const { error } = await supabase
      .from('project_collaborators')
      .delete()
      .eq('project_id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data: { removed: true } });
  } catch (err) {
    console.error('DELETE /api/projects/:id/collaborators/:userId error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/projects/:id/comments - Get comments for a project
// ---------------------------------------------------------------------------
router.get('/:id/comments', async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const { id } = req.params;
    const { field_path } = req.query;

    let query = supabase
      .from('comments')
      .select('id, project_id, field_path, content, author_id, parent_comment_id, resolved, created_at, updated_at, profiles(id, email, full_name)')
      .eq('project_id', id)
      .order('created_at', { ascending: true });

    if (field_path) {
      query = query.eq('field_path', field_path);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error('GET /api/projects/:id/comments error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/projects/:id/comments - Add a comment
// ---------------------------------------------------------------------------
router.post('/:id/comments', async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const { id } = req.params;
    const { field_path, content, parent_comment_id } = req.body;
    const userId = req.user?.id;

    if (!content) {
      return res.status(400).json({ success: false, error: 'Comment content is required' });
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        project_id: id,
        field_path: field_path || null,
        content,
        author_id: userId,
        parent_comment_id: parent_comment_id || null,
        resolved: false
      })
      .select('id, project_id, field_path, content, author_id, parent_comment_id, resolved, created_at, updated_at, profiles(id, email, full_name)')
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('POST /api/projects/:id/comments error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// PUT /api/projects/:id/comments/:commentId - Update a comment (resolve/unresolve)
// ---------------------------------------------------------------------------
router.put('/:id/comments/:commentId', async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const { commentId } = req.params;
    const { resolved, content } = req.body;

    const updateFields = { updated_at: new Date().toISOString() };
    if (resolved !== undefined) updateFields.resolved = !!resolved;
    if (content !== undefined) updateFields.content = content;

    const { data, error } = await supabase
      .from('comments')
      .update(updateFields)
      .eq('id', commentId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error('PUT /api/projects/:id/comments/:commentId error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/projects/:id/comments/:commentId - Delete a comment
// ---------------------------------------------------------------------------
router.delete('/:id/comments/:commentId', async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const { commentId } = req.params;

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data: { deleted: true } });
  } catch (err) {
    console.error('DELETE /api/projects/:id/comments/:commentId error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/projects/:id/activity - Log project activity
// ---------------------------------------------------------------------------
router.post('/:id/activity', async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const { id } = req.params;
    const { action, details } = req.body;
    const userId = req.user?.id;

    const { data, error } = await supabase
      .from('project_activity')
      .insert({
        project_id: id,
        user_id: userId,
        action: action || 'unknown',
        details: details || null
      })
      .select()
      .single();

    if (error) {
      // If the activity table doesn't exist yet, fail gracefully
      console.error('Activity log error:', error.message);
      return res.json({ success: true, data: { logged: false, reason: error.message } });
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('POST /api/projects/:id/activity error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
