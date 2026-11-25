import { useCallback, useEffect, useState } from 'react';
import {
  createUserTask,
  deleteUserTask,
  fetchUserTasks,
  updateUserTask,
} from '../services/taskService';
import type { Task, TaskInput, TaskUpdateInput } from '../types/task';

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mutatingTaskId, setMutatingTaskId] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetched = await fetchUserTasks(userId);
      setTasks(fetched);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to fetch tasks.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const addTask = useCallback(
    async (input: TaskInput): Promise<Task> => {
      if (!userId) {
        throw new Error('You must be signed in to add tasks.');
      }

      setError(null);
      const created = await createUserTask(userId, input);
      setTasks((prev) => [created, ...prev]);
      return created;
    },
    [userId]
  );

  const editTask = useCallback(
    async (taskId: string, updates: TaskUpdateInput): Promise<Task> => {
      if (!userId) {
        throw new Error('You must be signed in to update tasks.');
      }

      setError(null);
      setMutatingTaskId(taskId);
      try {
        const updated = await updateUserTask(taskId, userId, updates);
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
        return updated;
      } finally {
        setMutatingTaskId(null);
      }
    },
    [userId]
  );

  const toggleTaskComplete = useCallback(
    async (task: Task): Promise<void> => {
      if (!userId) return;

      const nextStatus = !task.is_completed;
      setError(null);
      setMutatingTaskId(task.id);

      setTasks((prev) =>
        prev.map((item) =>
          item.id === task.id ? { ...item, is_completed: nextStatus } : item
        )
      );

      try {
        const updated = await updateUserTask(task.id, userId, {
          is_completed: nextStatus,
        });
        setTasks((prev) => prev.map((item) => (item.id === task.id ? updated : item)));
      } catch (err: unknown) {
        setTasks((prev) =>
          prev.map((item) =>
            item.id === task.id ? { ...item, is_completed: task.is_completed } : item
          )
        );
        setError(err instanceof Error ? err.message : 'Failed to update task status.');
      } finally {
        setMutatingTaskId(null);
      }
    },
    [userId]
  );

  const removeTask = useCallback(
    async (taskId: string): Promise<void> => {
      if (!userId) {
        throw new Error('You must be signed in to delete tasks.');
      }

      setError(null);
      setMutatingTaskId(taskId);
      try {
        await deleteUserTask(taskId, userId);
        setTasks((prev) => prev.filter((item) => item.id !== taskId));
      } finally {
        setMutatingTaskId(null);
      }
    },
    [userId]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    tasks,
    loading,
    error,
    mutatingTaskId,
    refreshTasks: loadTasks,
    addTask,
    editTask,
    toggleTaskComplete,
    removeTask,
    clearError,
  };
}
