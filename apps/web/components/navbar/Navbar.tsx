"use client"

import { Separator } from "@repo/ui"
import { Menu, MoonStar, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { DropDown } from "./Dropdown"
import { useSidebarStore } from "@/store/sidebarStore"
import { usePathname } from "next/navigation"

export const Navbar = () => {

  const { theme, setTheme } = useTheme()
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar)
  const pathname = usePathname();
  const showMenu = !["/auth/login", "/auth/sign-up"].includes(pathname)

  return (
    <>
      <nav className="text-black bg-white dark:bg-background dark:text-white h-16 fixed top-0 right-0 left-0 z-50">
        <div className="flex items-center justify-between px-3 md:px-5 py-2">

          <div className="flex items-center">
            {
              showMenu && <div onClick={toggleSidebar} className="text-center hover:cursor-pointer">
                <Menu />
              </div>
            }
            <Link href="/" className="text-2xl md:text-3xl  font-bold mx-6 hover:cursor-pointer">
              Synapses
            </Link>
          </div>

          <div className="flex gap-3">
            <div className=" p-2 rounded-md hover:cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center">
              {
                theme == "dark" || theme == "system" ? (
                  < button >
                    <MoonStar onClick={() => { setTheme("light") }} className="size-5 md:size-6" />
                  </button>
                ) : (
                  <button>
                    <Sun onClick={() => { setTheme("dark") }} className="size-5 md:size-6" />
                  </button>
                )
              }
            </div>
            <div className="hover:cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md p-2">
              <DropDown />
            </div>
          </div>
        </div>
        <Separator orientation="horizontal" className="w-full h-[1px] bg-gray-200 dark:bg-gray-700" />
      </nav >
    </>
  )
}