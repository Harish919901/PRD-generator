import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

/**
 * AuthProvider wraps the app and provides authentication state and methods.
 * If Supabase env vars are not configured (supabase === null), the provider
 * gracefully falls back to an unauthenticated state without errors.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(!!supabase); // only loading if supabase exists

  // Listen for auth state changes
  useEffect(() => {
    if (!supabase) return;

    // Get the initial session
    const initSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error.message);
        }
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (err) {
        console.error('Failed to initialize auth session:', err);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Subscribe to auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Sign up with email, password, and full name.
   * Full name is stored in user_metadata for profile display.
   */
  const signUp = useCallback(async (email, password, fullName) => {
    if (!supabase) {
      return { error: { message: 'Supabase is not configured' } };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) return { error };
      return { data };
    } catch (err) {
      return { error: { message: err.message } };
    }
  }, []);

  /**
   * Sign in with email and password.
   */
  const signIn = useCallback(async (email, password) => {
    if (!supabase) {
      return { error: { message: 'Supabase is not configured' } };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) return { error };
      return { data };
    } catch (err) {
      return { error: { message: err.message } };
    }
  }, []);

  /**
   * Sign in with Google OAuth.
   * Redirects to Google consent screen and back to the app.
   */
  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      return { error: { message: 'Supabase is not configured' } };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`
        }
      });

      if (error) return { error };
      return { data };
    } catch (err) {
      return { error: { message: err.message } };
    }
  }, []);

  /**
   * Sign out the current user and clear local state.
   */
  const signOut = useCallback(async () => {
    if (!supabase) {
      return { error: { message: 'Supabase is not configured' } };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) return { error };

      setUser(null);
      setSession(null);
      return { error: null };
    } catch (err) {
      return { error: { message: err.message } };
    }
  }, []);

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication state and methods.
 * Must be used within an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
