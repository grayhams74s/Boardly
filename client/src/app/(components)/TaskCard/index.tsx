import { Task } from '@/state/api';
import React from 'react'
import { format } from 'date-fns'
import Image from 'next/image';
import { CalendarDays, EllipsisVertical, MessageCircleDashed, Paperclip } from 'lucide-react';

type Props = {
    task: Task
};


const TaskCard  = ({ task }: Props) => {
  const tags = task.tags
    ? task.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
    : [];
  const dateLabel = [task.startDate, task.dueDate]
    .filter(Boolean)
    .map((date) => format(new Date(date!), "MMM d yyyy"))
    .join(" - ");

  return (
    <article className='group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-gray-100 px-4 py-4 transition-colors last:border-b-0 hover:bg-gray-50 dark:border-stroke-dark dark:hover:bg-dark-bg sm:px-5 lg:grid-cols-[minmax(0,2fr)_minmax(150px,1fr)_minmax(180px,1fr)_180px]'>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">{task.title}</h3>
          {task.priority && <PriorityBadge priority={task.priority} />}
        </div>
        <p className="mt-1 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
          {task.description || "No description provided"}
        </p>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 dark:bg-dark-tertiary dark:text-gray-200">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="hidden min-w-0 lg:block">
        <p className="text-[11px] font-medium uppercase text-gray-400">Status</p>
        <div className="mt-1 flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-200">
          <span className={`h-2 w-2 rounded-full ${statusColor(task.status)}`} />
          {task.status || "No status"}
        </div>
      </div>

      <div className="hidden min-w-0 lg:block">
        <p className="text-[11px] font-medium uppercase text-gray-400">Schedule</p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{dateLabel || "No dates set"}</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <div className="hidden items-center gap-3 text-gray-400 sm:flex">
          {(task.attachments?.length ?? 0) > 0 && (
            <span className="flex items-center gap-1" title={`${task.attachments!.length} attachments`}>
              <Paperclip className="h-4 w-4" />
              <span className="text-xs">{task.attachments!.length}</span>
            </span>
          )}
          <span className="flex items-center gap-1" title={`${task.comments?.length ?? 0} comments`}>
            <MessageCircleDashed className="h-4 w-4" />
            <span className="text-xs">{task.comments?.length ?? 0}</span>
          </span>
        </div>

        <div className="flex -space-x-2">
          {task.assignee?.profilePictureUrl && (
            <Image
              src={`/${task.assignee.profilePictureUrl}`}
              alt={task.assignee.username}
              title={`Assigned to ${task.assignee.username}`}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
            />
          )}
          {task.author?.profilePictureUrl && (
            <Image
              src={`/${task.author.profilePictureUrl}`}
              alt={task.author.username}
              title={`Created by ${task.author.username}`}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
            />
          )}
        </div>

        <button
          type="button"
          aria-label={`More options for ${task.title}`}
          title="Task options"
          className="flex h-8 w-8 items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-dark-tertiary dark:hover:text-white"
        >
          <EllipsisVertical className="h-4 w-4" />
        </button>
      </div>
    </article>
  )
}

const statusColor = (status: Task["status"]) => {
  if (status === "Completed") return "bg-green-500";
  if (status === "Under Review") return "bg-amber-500";
  if (status === "Work In Progress") return "bg-blue-500";
  return "bg-gray-400";
};

const PriorityBadge = ({ priority }: { priority: Task["priority"] }) => {
  const colors =
    priority === "Urgent"
      ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
      : priority === "High"
        ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
        : priority === "Medium"
          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
          : priority === "Low"
            ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
            : "bg-gray-100 text-gray-600 dark:bg-dark-tertiary dark:text-gray-300";

  return <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${colors}`}>{priority}</span>;
};

export default TaskCard 
