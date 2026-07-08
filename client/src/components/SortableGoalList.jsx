import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GoalRow } from './GoalRow.jsx';
import { useReorderGoals } from '../hooks/useGoals.js';

/** Dashboard goal list with drag-to-reorder by priority. */
export function SortableGoalList({ goals }) {
  const [items, setItems] = useState(goals);
  const reorder = useReorderGoals();

  // Keep local order in sync when the server list changes.
  useEffect(() => setItems(goals), [goals]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  function onDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((g) => g.id === active.id);
    const newIndex = items.findIndex((g) => g.id === over.id);
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    reorder.mutate(next.map((g, i) => ({ id: g.id, priority: i + 1 })));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((g) => g.id)} strategy={verticalListSortingStrategy}>
        <div className="card goal-list">
          {items.map((goal, i) => (
            <SortableGoal key={goal.id} goal={goal} index={i} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableGoal({ goal, index }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: goal.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    position: 'relative',
    zIndex: isDragging ? 5 : 'auto',
  };
  const handle = (
    <span className="drag-handle" {...attributes} {...listeners} onClick={(e) => e.preventDefault()} aria-label="Drag to reorder">
      <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
        <circle cx="3" cy="3" r="1.4" /><circle cx="9" cy="3" r="1.4" />
        <circle cx="3" cy="8" r="1.4" /><circle cx="9" cy="8" r="1.4" />
        <circle cx="3" cy="13" r="1.4" /><circle cx="9" cy="13" r="1.4" />
      </svg>
    </span>
  );
  return (
    <div ref={setNodeRef} style={style}>
      <GoalRow goal={goal} index={index} dragHandle={handle} />
    </div>
  );
}
