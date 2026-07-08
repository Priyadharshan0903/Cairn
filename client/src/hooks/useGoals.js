import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api.js';

export function useGoals() {
  return useQuery({ queryKey: ['goals'], queryFn: () => api.listGoals().then((d) => d.goals) });
}

export function useGoal(id) {
  return useQuery({
    queryKey: ['goal', id],
    queryFn: () => api.getGoal(id),
    enabled: !!id,
  });
}

export function useDashboard() {
  return useQuery({ queryKey: ['dashboard'], queryFn: () => api.dashboard() });
}

export function useHistory() {
  return useQuery({ queryKey: ['history'], queryFn: () => api.history() });
}

export function useActivity() {
  return useQuery({ queryKey: ['activity'], queryFn: () => api.activity().then((d) => d.days) });
}

/** Invalidate the read models that depend on goals/tasks after a write. */
export function useInvalidate() {
  const qc = useQueryClient();
  return (id) => {
    qc.invalidateQueries({ queryKey: ['goals'] });
    qc.invalidateQueries({ queryKey: ['dashboard'] });
    qc.invalidateQueries({ queryKey: ['history'] });
    qc.invalidateQueries({ queryKey: ['activity'] });
    if (id) qc.invalidateQueries({ queryKey: ['goal', id] });
  };
}

export function useCreateGoal() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: api.createGoal, onSuccess: () => invalidate() });
}

export function useUpdateGoal() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, ...body }) => api.updateGoal(id, body),
    onSuccess: (_d, vars) => invalidate(vars.id),
  });
}

export function useDeleteGoal() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (id) => api.deleteGoal(id), onSuccess: () => invalidate() });
}

export function useReorderGoals() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (order) => api.reorderGoals(order), onSuccess: () => invalidate() });
}
