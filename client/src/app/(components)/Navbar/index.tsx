'use client'

import React from "react";
import { Menu, Moon, Search, Settings, Sun } from "lucide-react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";




const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-dark-bg dark:px-4 dark:py-3">
    {/** SearcH BAR */}
    <div className="flex items-center gap-8">
      {!isSidebarCollapsed ? null : (
        //Passing in the opposite value
        <button onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}>
          <Menu className="h-8 w-8 dark:text-white" />
        </button>
      )}
      <div className="relative h-8 w-[200px]">
        <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
          <Search className="h-4 w-4 dark:text-white" />
        </div>
        <input className="h-full w-full rounded border-none bg-gray-100 py-1 pl-8 pr-3 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-dark-secondary dark:text-white dark:placeholder-white" type="search" placeholder="Search..."/>
      </div>
    </div>

    {/** Icons */}
    <div className="flex items-center">
      <button onClick={() => dispatch(setIsDarkMode(!isDarkMode))} className={isDarkMode ? `h-min w-min rounded p-2 dark:hover:bg-dark-secondary`
        : `h-min w-min rounded p-2 hover:bg-gray-100`}>
          {isDarkMode ? (
            <Sun className="h-6 w-6 cursor-pointer dark:text-white" />
          ): (
            <Moon className="h-6 w-6 cursor-pointer dark:text-white" />
          )}
      </button>
      <Link href="/settings" className="h-min w-min rounded p-2 hover:bg-gray-100 dark:hover:bg-dark-secondary">
        <Settings className="h-6 w-6 cursor-pointer dark:text-white" />
      </Link>

      <div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"></div>
    </div>


  </div>;
};

export default Navbar;
