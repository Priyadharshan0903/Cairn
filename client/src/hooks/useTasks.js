import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api.js';
import { useInvalidate } from './useGoals.js';

export function useCreateTask() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: api.createTask,
    onSuccess: (_d, vars) => invalidate(vars.goalId),
  });
}

export function useUpdateTask(goalId) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, ...body }) => api.updateTask(id, body),
    onSuccess: () => invalidate(goalId),
  });
}

export function useDeleteTask(goalId) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id) => api.deleteTask(id),
    onSuccess: () => invalidate(goalId),
  });
}
