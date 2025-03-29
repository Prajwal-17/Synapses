"use client"

import FlowComponent from "@/components/workflow-editor/nodes/FlowComponent";
import SetupPanel from "@/components/workflow-editor/setup-panel/SetupPanel";
import { ReactFlowProvider } from "@xyflow/react";
import { useEffect, useState } from "react";

export default function Editor() {
  const [isDirty, setIsDirty] = useState(true);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

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