import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AUTO_SAVE_DEBOUNCE_MS = 5000;

/**
 * Hook that auto-saves formData to the Supabase `projects` table
 * after a 5-second debounce. Only saves when projectId is present
 * and supabase is configured.
 *
 * @param {string|null} projectId - The project UUID to save to
 * @param {object} formData - The current form data object
 * @returns {{ autoSaveStatus: string, lastSaved: Date|null }}
 */
export function useAutoSave(projectId, formData) {
  const [autoSaveStatus, setAutoSaveStatus] = useState('idle'); // idle | saving | saved | error
  const [lastSaved, setLastSaved] = useState(null);
  const timerRef = useRef(null);
  const formDataRef = useRef(formData);
  const isMountedRef = useRef(true);

  // Keep the ref in sync so the debounced save always uses the latest data
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Perform the actual save to Supabase
  const saveToSupabase = useCallback(async () => {
    if (!supabase || !projectId) return;

    try {
      setAutoSaveStatus('saving');

      const { error } = await supabase
        .from('projects')
        .update({
          form_data: formDataRef.current,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (!isMountedRef.current) return;

      if (error) {
        console.error('Auto-save failed:', error.message);
        setAutoSaveStatus('error');
      } else {
        setAutoSaveStatus('saved');
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error('Auto-save error:', err);
      if (isMountedRef.current) {
        setAutoSaveStatus('error');
      }
    }
  }, [projectId]);

  // Debounce: reset the timer every time formData changes
  useEffect(() => {
    if (!supabase || !projectId) return;

    // Mark as pending unsaved changes
    setAutoSaveStatus('idle');

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      saveToSupabase();
    }, AUTO_SAVE_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [formData, projectId, saveToSupabase]);

  return { autoSaveStatus, lastSaved };
}

export default useAutoSave;
