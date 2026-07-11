import { useCreateProjectMutation } from '@/state/api';
import React, { useState } from 'react'


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


  return (
    <div>
        Modal New Project
    </div>
  )
}

export default ModalNewProject