"use client"

import { Navbar } from "@/components/navbar/Navbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { usePathname } from "next/navigation"

export default function NavbarWrapper() {
  const pathname = usePathname();

  if (pathname !== "/") {
    return (
      <div>
        <Navbar />
        {/* <Sidebar /> */}
      </div>
    )
  } else {
    return null
  }
}
