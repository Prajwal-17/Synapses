"use client"

import FlowComponent from "@/components/workflow-editor/nodes/FlowComponent";
import SetupPanel from "@/components/workflow-editor/setup-panel/SetupPanel";
import { useWorkflowStore } from "@/store/workflowStore";
import { ReactFlowProvider } from "@xyflow/react";
import { useEffect, useState } from "react";

export default function Editor() {

  const nodeData = useWorkflowStore((state) => state.nodeData)
  const saveState = useWorkflowStore((state) => state.saveState)
  const setSaveState = useWorkflowStore((state) => state.setSaveState)

  // Track changes whenever nodeData updates
  useEffect(() => {
    setSaveState();
  }, [nodeData, setSaveState]);

  // Prevent user from exiting with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (saveState) {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [saveState]);

  return (<>
    <div className="h-[calc(100vh-4rem)] w-full relative">
      <ReactFlowProvider>
        <FlowComponent />
      </ReactFlowProvider>

      <div className="absolute right-1 top-14">
        <SetupPanel />
      </div>
    </div>
  </>)
}