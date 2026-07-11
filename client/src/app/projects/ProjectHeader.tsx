"use client"

import React, { useState } from "react";
import Header from "../(components)/Header";
import { Clock, Filter, Grid, Grid3X3, List, PlusSquare, Share2, Table } from "lucide-react";

type Props = {
    activeTab: string;
    setActiveTab: (tabName: string) => void;
};

const ProjectHeader = ({ activeTab, setActiveTab }: Props) => {
    const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);

  return (
    <div className="px-4 xl:px-6">
        <ModalNewProject 
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
        />
        {/** MODAL NEW PROJECT */}
        <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
            <Header name="Product Design Development" />
            buttonComponent={
                <button className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
                    onClick={() => setIsModalNewProjectOpen(true)}
                >
                    <PlusSquare className="mr-2  h-5 w-5" />
                    New Project
                </button>
            }
        </div>

        {/** TABS */}
        <div className="flex flex-wrap-reverse items-center justify-between gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark">
            <div className="flex flex-1 items-center gap-2 md:gap-4">
                
            <TabButton
                name="Board" 
                icon={<Grid3X3 className="h-5 w-5" />}
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                />

            <TabButton
                name="List" 
                icon={<List className="h-5 w-5" />}
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                />

            <TabButton
                name="Timeline" 
                icon={<Clock className="h-5 w-5" />}
                setActiveTab={setActiveTab}
                activeTab={activeTab}
             />

            <TabButton
                name="Table" 
                icon={<Table className="h-5 w-5" />}
                setActiveTab={setActiveTab}
                activeTab={activeTab}
             />
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2">
                <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300 cursor-pointer">
                     <Filter className="w-5 h-5" />
                </button>

                <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300 cursor-pointer">
                     <Share2 className="w-5 h-5" />
                </button>

                <div className="relative flex items-center">
                    <Grid3X3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500 cursor-pointer" />
                    <input type="text" placeholder="Search Task" className="h-8 rounded-md border border-gray-200 py-1 pl-10 pr-4 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white cursor-pointer"/>
                </div>
            </div>
        </div>
    </div>
  );
};

type TabButtonProps = {
    name: string;
    icon: React.ReactNode;
    setActiveTab: (tabName: string) => void;
    activeTab: string;
};

const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
    const isActive = activeTab === name;

    return (
        <button
            onClick={() => setActiveTab(name)}
            className={`cursor-pointer relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:bottom-[-9px] after:left-0 after:h-[2px] after:w-full hover:text-blue-600 dark:text-neutral-500 dark:hover:text-white sm:px-2 lg:px-4 ${
                isActive ? "text-blue-600 after:bg-blue-600 dark:text-white" : ""
            }`}
        >
            {icon}
            <span>{name}</span>
        </button>
    );
};

export default ProjectHeader;
