"use client"

import { useSession } from "next-auth/react"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Create() {

  const { data: session } = useSession();
  const [workflowURL, setWorkflowURL] = useState("");

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/${session?.user.id}/workflows`, {
          method: "GET",
        });
        const data = await response.json();
        setWorkflowURL(`http://localhost:3000/workflow/${data.workflow.userId}/${data.workflow.id}`)
      } catch (error) {
        console.log(error)
      }
    }

    fetchWorkflow()
  }, [])

  const createWorkflow = async () => {
    try {
      const response = await fetch(`/api/${session?.user.id}/workflows`, {
        method: "POST",
      });
      const data = await response.json();
      setWorkflowURL(`http://localhost:3000/workflow/${data.workflow.userid}/${data.workflow.id}`)
      console.log(data);

    } catch (error) {
      console.log(error)
    }
  }

  return (<>
    <div>
      Temporary Create

    </div>
    <button onClick={createWorkflow} className="bg-gray-300 p-2 rounded-xl">
      Create new Workflow
    </button>
    <button >
      Test
    </button>
    <button className="bg-gray-300 p-2 rounded-xl">
      <Link href={workflowURL}>
        Go To workflow editor
      </Link>
    </button>
  </>)
}