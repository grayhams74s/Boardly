'use client'

import { useAppSelector } from '@/app/redux';
import { useGetProjectsQuery } from '@/state/api';
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react"
import { ChevronDown } from "lucide-react";
import React, { useMemo, useState } from 'react'
import "gantt-task-react/dist/index.css"
import Header from '../(components)/Header';


type TaskTypeItems = "task" | "milestone" | "project";

const TimelineView = () => {

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const { data: projects, isLoading, isError } = useGetProjectsQuery();

  const [ displayOptions, setIsDisplayOptions ] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US"
  })

  const ganttColors = isDarkMode
    ? {
        projectBackgroundColor: "#60a5fa",
        projectBackgroundSelectedColor: "#93c5fd",
        projectProgressColor: "#3b82f6",
        projectProgressSelectedColor: "#60a5fa",
        barBackgroundColor: "#60a5fa",
        barBackgroundSelectedColor: "#93c5fd",
        barProgressColor: "#3b82f6",
        barProgressSelectedColor: "#60a5fa",
        milestoneBackgroundColor: "#60a5fa",
        milestoneBackgroundSelectedColor: "#93c5fd",
        arrowColor: "#94a3b8",
        todayColor: "rgba(96, 165, 250, 0.14)",
      }
    : {
        projectBackgroundColor: "#60a5fa",
        projectBackgroundSelectedColor: "#93c5fd",
        projectProgressColor: "#3b82f6",
        projectProgressSelectedColor: "#60a5fa",
        barBackgroundColor: "#60a5fa",
        barBackgroundSelectedColor: "#93c5fd",
        barProgressColor: "#3b82f6",
        barProgressSelectedColor: "#60a5fa",
        milestoneBackgroundColor: "#60a5fa",
        milestoneBackgroundSelectedColor: "#93c5fd",
        arrowColor: "#64748b",
        todayColor: "rgba(96, 165, 250, 0.1)",
      };

  const ganttTasks = useMemo(() => {
    return (
      projects?.map((project) => ({
        start: new Date(project.startDate as string),
        end: new Date(project.endDate as string),
        name: project.name,
        id: `Task-${project.id}`,
        type: "project" as TaskTypeItems,
        progress: 50,
        isDisabled: false
      })) || []
    )
  }, [projects]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setIsDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }))
  }

  if (isLoading) return <div>Loading...</div>;
  
  if (isError) return <div> An Error  occured while fetching Projects</div>

  return (
    <div className='px-4 xl:px-6'>
      {/** Timeline Header */}
      <div className='flex flex-wrap items-center justify-between gap-2 py-5'>

        <Header name="Projects Timeline" />

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
      </div>

    </div>
  )
}

export default TimelineView
