import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function isValidHttpUrl(value: string): boolean {
  if (!value || value.includes('your-project-id')) {
    return false;
  }
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function isValidPublicKey(value: string): boolean {
  return Boolean(
    value &&
      value !== 'your-supabase-anon-key' &&
      !value.startsWith('sb_secret_')
  );
}

function createSupabaseInstance(url: string, key: string): SupabaseClient | null {
  if (!isValidHttpUrl(url) || !isValidPublicKey(key)) {
    return null;
  }
  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

const buildTimeUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const buildTimeKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  ''
).trim();

let supabaseClient: SupabaseClient | null = createSupabaseInstance(buildTimeUrl, buildTimeKey);
let initPromise: Promise<SupabaseClient | null> | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  return supabaseClient;
}

export function isSupabaseReady(): boolean {
  return supabaseClient !== null;
}

export async function initSupabase(): Promise<SupabaseClient | null> {
  if (supabaseClient) {
    return supabaseClient;
  }

  if (!initPromise) {
    initPromise = (async () => {
      try {
        const response = await fetch('/api/supabase-config', { cache: 'no-store' });
        if (!response.ok) {
          return null;
        }
        const config = (await response.json()) as {
          url?: string;
          publishableKey?: string;
        };
        const url = (config.url ?? '').trim();
        const key = (config.publishableKey ?? '').trim();
        supabaseClient = createSupabaseInstance(url, key);
        return supabaseClient;
      } catch {
        return null;
      }
    })();
  }

  return initPromise;
}
