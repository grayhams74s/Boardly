import React, { useState } from 'react'
import Header from '../(components)/Header';

type Props = {
    activeTab: string;
    setActiveTab: (tabName: string ) => void
}

const ProjectHeader = ({activeTab, setActiveTab}: Props) => {
    const [isModalNewProjectOpen, isetIsModalNewProjectOpen] = useState(false)
  return (
    <div className='px-4 xl:px-6'>
        {/** MODAL NEW PROJECT */}
        <div className='pb-6 pt-6 lg:pb-4 lg:pt-8'>
            <Header name="Product Design Development" />
        </div>
    </div>
  )
};

type TabButtonProps {
    name: string;
    icon: React.ReactNode
    setActiveTab: (tabName: string) => void;
    activeTab: string;
}

const TabButton = ({ name, icon, setActiveTab, activeTab}: TabButtonProps) => {
    const isActive = activeTab === name;

    return (
        <button className={`${}`}>

        </button>
    )
}

export default ProjectHeader