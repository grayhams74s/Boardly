import Header from '@/app/(components)/Header';
import TaskCard from '../../(components)/TaskCard'
import { useGetTasksQuery, Task } from '@/state/api';
import { Plus } from 'lucide-react';
import React from 'react'

type Props = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) =>  void;
}


const ListView =  ({ id, setIsModalNewTaskOpen }: Props) => {

    const {
        data: tasks,
        error,
        isLoading,
      } = useGetTasksQuery({ projectId: Number(id) });      

      if (isLoading) {
        return <div className="p-6 text-sm text-gray-500 dark:text-gray-400">Loading tasks...</div>;
      }

      if (error) {
        return <div className="p-6 text-sm text-red-600 dark:text-red-400">An error occurred while fetching tasks.</div>;
      }

  return (
    <div className='px-4 pb-8 xl:px-6'>
        <div className='flex items-center justify-between py-5'>
            <Header name="List" />
            <button
                type="button"
                onClick={() => setIsModalNewTaskOpen(true)}
                className="flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded bg-blue-500 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-600 cursor-pointer"
            >
                <Plus className="h-4 w-4" />
                Add task
            </button>
        </div>
        {tasks?.length ? (
            <div className='overflow-hidden rounded-md border border-gray-200 bg-white dark:border-stroke-dark dark:bg-dark-secondary'>
                {tasks.map((task: Task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        ) : (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-md border border-dashed border-gray-300 text-center dark:border-stroke-dark">
                <p className="font-medium text-gray-700 dark:text-gray-200">No tasks yet</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add the first task to this project.</p>
            </div>
        )}
    </div>
  )
}

export default ListView
