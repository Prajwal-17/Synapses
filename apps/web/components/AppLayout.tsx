"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./navbar/Navbar"
import { Sidebar } from "./sidebar/Sidebar"
import { useSidebarStore } from "@/store/sidebarStore";

export default function AppLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const showSidebar = !["/auth/login", "/auth/sign-up"].includes(pathname)

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          {showSidebar &&
            <div className="">
              <Sidebar />
            </div>
          }
          <main className="flex-1 pt-16 pl-2 sm:pl-16">
            {children}
          </main>
        </div>
      </div>
    </>)
}