import { useAppSelector } from '@/app/redux';
import { useGetTasksQuery } from '@/state/api';
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react"
import { ChevronDown, Plus } from "lucide-react";
import React, { useMemo, useState } from 'react'
import "gantt-task-react/dist/index.css"


type TimelineProps = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

type TaskTypeItems = "task" | "milestone" | "project";

const TimelineView = ( { id, setIsModalNewTaskOpen } : TimelineProps ) => {

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });      

  const [ displayOptions, setIsDisplayOptions ] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US"
  })

  const ganttColors = isDarkMode
    ? {
        barBackgroundColor: "#60a5fa",
        barBackgroundSelectedColor: "#93c5fd",
        barProgressColor: "#3b82f6",
        barProgressSelectedColor: "#60a5fa",
        projectBackgroundColor: "#60a5fa",
        projectBackgroundSelectedColor: "#93c5fd",
        projectProgressColor: "#3b82f6",
        projectProgressSelectedColor: "#60a5fa",
        milestoneBackgroundColor: "#60a5fa",
        milestoneBackgroundSelectedColor: "#93c5fd",
        arrowColor: "#94a3b8",
        todayColor: "rgba(96, 165, 250, 0.14)",
      }
    : {
        barBackgroundColor: "#60a5fa",
        barBackgroundSelectedColor: "#93c5fd",
        barProgressColor: "#3b82f6",
        barProgressSelectedColor: "#60a5fa",
        projectBackgroundColor: "#60a5fa",
        projectBackgroundSelectedColor: "#93c5fd",
        projectProgressColor: "#3b82f6",
        projectProgressSelectedColor: "#60a5fa",
        milestoneBackgroundColor: "#60a5fa",
        milestoneBackgroundSelectedColor: "#93c5fd",
        arrowColor: "#64748b",
        todayColor: "rgba(96, 165, 250, 0.1)",
      };

  const ganttTasks = useMemo(() => {
    return (
      tasks?.map((task) => ({
        start: new Date(task.startDate as string),
        end: new Date(task.dueDate as string),
        name: task.title,
        id: `Task-${task.id}`,
        type: "task" as TaskTypeItems,
        progress: task.points ? (task.points /10) * 100 : 0,
        isDisabled: false
      })) || []
    )
  }, [tasks]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setIsDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }))
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div> An Error  occured while fetching tasks</div>

  return (
    <div className='px-4 xl:px-6'>
      {/** Timeline Header */}
      <div className='flex flex-wrap items-center justify-between gap-2 py-5'>
        <h1 className='me-2 text-lg font-bold dark:text-white'>
          Project Tasks Timeline
        </h1>

        <div className='relative inline-block w-64'>
          <select
            aria-label="Timeline view"
            className='block h-10 w-full cursor-pointer appearance-none rounded-md border border-gray-200 bg-white py-2 pl-3 pr-11 text-sm font-medium text-gray-800 outline-none transition-colors hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-secondary dark:text-white dark:hover:border-gray-500'
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option className="bg-white text-gray-900 dark:bg-dark-secondary dark:text-white" value={ViewMode.Day}>Day</option>
            <option className="bg-white text-gray-900 dark:bg-dark-secondary dark:text-white" value={ViewMode.Week}>Week</option>
            <option className="bg-white text-gray-900 dark:bg-dark-secondary dark:text-white" value={ViewMode.Month}>Month</option>
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-300"
          />
        </div>
      </div>

      {/** Gantt Board */}
      <div className='overflow-hidden rounded-md border border-blue-100 bg-white shadow-sm dark:border-stroke-dark dark:bg-dark-secondary dark:text-white'>
        <div className='timeline'>
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            {...ganttColors}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth='100px'
            barCornerRadius={6}
            barFill={65}
          />
        </div>
        <div className='px-4 pb-5 pt-1'>
          <button className='flex items-center justify-center rounded bg-blue-primary px-3 py-3 text-white hover:bg-blue-600 gap-2 cursor-pointer'
          onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add New Task
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>

    </div>
  )
}

export default TimelineView
