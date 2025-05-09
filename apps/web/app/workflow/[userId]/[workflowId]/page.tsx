"use client";

import FlowComponent from "@/components/workflow-editor/nodes/FlowComponent";
import { useWorkflowStore } from "@/store/workflowStore";
import { ReactFlowProvider } from "@xyflow/react";
import { useEffect } from "react";

export default function Editor() {
  const nodeData = useWorkflowStore((state) => state.nodeData);
  const saveState = useWorkflowStore((state) => state.saveState);
  const setSaveState = useWorkflowStore((state) => state.setSaveState);

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

  return (
    <>
      <div className="relative h-[calc(100vh-4rem)] w-full">
        <ReactFlowProvider>
          <FlowComponent />
        </ReactFlowProvider>
      </div>
    </>
  );
}
