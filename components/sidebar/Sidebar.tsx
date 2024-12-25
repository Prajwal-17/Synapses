"use client"

import { Separator } from "@radix-ui/react-separator"
import { CircleUserRoundIcon, History, House, PlugZap, Plus, Settings } from "lucide-react"
import Link from "next/link"

export const Sidebar = () => {
  return (<>
    <div className="hover:absolute z-10 flex text-black bg-white dark:bg-background dark:text-white shadow-lg">
      <div className=" group w-16 h-screen  py-7 px-1 flex flex-col items-center hover:items-start hover:px-3 gap-5 hover:w-52">
        <div className="bg-slate-200 dark:bg-slate-900 px-2 py-2 rounded-lg hover:cursor-pointer group-hover:w-full flex justify-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-800">
          <Plus />
          <span className="hidden group-hover:block font-semibold">Create</span>
        </div>
        <Link href="/home" className="px-2 py-2 rounded-lg hover:cursor-pointer group-hover:w-full flex justify-start gap-2 hover:bg-[linear-gradient(to_right,#C9D6FF,#E2E2E2)] dark:hover:bg-[linear-gradient(to_right,_#243B55,_#141E30)]">
          <House />
          <span className="hidden group-hover:block font-medium">Home</span>
        </Link>
        <Separator orientation="horizontal" className="w-full h-[1px] bg-gray-200 dark:bg-gray-700 " />
        <Link href="/pipes" className="px-2 py-2 rounded-lg hover:cursor-pointer group-hover:w-full flex justify-start gap-2 hover:bg-[linear-gradient(to_right,#C9D6FF,#E2E2E2)] dark:hover:bg-[linear-gradient(to_right,_#243B55,_#141E30)]">
          <PlugZap />
          <span className="hidden group-hover:block font-medium">Pipes</span>
        </Link>
        <Separator orientation="horizontal" className="w-full h-[1px] bg-gray-200 dark:bg-gray-700 " />
        <Link href="/settings" className="px-2 py-2 rounded-lg hover:cursor-pointer group-hover:w-full flex justify-start gap-2  hover:bg-[linear-gradient(to_right,#C9D6FF,#E2E2E2)] dark:hover:bg-[linear-gradient(to_right,_#243B55,_#141E30)]">
          <Settings />
          <span className="hidden group-hover:block font-medium">Settings</span>
        </Link>
        <Link href="history" className="px-2 py-2 rounded-lg hover:cursor-pointer group-hover:w-full flex justify-start gap-2 hover:bg-[linear-gradient(to_right,#C9D6FF,#E2E2E2)] dark:hover:bg-[linear-gradient(to_right,_#243B55,_#141E30)]">
          <History />
          <span className="hidden group-hover:block font-medium">History</span>
        </Link>
        <Separator orientation="horizontal" className="w-full h-[1px] bg-gray-200 dark:bg-gray-700 " />
        {/* <div>
          <CircleUserRoundIcon />
        </div> */}
      </div>
      <Separator orientation="vertical" className="w-[1px] h-screen bg-gray-200 dark:bg-gray-700" />
    </div >
  </>)
}