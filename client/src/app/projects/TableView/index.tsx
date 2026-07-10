import Header from '@/app/(components)/Header';
import { useGetTasksQuery } from '@/state/api';
import React from 'react'
import { DataGrid, GridColDef } from "@mui/x-data-grid"

type TableViewProps = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) =>  void;
}

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 200,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span className='inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800'>
        {params.value}
      </span>
    )
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 200,
  },
  {
    field: "startDate",
    headerName: "Due Date",
    width: 200,
  },
  {
    field: "author",
    headerName: "Author",
    width: 200,
    renderCell: (params) => params.value.username || "Unknown"
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 200,
    renderCell: (params) => params.value.username || "Unassigned"
  },
]

const TableView = ({ id, setIsModalNewTaskOpen }: TableViewProps) => {

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
    <div className='h-[540px] w-full px-4 pb-8 xl:px-6 '>
      <div className='pt-5'>
        <Header name="Table" isSmallText />
      </div>
      <DataGrid 
        rows={tasks || []}
        columns={columns} 
      />
    </div>
  )
}

export default TableView