'use client'

import { Task, useGetTasksQuery, useUpdateTaskStatusMutation } from '@/state/api';
import { CalendarDays, EllipsisVertical, PlusCircle, EllipsisVerticalIcon, MessageCircleDashed, Paperclip } from 'lucide-react';
import Image from 'next/image';
import React from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd' 
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Task as TaskType } from "@/state/api";
import { format } from "date-fns";
import { BoardViewSkeleton } from "../loading-skeletons";
import { useMinimumLoading } from "../use-minimum-loading";

type BoardProps = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];
const TASK_DRAG_TYPE = "task";

const BoardView = ({id, setIsModalNewTaskOpen}: BoardProps) => {
    const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: Number(id)});
    const showSkeleton = useMinimumLoading(isLoading);

    //API Query
    const [ updateTaskStatus ] = useUpdateTaskStatusMutation();

    const moveTask = async (taskId: number, toStatus: string) => { 
      // The Basic Trigger for updating ang query of our Update Task
      await updateTaskStatus({ taskId, status: toStatus }).unwrap();
    };

    if (showSkeleton) {
      return <BoardViewSkeleton />;
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

  
  const taskTagsSplit = task.tags
    ? task.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
    : [];

  const formattedStartDate = task.startDate
  ? format(new Date(task.startDate), "MMM d yyyy")
  : "";

const formattedDueDate = task.dueDate
  ? format(new Date(task.dueDate), "MMM d yyyy")
  : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;
  const numberOfAttachments = task.attachments?.length ?? 0;

  return (
    <div
      ref={(node) => {
        drag(node);
      }}
      className={`group cursor-grab overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md active:cursor-grabbing dark:border-stroke-dark dark:bg-dark-bg dark:hover:border-gray-500 ${
        isDragging ? "scale-[0.98] opacity-50" : "opacity-100"
      }`}
    >
      { task.attachments && task.attachments.length > 0 &&  (
        <div className="relative aspect-[16/7] overflow-hidden bg-gray-100 dark:bg-dark-secondary">
          <Image
            src={`/${task.attachments[0].fileURL}`}
            alt={task.attachments[0].fileName}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="p-4">
        <div className='flex items-start justify-between'>
          <div className='flex flex-1 flex-wrap items-center gap-2'>
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className='flex flex-wrap gap-1.5'>
              {taskTagsSplit.map(( tag ) => (
                <span key={tag} className='rounded bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600 dark:bg-dark-secondary dark:text-gray-300'>
                  {tag}
                </span>
              ))}
            </div>  
          </div> 
          <button
            type="button"
            aria-label={`More options for ${task.title}`}
            title="Task options"
            className='ml-2 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded text-gray-400 opacity-70 hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100 dark:hover:bg-dark-secondary dark:hover:text-white'
          >
            <EllipsisVertical size={18} />
          </button>
        </div>
        <h4 className="mt-3 text-sm font-semibold leading-5 text-gray-900 dark:text-white">
          {task.title}
        </h4>
        {task.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
            {task.description}
          </p>
        )}

        {(formattedStartDate || formattedDueDate) && (
          <div className='mt-3 flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400'>
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span>
              {formattedStartDate}
              {formattedStartDate && formattedDueDate && " - "}
              {formattedDueDate}
            </span>
          </div>
        )}

        <div className='mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-stroke-dark'>
          <div className='flex -space-x-2 overflow-hidden'>
            {task.assignee?.profilePictureUrl && (
              <Image
                src={`/${task.assignee.profilePictureUrl}`}
                alt={task.assignee.username}
                title={`Assigned to ${task.assignee.username}`}
                width={28}
                height={28}
                className='h-7 w-7 rounded-full border-2 border-white object-cover dark:border-dark-bg'
              />
            )}
            {task.author?.profilePictureUrl && (
              <Image
                src={`/${task.author.profilePictureUrl}`}
                alt={task.author.username}
                title={`Created by ${task.author.username}`}
                width={28}
                height={28}
                className='h-7 w-7 rounded-full border-2 border-white object-cover dark:border-dark-bg'
              />
            )}
          </div>

          <div className='flex items-center gap-3 text-gray-400 dark:text-gray-500'>
            {numberOfAttachments > 0 && (
              <span className="flex items-center gap-1" title={`${numberOfAttachments} attachments`}>
                <Paperclip className="h-4 w-4" />
                <span className="text-xs">{numberOfAttachments}</span>
              </span>
            )}
            <span className='flex items-center gap-1' title={`${numberOfComments} comments`}>
              <MessageCircleDashed className="h-4 w-4" />
              <span className='text-xs'>{numberOfComments}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};



const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
  <div
    className={`rounded px-2 py-1 text-[11px] font-semibold ${
      priority === "Urgent"
        ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
        : priority === "High"   
          ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
          : priority === "Medium"
            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            : priority === "Low"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "bg-gray-100 text-gray-600 dark:bg-dark-secondary dark:text-gray-300"
    }`}
  >
    {priority}
  </div>
);

export default BoardView
