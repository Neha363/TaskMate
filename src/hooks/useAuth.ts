import { useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabaseClient, initSupabase, isSupabaseReady } from '../lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authActionLoading: boolean;
  isConfigured: boolean;
  error: string | null;
  notice: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    authActionLoading: false,
    isConfigured: isSupabaseReady(),
    error: null,
    notice: null,
  });

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    (async () => {
      const client = await initSupabase();
      if (!isMounted) return;

      if (!client) {
        setState((prev) => ({
          ...prev,
          loading: false,
          isConfigured: false,
        }));
        return;
      }

      setState((prev) => ({ ...prev, isConfigured: true }));

      try {
        const { data, error } = await client.auth.getSession();
        if (!isMounted) return;

        if (error) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error.message,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            session: data.session,
            user: data.session?.user ?? null,
            loading: false,
          }));
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            err instanceof Error
              ? err.message
              : 'Unable to restore authentication session.',
        }));
      }

      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((_event, nextSession) => {
        if (!isMounted) return;
        setState((prev) => ({
          ...prev,
          session: nextSession,
          user: nextSession?.user ?? null,
          loading: false,
        }));
      });

      unsubscribe = () => subscription.unsubscribe();
    })();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  const clearMessages = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, notice: null }));
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    const client = await initSupabase();
    if (!client) {
      setState((prev) => ({
        ...prev,
        isConfigured: false,
        error:
          'Supabase environment variables (SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY, or VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not configured yet.',
      }));
      return false;
    }

    setState((prev) => ({ ...prev, authActionLoading: true, error: null, notice: null }));

    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setState((prev) => ({
        ...prev,
        authActionLoading: false,
        error: error.message,
      }));
      return false;
    }

    setState((prev) => ({
      ...prev,
      session: data.session,
      user: data.user,
      authActionLoading: false,
    }));
    return true;
  }, []);

  const signUp = useCallback(
    async (fullName: string, email: string, password: string): Promise<boolean> => {
      const client = await initSupabase();
      if (!client) {
        setState((prev) => ({
          ...prev,
          isConfigured: false,
          error:
            'Supabase environment variables (SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY, or VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not configured yet.',
        }));
        return false;
      }

      setState((prev) => ({ ...prev, authActionLoading: true, error: null, notice: null }));

      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        setState((prev) => ({
          ...prev,
          authActionLoading: false,
          error: error.message,
        }));
        return false;
      }

      if (!data.session) {
        setState((prev) => ({
          ...prev,
          authActionLoading: false,
          notice:
            'Account created! Please check your email inbox to confirm your address before signing in.',
        }));
        return true;
      }

      setState((prev) => ({
        ...prev,
        session: data.session,
        user: data.user,
        authActionLoading: false,
      }));
      return true;
    },
    []
  );

  const signOut = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client) return;

    setState((prev) => ({ ...prev, authActionLoading: true, error: null }));
    const { error } = await client.auth.signOut();
    if (error) {
      setState((prev) => ({
        ...prev,
        authActionLoading: false,
        error: error.message,
      }));
      return;
    }
    setState((prev) => ({
      ...prev,
      session: null,
      user: null,
      authActionLoading: false,
    }));
  }, []);

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    authActionLoading: state.authActionLoading,
    error: state.error,
    notice: state.notice,
    isSupabaseConfigured: state.isConfigured,
    signIn,
    signUp,
    signOut,
    clearMessages,
  };
}
