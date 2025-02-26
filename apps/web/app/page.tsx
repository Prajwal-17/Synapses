"use client"

import { useTheme } from "next-themes";

export default function Page() {

  const { setTheme } = useTheme()

  const handleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return (<>
    {/* <div className="h-screen dark:bg-background dark:text-foreground text-foreground bg-background">
      <h1 className="text-3xl text-primary font-dm_sans">Hyper Pipe </h1>
      <p className="text-text w-full h-20 text-center bg-secondary text-2xl font-medium">Automation Workflows</p>
      <h1>Landing Page</h1>
      <button onClick={handleTheme}>Theme change</button>
    </div> */}
  </>)
}