import { useCreateProjectMutation, useCreateTaskMutation } from '@/state/api';
import React, { useState } from 'react'
import Modal from '../Modal';
import { FilePlusCorner } from 'lucide-react';
import { formatISO } from  "date-fns"
import { toast } from "sonner";


type Props = {
    isOpen: boolean;
    onClose: () => void;
}

const ModalNewTask = ({ isOpen, onClose }: Props) => {
    const [ createTask ] =useCreateTaskMutation();
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("")
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = async () => {
        if (!projectName || !startDate  || !endDate ) return

        const formattedStartDate = formatISO(new Date(startDate), { representation: "complete"})
        const formattedEndDate = formatISO(new Date(endDate), { representation: "complete"})

        const toastId = toast.loading("Creating project", {
            description: "Please wait while your project is being created.",
        });

        {/** API CALL FROM OUR REDUX TOOL KIT API QUERY */}
        {/** We Create New Project we're passing in the project list that gets sent to the backend and our backend is going to utilize
            this values once we hit submit. */}
        try {
            await createProject({
                name: projectName,
                description: description,
                startDate: formattedStartDate,
                endDate: formattedEndDate
            }).unwrap();

            toast.success("Project created successfully", {
                id: toastId,
                description: "Your new project is ready.",
            });
            setProjectName("");
            setDescription("");
            setStartDate("");
            setEndDate("");
            onClose();
        } catch {
            toast.error("Failed to create project", {
                id: toastId,
                description: "Please try again.",
            });
        }

    };
    
    const isFormValid = () => {
        return projectName && description && startDate && endDate;
    };

    const inputStyles = "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-teriarty dark:text-white dark:focus:outline-none"


  return (
    <Modal name="Task" isOpen={isOpen} onClose={onClose}>
        {/**We want to make sure that when we hit submit we don't refresh the page and we do that by e.preventDefault */}
        <form action="" className='mt-4 space-y-6' onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
            <input type="text" className={inputStyles} placeholder='Project Name' value={projectName} onChange={(e) => setProjectName(e.target.value)} />

            <textarea className={inputStyles} placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2'>
                 <input type='date' className={inputStyles} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                 <input type='date' className={inputStyles} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className={`mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            >
                <div className='flex items-center justify-center gap-2'>
                    {isLoading ? "Loading..." : "Create Project"} 
                    <FilePlusCorner className='w-6 h-6' />
                </div>
            </button>
        </form>
    </Modal>
  )
}

export default ModalNewTask
