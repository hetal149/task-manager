import { TaskManager } from '@/BLL/taskManager/TaskManager';
import { useEffect, useState } from 'react';


/**
 * Hook that re-renders the calling component whenever the TaskManager emits.
 * Returns an incrementing tick — components read directly from the manager.
 */
export function useTaskManager(manager: TaskManager): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const unsubscribe = manager.subscribe(() => setTick((n) => n + 1));
    return unsubscribe;
  }, [manager]);
  return tick;
}


