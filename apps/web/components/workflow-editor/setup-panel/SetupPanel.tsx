"use client"

import { useSelectNodeStore } from "@/store/selectNodeStore";
import { SetupCard } from "./SetupCard";
import { NodeDataType } from "@repo/types";
import { useWorkflowStore } from "@/store/workflowStore";

const SetupPanel = () => {

  const showPanel = useSelectNodeStore((state) => state.showPanel)
  const selectedNode = useSelectNodeStore((state) => state.selectedNode)
  const nodeData = useWorkflowStore((state) => state.nodeData);

  return (<>

    {nodeData.length > 0 && nodeData.map((node: NodeDataType, index: any) => (
      <div key={index}>
        {index === selectedNode && showPanel ? (
          <SetupCard currNode={node} />
        ) :
          null
        }
      </div>
    ))
    }
  </>)
}

export default SetupPanel