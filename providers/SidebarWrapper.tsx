"use client"

import { Sidebar } from "@/components/sidebar/Sidebar";
import { usePathname } from "next/navigation"

export default function SidebarWarpper() {

  const pathname = usePathname();

  if (pathname !== "/") {
    return <Sidebar />
  }

  return null;
}