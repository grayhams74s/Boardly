"use client"

import React, { use, useState } from 'react'
import ProjectHeader from '../ProjectHeader'
import BoardView from '../BoardView'


type Props = {
    params: Promise<{id: string}>
}


const Projects = ({ params }: Props) => {

    const { id } = use(params);
    const [ activeTab, setActiveTab ] = useState("Board");
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] =  useState(false);



  return (
    <div>
      {/** MODAL NEW TASKS */}

      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      { activeTab == "Board" && (
        <BoardView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
    </div>  
  )
}


export default Projects
