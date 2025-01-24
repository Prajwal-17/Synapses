"use client"

import { NodeData, usePanelDetails } from "@/store/panelStore";
import { useSelectNodeStore } from "@/store/selectNodeStore";
import { SetupCard } from "./SetupCard";

const SetupPanel = () => {

  const showPanel = useSelectNodeStore((state) => state.showPanel)
  const selectedNode = useSelectNodeStore((state) => state.selectedNode)
  const nodeData: NodeData[] = usePanelDetails((state) => state.nodeData);

  return (<>

    {
      nodeData.map((item: NodeData, index) => (
        <div key={index}>
          {item.stepNo === selectedNode && showPanel ? (
            <SetupCard currData={item} />
          ) :
            null
          }
        </div>
      ))
    }
  </>)
}

export default SetupPanel