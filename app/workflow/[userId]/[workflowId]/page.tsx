"use client"

import FlowComponent from "@/components/workflow-editor/nodes/FlowComponent";
import SetupPanel from "@/components/workflow-editor/setup-panel/SetupPanel";

export default function Editor() {
  return (<>
    <div className="h-[calc(100vh-4rem)] w-full relative">
      <FlowComponent />

      <div className="absolute right-1 top-14">
        <SetupPanel />
      </div>
    </div>
  </>)
}