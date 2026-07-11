import Header from '@/app/(components)/Header';
import { useGetTasksQuery } from '@/state/api';
import { format } from 'date-fns';
import React from 'react'
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { dataGridGlass } from '@/app/lib/utils';
import { Plus, PlusCircle } from 'lucide-react';

type TableViewProps = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) =>  void;
}

const formatTableDate = (date?: string) => {
  if (!date) return "";

  return format(new Date(date), "MMM d, yyyy");
};

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
      <span className={`px-3 inline-flex rounded-full text-xs font-semibold leading-5 ${params.value == "Completed" ? "bg-green-100 text-green-800" : "bg-gray-100 text-neutral-500" }`}>
        {params.value}
      </span>
    )
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 120,
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 200,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 200,
    renderCell: (params) => formatTableDate(params.value),
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 200,
    renderCell: (params) => formatTableDate(params.value),
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

const dataGridSx = {
  border: "none",
  "--DataGrid-t-color-background-base": "#ffffff",
  "--DataGrid-t-color-background-overlay": "#ffffff",
  "--DataGrid-t-color-border-base": "#e5e7eb",
  "--DataGrid-t-color-foreground-base": "#111827",
  "--DataGrid-t-color-foreground-muted": "#6b7280",
  "--DataGrid-t-header-background-base": "#f9fafb",
  "--DataGrid-rowBorderColor": "#e5e7eb",
  color: "#111827",
  backgroundColor: "#ffffff",
  "& .MuiDataGrid-withBorderColor": {
    borderColor: "#e5e7eb",
  },
  "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-topContainer": {
    backgroundColor: "#f9fafb !important",
    color: "#374151",
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#f9fafb !important",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 600,
  },
  "& .MuiDataGrid-cell": {
    color: "#374151",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#f9fafb",
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: "#ffffff",
    color: "#374151",
  },
  "& .MuiSvgIcon-root": {
    color: "#6b7280",
  },
  ".dark &": {
    "--DataGrid-t-color-background-base": "#1d1f21",
    "--DataGrid-t-color-background-overlay": "#1d1f21",
    "--DataGrid-t-color-border-base": "#2d3135",
    "--DataGrid-t-color-foreground-base": "#e5e7eb",
    "--DataGrid-t-color-foreground-muted": "#9ca3af",
    "--DataGrid-t-header-background-base": "#24272a",
    "--DataGrid-rowBorderColor": "#2d3135",
    color: "#e5e7eb",
    backgroundColor: "#1d1f21",
    "& .MuiDataGrid-main, & .MuiDataGrid-virtualScroller, & .MuiDataGrid-filler, & .MuiDataGrid-overlay": {
      backgroundColor: "#1d1f21",
    },
    "& .MuiDataGrid-withBorderColor": {
      borderColor: "#2d3135",
    },
    "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-topContainer": {
      backgroundColor: "#24272a !important",
      color: "#f3f4f6",
    },
    "& .MuiDataGrid-columnHeader": {
      backgroundColor: "#24272a !important",
      color: "#f3f4f6",
    },
    "& .MuiDataGrid-columnHeaderTitle, & .MuiDataGrid-cell": {
      color: "#e5e7eb",
    },
    "& .MuiDataGrid-row": {
      backgroundColor: "#1d1f21",
    },
    "& .MuiDataGrid-row:hover": {
      backgroundColor: "#2d3135",
    },
    "& .MuiDataGrid-footerContainer": {
      backgroundColor: "#1d1f21",
      color: "#e5e7eb",
    },
    "& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
      color: "#e5e7eb",
    },
    "& .MuiSvgIcon-root": {
      color: "#d1d5db",
    },
  },
};

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
      <div className='pt-5 flex items-center justify-between'>
        <Header name="Table" isSmallText />
        <button
                type="button"
                onClick={() => setIsModalNewTaskOpen(true)}
                className="flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded bg-blue-500 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-600 cursor-pointer">
                <Plus className="h-4 w-4" />
                Add task
        </button>
      </div>

      <DataGrid 
        rows={tasks || []}
        columns={columns} 
        className={dataGridGlass}
        sx={dataGridSx}
      />
    </div>
  )
}

export default TableView
