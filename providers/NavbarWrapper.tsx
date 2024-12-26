"use client"

import { Navbar } from "@/components/navbar/Navbar";
import { usePathname } from "next/navigation"

export default function NavbarWrapper() {
  const pathname = usePathname();

  if (pathname !== "/") {
    return <Navbar />
  } else {
    return null
  }
}
