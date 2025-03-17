"use client"

import { useSidebarStore } from "@/store/sidebarStore"
import { Separator } from "@repo/ui"
import { History, House, PlugZap, Plus, Settings } from "lucide-react"
import Link from "next/link"

export const Sidebar = () => {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen)
  const sidebarWidth = isSidebarOpen ? "w-52" : "w-16"

  return (
    <div className={`${sidebarWidth} fixed left-0 top-16 z-50 h-screen bg-white dark:bg-background shadow-md flex flex-col py-6 transition-all duration-200 ease-in-out`}>
      <div className="flex flex-col gap-4 px-3">
        <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
          <div className="flex items-center justify-center w-5">
            <Plus size={20} />
          </div>
          {isSidebarOpen && <span className="font-medium truncate">Create</span>}
        </div>

        <Link
          href="/home"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex items-center justify-center w-5">
            <House size={20} />
          </div>
          {isSidebarOpen && <span className="font-medium truncate">Home</span>}
        </Link>

        <Separator className="my-1 bg-gray-200 dark:bg-gray-700" />

        <Link
          href="/pipes"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex items-center justify-center w-5">
            <PlugZap size={20} />
          </div>
          {isSidebarOpen && <span className="font-medium truncate">Pipes</span>}
        </Link>

        <Separator className="my-1 bg-gray-200 dark:bg-gray-700" />

        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex items-center justify-center w-5">
            <Settings size={20} />
          </div>
          {isSidebarOpen && <span className="font-medium truncate">Settings</span>}
        </Link>

        <Link
          href="/history"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex items-center justify-center w-5">
            <History size={20} />
          </div>
          {isSidebarOpen && <span className="font-medium truncate">History</span>}
        </Link>

        <Separator className="my-1 bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  )
}