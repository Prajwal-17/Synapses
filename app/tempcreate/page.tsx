"use client"

import { usePanelDetails } from "@/store/panelStore";
import { useSession } from "next-auth/react"
import { useEffect } from "react";

export default function Create() {

  const { data: session } = useSession();

  const createWorkflow = async () => {
    try {
      const response = await fetch(`/api/${session?.user.id}/workflows`, {
        method: "POST",
      });
      const data = await response.json();
      console.log(data);

    } catch (error) {
      console.log(error)
    }
  }

  const getChanges = usePanelDetails((state) => state.getChanges)

  useEffect(() => {
    console.log(getChanges())
  }, [])



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
  </>)
}