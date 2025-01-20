"use client"

import { Sidebar } from "@/components/sidebar/Sidebar";
import { usePathname } from "next/navigation"

export default function SidebarWarpper() {

  const pathname = usePathname();
  const excludedPaths = ["/", "/auth/login", "/auth/sign-up"]

  if (!excludedPaths.includes(pathname)) {
    return <Sidebar />
  }

  return null;
}