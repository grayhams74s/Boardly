'use client'

import { useAppSelector } from '@/app/redux';
import { useGetProjectsQuery, useGetTasksQuery } from '@/state/api';
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react"
import { ChevronDown, Plus } from "lucide-react";
import React, { useMemo, useState } from 'react'
import "gantt-task-react/dist/index.css"
import Header from '../(components)/Header';


type TimelineProps = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

type TaskTypeItems = "task" | "milestone" | "project";

const TimelineView = ( { id, setIsModalNewTaskOpen } : TimelineProps ) => {

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const { data: projects, isLoading, isError } = useGetProjectsQuery();

  const [ displayOptions, setIsDisplayOptions ] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US"
  })

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
      <div className='overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white'>
        <div className='timeline'>
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth='100px'
            projectBackgroundColor={isDarkMode ? "101214" : "#1f2937"}
            projectProgressColor={isDarkMode ? "#1f2937" : "aeb8c2"}
            projectProgressSelectedColor={isDarkMode ? "#000" : "9ba1a6"}
          /> 
        </div>
      </div>

    </div>
  )
}

export default TimelineView
