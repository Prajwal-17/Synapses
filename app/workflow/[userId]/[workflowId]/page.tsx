"use client"

import FlowComponent from "@/components/workflow-editor/nodes/FlowComponent";
import SetupPanel from "@/components/workflow-editor/setup-panel/SetupPanel";
import axios from "axios";
import { useSession } from "next-auth/react";
import { use, useEffect } from "react";

export default function Editor({
  params
}: {
  params: Promise<{
    userId: string,
    workflowId: string,
  }>
}) {

  const { userId, workflowId } = use(params);

  useEffect(() => {

    const getWorkflowData = async () => {
      try {
        const response = await fetch(`/api/${userId}/workflow/${workflowId}`, {
          method: "GET"
        })
        const data = await response.json();
        console.log(data)

      } catch (error) {
        console.log(error)
      }
    }

    // getWorkflowData()
  }, [userId, workflowId])


  return (<>
    <div className="h-[calc(100vh-4rem)] w-full relative">
      <FlowComponent />

      <div className="absolute right-1 top-14">
        <SetupPanel />
      </div>
    </div>
  </>)
}