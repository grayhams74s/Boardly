import { useGetTasksQuery } from '@/state/api';
import React from 'react'


type TimelineProps = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const TimelineView = ( { id, setIsModalNewTaskOpen } : TimelineProps ) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });      

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div> An Error  occured while fetching tasks</div>

  return (
    <div>

    </div>
  )
}

export default TimelineView