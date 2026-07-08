'use client'

import { Task, useGetTasksQuery, useUpdateTaskStatusMutation } from '@/state/api';
import { EllipsisVertical, PlusCircle, EllipsisVerticalIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd' 
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Task as TaskType } from "@/state/api";
import { format } from "date-fns";

type BoardProps = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];
const TASK_DRAG_TYPE = "task";

type DragTask = {
  id: number;
};

const BoardView = ({id, setIsModalNewTaskOpen}: BoardProps) => {
    const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: Number(id)});

    //API Query
    const [ updateTaskStatus ] = useUpdateTaskStatusMutation();

    const moveTask = async (taskId: number, toStatus: string) => { 
      // The Basic Trigger for updating ang query of our Update Task
      await updateTaskStatus({ taskId, status: toStatus }).unwrap();
    };

    if (isLoading) {
      return <div className="p-4 text-sm text-gray-500 dark:text-neutral-400">Loading tasks...</div>;
    }

    if (error) {
      return <div className="p-4 text-sm text-red-500">Error loading tasks.</div>;
    }

  return <DndProvider backend={HTML5Backend}>
     <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
      {taskStatus.map((status) => (
        <TaskColumn
          key={status}
          status={status}
          tasks={tasks?.filter((task) => task.status === status) ?? []}
          moveTask={moveTask}
          setIsModalNewTaskOpen={setIsModalNewTaskOpen}
        />
      ))}
    </div>
  </DndProvider>
};

type TaskColumnProps = {
  status: string;
  tasks: Task[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: {id: number}) => moveTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }),);
  

  const tasksCount = tasks.filter((task) => task.status === status).length;

   const statusColor: Record<string, string> = {
    "To Do": "text-black",
    "Work In Progress": "#059669",
    "Under Review":  "#D97706",
    "Completed": "#000000"
   }

  return (
    <div
      ref={(node) => {
        drop(node);
      }}
      className={`rounded-md bg-gray-50 p-3 transition-colors dark:bg-dark-secondary ${
        isOver ? "bg-blue-50 dark:bg-stroke-dark" : ""
      }`}
    >
     <div
       className="w-2 rounded-s-lg"
       style={{ backgroundColor: statusColor[status] }}
     />
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center justify-between">
         <h3 className="text-sm font-semibold text-gray-700 dark:text-white">{status}</h3>
         <span className="ml-2 inline-block text-gray-500 rounded-full bg-gray-200 p-1 text-center text-xs leading-none dark:bg-dark-tertiary dark:text-white" style={{width: "1.5rem", height: "1.2rem" }}>{tasksCount}</span>
        </div>

        {/** Interactive Buttons */}

        <div className='flex'>
          <button
            onClick={() => setIsModalNewTaskOpen(true)}
            className="cursor-pointer text-xs text-blue-500 hover:text-blue-600 dark:text-white dark:hover:text-gray-200 transition duration-300 ease-in-out"
          >
            <div className='flex items-center gap-2'>
            Add Task <PlusCircle  className='w-4 h-4' />
            </div>
          </button>

          <button className="cursor-pointer">
            <EllipsisVerticalIcon  className='w-4 h-4 ml-3 dark:text-white hover:text-gray-300 transition duration-300 ease-in-out' />
          </button>
        </div>

      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

type TaskCardProps = {
  task: Task;
};

const TaskCard = ({ task }: TaskCardProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: TASK_DRAG_TYPE,
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [task.id]);

  
  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  return (
    <div
      ref={(node) => {
        drag(node);
      }}
      className={`cursor-grab rounded-md bg-white p-3 shadow-sm active:cursor-grabbing dark:bg-dark-bg ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      { task.attachments && task.attachments.length > 0 &&  (
        <Image  src={`/${task.attachments[0].fileURL}`} alt={task.attachments[0].fileName} width={400} height={200} className='h-auto w-full rounded-t-md' />
      )}
      <div className='py-3'>
        <div className='flex items-start justify-between'>
          <div className='flex flex-1 flex-wrap items-center gap-2'>
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className='flex gap-2'>
              {taskTagsSplit.map(( tag ) => (
                <div key={tag} className='rounded-full bg-blue-100 px-2 py-1 text-xs'> {tag} </div>
              ))}
            </div>
          </div> 
          <button className='flex h-6 w-4 shrink-0 items-center justify-center dark:text-neutral-500 cursor-pointer'>
            <EllipsisVertical size={26} />
          </button>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-800 dark:text-white mt-2">{task.title}</p>
      {task.description && (
        <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">{task.description}</p>
      )}
    </div>
  );
};



const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
  <div
    className={`rounded-full px-2 py-1 text-xs font-semibold ${
      priority === "Urgent"
        ? "bg-red-200 text-red-700"
        : priority === "High"
          ? "bg-yellow-200 text-yellow-700"
          : priority === "Medium"
            ? "bg-green-200 text-green-700"
            : priority === "Low"
              ? "bg-blue-200 text-blue-700"
              : "bg-gray-200 text-gray-700"
    }`}
  >
    {priority}
  </div>
);

export default BoardView
