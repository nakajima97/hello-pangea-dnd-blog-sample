import React, { useState, DragEvent } from 'react';

type TaskStatus = 'todo' | 'inProgress' | 'done';

interface Task {
  id: string;
  content: string;
}

type TaskMap = {
  [key in TaskStatus]: Task[];
};

const initialTasks: TaskMap = {
  todo: [
    { id: 't1', content: 'タスク1' },
    { id: 't2', content: 'タスク2' },
  ],
  inProgress: [
    { id: 'i1', content: 'タスク3' },
  ],
  done: [
    { id: 'd1', content: 'タスク4' },
  ],
};

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<TaskMap>(initialTasks);

  const onDragStart = (evt: DragEvent<HTMLDivElement>, id: string, status: TaskStatus) => {
    evt.dataTransfer.setData('id', id);
    evt.dataTransfer.setData('status', status);
  };

  const onDragOver = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
  };

  const onDrop = (evt: DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
    evt.preventDefault();
    const id = evt.dataTransfer.getData('id');
    const oldStatus = evt.dataTransfer.getData('status') as TaskStatus;

    if (oldStatus === newStatus) return;

    setTasks(prev => {
      const task = prev[oldStatus].find(task => task.id === id);
      if (!task) return prev;

      return {
        ...prev,
        [oldStatus]: prev[oldStatus].filter(task => task.id !== id),
        [newStatus]: [...prev[newStatus], task]
      };
    });
  };

  const getStatusTitle = (status: TaskStatus): string => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'inProgress': return 'In Progress';
      case 'done': return 'Done';
    }
  };

  return (
    <div className="flex justify-center items-start p-4 h-screen bg-gray-100">
      {(Object.entries(tasks) as [TaskStatus, Task[]][]).map(([status, items]) => (
        <div
          key={status}
          className="flex flex-col w-64 mx-2 bg-gray-200 rounded-lg shadow"
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, status)}
        >
          <h2 className="p-2 text-lg font-bold text-center bg-blue-500 text-white rounded-t-lg">
            {getStatusTitle(status)}
          </h2>
          {items.map((task) => (
            <div
              key={task.id}
              className="m-2 p-2 bg-white rounded shadow cursor-move"
              draggable
              onDragStart={(e) => onDragStart(e, task.id, status)}
            >
              {task.content}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;