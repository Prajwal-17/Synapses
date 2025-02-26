"use client"

import { Check, CircleUserRound, LogOut, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/ui"
import { signOut, useSession } from "next-auth/react"
import { Separator } from "@repo/ui"
import Link from "next/link"

export const DropDown = () => {

  const { data: session } = useSession();

  return (<>
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center ">
        <CircleUserRound className="size:6 md:size-7" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" bg-white text-black dark:bg-background dark:text-foreground  px-3 py-1 md:py-2 w-60 space-y-2 mx-5 md:mx-10 my-3">
        <DropdownMenuLabel className="text-xs text-center">
          {session?.user?.email}
        </DropdownMenuLabel>
        <DropdownMenuItem className="flex justify-start items-center bg-slate-200 dark:bg-slate-900 rounded-md focus:bg-slate-200 ">
          <div className="flex items-center gap-3">
            <div>
              <CircleUserRound />
            </div>
            <div>
              <div>
                {session?.user.name}
              </div>
              <div>
                Free
              </div>
            </div>
          </div>
          <div className="ml-auto">
            <Check />
          </div>
        </DropdownMenuItem>
        <Separator orientation="horizontal" className="w-full h-[1px] bg-gray-200 dark:bg-gray-200 " />
        <DropdownMenuItem className=" rounded-md focus:bg-slate-100 hover:cursor-pointer dark:focus:bg-slate-800">
          <Link href="/settings" className="flex items-center gap-2">
            <Settings className="size-5" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()} className="focus:bg-slate-100 rounded-md dark:focus:bg-slate-800 hover:cursor-pointer" >
          <LogOut className="size" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </>)
}