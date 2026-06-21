
import { TaskManager } from '@/BLL/taskManager/TaskManager';
import { KanbanColumn } from './KanbanColumn';
import { Task, TaskStatus } from '@/BLL/taskManager/type';

interface KanbanBoardProps {
  manager: TaskManager;
  onCreate: (status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function KanbanBoard({ manager, onCreate, onEdit, onDelete }: KanbanBoardProps) {
  return (
    <div
      data-testid="kanban-board"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <KanbanColumn
        manager={manager}
        status={TaskStatus.Todo}
        title="To do"
        accentDotClass="bg-amber-400"
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <KanbanColumn
        manager={manager}
        status={TaskStatus.InProgress}
        title="In progress"
        accentDotClass="bg-sky-500"
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <KanbanColumn
        manager={manager}
        status={TaskStatus.Done}
        title="Done"
        accentDotClass="bg-emerald-500"
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}


