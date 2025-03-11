"use client"

import { useSidebarStore } from "@/store/sidebarStore"
import { Separator } from "@repo/ui"
import { History, House, PlugZap, Plus, Settings } from "lucide-react"
import Link from "next/link"

export const Sidebar = () => {

  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen)

  return (<>
    <div className={`${isSidebarOpen ? "w-52 items-start" : "w-16"} group w-16 h-screen py-7 px-1 fixed left-0 top-16 z-50 hidden sm:flex flex-col items-center hover:items-start hover:text-black hover:w-52 hover:px-3 gap-5 text-black bg-white dark:bg-background dark:text-white shadow-lg`}>
      <div className={`${isSidebarOpen ? "w-full" : ""} bg-slate-200 dark:bg-slate-900 px-2 py-2 rounded-lg hover:cursor-pointer group-hover:w-full flex justify-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-800`}>
        <Plus />
        <span className={`${isSidebarOpen ? "block" : "hidden"} group-hover:block font-semibold`}>Create</span>
      </div>

      <Link href="/home" className={`${isSidebarOpen ? "w-full justify-start px-2 py-2" : ""} px-2 py-2 rounded-lg hover:cursor-pointer group-hover:w-full flex justify-start gap-2 hover:bg-[linear-gradient(to_right,#C9D6FF,#E2E2E2)] dark:hover:bg-[linear-gradient(to_right,_#243B55,_#141E30)]`}>
        <House />
        <span className={`${isSidebarOpen ? "block" : "hidden"} group-hover:block font-semibold`}>Home</span>
      </Link>

      <Separator orientation="horizontal" className="w-full h-[1px] bg-gray-200 dark:bg-gray-700" />

      <Link href="/pipes" className={`${isSidebarOpen ? "w-full justify-start px-2 py-2" : ""} px-2 py-2 rounded-lg hover:cursor-pointer group-hover:w-full flex justify-start gap-2 hover:bg-[linear-gradient(to_right,#C9D6FF,#E2E2E2)] dark:hover:bg-[linear-gradient(to_right,_#243B55,_#141E30)]`}>
        <PlugZap />
        <span className={`${isSidebarOpen ? "block" : "hidden"} group-hover:block font-semibold`}>Pipes</span>
      </Link>

      <Separator orientation="horizontal" className="w-full h-[1px] bg-gray-200 dark:bg-gray-700" />

      <Link href="/settings" className={`${isSidebarOpen ? "w-full justify-start px-2 py-2" : ""} px-2 py-2 rounded-lg hover:cursor-pointer group-hover:w-full flex justify-start gap-2 hover:bg-[linear-gradient(to_right,#C9D6FF,#E2E2E2)] dark:hover:bg-[linear-gradient(to_right,_#243B55,_#141E30)]`}>
        <Settings />
        <span className={`${isSidebarOpen ? "block" : "hidden"} group-hover:block font-semibold`}>Settings</span>
      </Link>

      <Link href="history" className={`${isSidebarOpen ? "w-full justify-start px-2 py-2" : ""} px-2 py-2 rounded-lg hover:cursor-pointer group-hover:w-full flex justify-start gap-2 hover:bg-[linear-gradient(to_right,#C9D6FF,#E2E2E2)] dark:hover:bg-[linear-gradient(to_right,_#243B55,_#141E30)]`}>
        <History />
        <span className={`${isSidebarOpen ? "block" : "hidden"} group-hover:block font-semibold`}>History</span>
      </Link>

      {/* <div>
          <CircleUserRoundIcon />
        </div> */}

      <Separator orientation="horizontal" className="w-full h-[1px] bg-gray-200 dark:bg-gray-700" />
    </div>

    {/* <Separator orientation="vertical" className="w-[1px] h-screen bg-gray-200 dark:bg-gray-700" /> */}

  </>)
}