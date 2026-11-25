import { initSupabase } from '../lib/supabase';
import type { Task, TaskInput, TaskUpdateInput } from '../types/task';

async function requireSupabaseClient() {
  const client = await initSupabase();
  if (!client) {
    throw new Error(
      'Supabase is not configured. Please set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) in your environment variables.'
    );
  }
  return client;
}

function formatSupabaseError(
  error: { code?: string; message?: string } | null,
  fallback: string
): Error {
  if (!error) return new Error(fallback);
  if (error.code === 'PGRST205' || error.message?.includes('public.tasks')) {
    return new Error(
      'The "tasks" table was not found in your Supabase database. Please run supabase/schema.sql in your Supabase SQL Editor.'
    );
  }
  return new Error(error.message || fallback);
}

export async function fetchUserTasks(userId: string): Promise<Task[]> {
  const client = await requireSupabaseClient();

  const { data, error } = await client
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('is_completed', { ascending: true })
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw formatSupabaseError(error, 'Failed to load your tasks from Supabase.');
  }

  return (data ?? []) as Task[];
}

export async function createUserTask(userId: string, input: TaskInput): Promise<Task> {
  const client = await requireSupabaseClient();

  const payload = {
    user_id: userId,
    title: input.title.trim(),
    description: input.description.trim(),
    due_date: input.due_date || null,
    priority: input.priority,
    category: input.category,
    is_completed: false,
  };

  const { data, error } = await client
    .from('tasks')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    throw formatSupabaseError(error, 'Failed to create task.');
  }

  return data as Task;
}

export async function updateUserTask(
  taskId: string,
  userId: string,
  updates: TaskUpdateInput
): Promise<Task> {
  const client = await requireSupabaseClient();

  const sanitizedUpdates: Record<string, unknown> = {};
  if (typeof updates.title === 'string') {
    sanitizedUpdates.title = updates.title.trim();
  }
  if (typeof updates.description === 'string') {
    sanitizedUpdates.description = updates.description.trim();
  }
  if (updates.due_date !== undefined) {
    sanitizedUpdates.due_date = updates.due_date || null;
  }
  if (updates.priority !== undefined) {
    sanitizedUpdates.priority = updates.priority;
  }
  if (updates.category !== undefined) {
    sanitizedUpdates.category = updates.category;
  }
  if (typeof updates.is_completed === 'boolean') {
    sanitizedUpdates.is_completed = updates.is_completed;
  }

  const { data, error } = await client
    .from('tasks')
    .update(sanitizedUpdates)
    .eq('id', taskId)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) {
    throw formatSupabaseError(error, 'Failed to update task.');
  }

  return data as Task;
}

export async function deleteUserTask(taskId: string, userId: string): Promise<void> {
  const client = await requireSupabaseClient();

  const { error } = await client
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', userId);

  if (error) {
    throw formatSupabaseError(error, 'Failed to delete task.');
  }
}
