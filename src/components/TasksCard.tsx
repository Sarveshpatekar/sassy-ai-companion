
import React, { useState } from 'react';
import { CheckCircle, Circle, ListTodo, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TasksCardProps {
  tasks: Task[];
  onTaskToggle: (id: string) => void;
  onTaskAdd: (text: string) => void;
  onTaskDelete: (id: string) => void;
  className?: string;
}

const TasksCard: React.FC<TasksCardProps> = ({
  tasks,
  onTaskToggle,
  onTaskAdd,
  onTaskDelete,
  className
}) => {
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onTaskAdd(newTaskText.trim());
      setNewTaskText('');
    }
  };

  return (
    <div className={cn("jarvis-card", className)}>
      <div className="flex items-center gap-2 mb-3 z-10">
        <ListTodo className="h-5 w-5 text-jarvis-accent" />
        <h3 className="text-sm font-semibold text-gray-300">Tasks</h3>
      </div>
      
      <div className="space-y-2 z-10">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="flex items-center justify-between group"
          >
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onTaskToggle(task.id)}
            >
              {task.completed ? (
                <CheckCircle className="h-4 w-4 text-jarvis-accent" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
              <span 
                className={cn(
                  "text-sm",
                  task.completed && "line-through text-gray-500"
                )}
              >
                {task.text}
              </span>
            </div>
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-jarvis-secondary"
              onClick={() => onTaskDelete(task.id)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddTask} className="mt-3 flex gap-2 z-10">
        <input
          type="text"
          placeholder="Add new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          className="jarvis-input text-sm h-8 py-1"
        />
        <button
          type="submit"
          disabled={!newTaskText.trim()}
          className="bg-jarvis-accent/20 hover:bg-jarvis-accent/30 text-jarvis-accent p-1 rounded-md transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default TasksCard;
