"use client"

import { useSession } from "next-auth/react"

export default function Page() {

  const { data: session, status } = useSession();

  return (<>
    <div>
      <h1>Hyper Pipe </h1>
      <div>{session?.user.email}</div>
      <p>Automation Workflows</p>
    </div>
  </>)
}