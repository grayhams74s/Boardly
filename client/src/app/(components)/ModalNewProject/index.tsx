import { useCreateProjectMutation } from '@/state/api';
import React, { useState } from 'react'
import Modal from '../Modal';


type Props = {
    isOpen: boolean;
    onClose: () => void;
}

const ModalNewProject = ({ isOpen, onClose }: Props) => {
    const [createProject, { isLoading }] = useCreateProjectMutation();
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("")
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = async () => {
        if (!projectName || !startDate  || !endDate ) return

        [/** API CALL FROM OUR REDUX TOOL KIT API QUERY */]
        {/** We Create New Project we're passing in the project list that gets sent to the backend and our backend is going to utilize
            this values once we hit submit. */}
        await createProject({
            name: projectName,
            description: description,
            startDate: startDate,
            endDate: endDate
        })

    };
    
    const isFormValid = () => {
        return projectName && description && startDate && endDate;
    };

    const inputStyles = "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-teriarty dark:text-white dark:focus:outline-none"


  return (
    <Modal name="Task" isOpen={isOpen} onClose={onClose}>
        {/**We want to make sure that when we hit submit we don't refresh the page and we do that by e.preventDefault */}
        <form action="" className='mt-4 space-y-6' onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
            <input type="text" className={inputStyles} placeholder='Project Name' value={projectName} />
        </form>
    </Modal>
  )
}

export default ModalNewProject