"use client"

import React from "react";
import {
  useReactFlow,
  Handle,
  Position,
  NodeProps,
  Node
} from "@xyflow/react";
import { BaseNode } from "@/components/workflow-editor/Base-node"
import { IconCircleDashedPlus } from "@tabler/icons-react";
import { usePanelDetails } from "@/store/panelStore";
import { useSelectNodeStore } from "@/store/selectNodeStore";

type PlaceholderNodeData = Node<{
  label: string;
}>;

export function PlaceholderNode({ data, id, selected }: NodeProps<PlaceholderNodeData>) {

  const { setNodes, setEdges, getNodes } = useReactFlow();
  const nodeData = usePanelDetails((state) => state.nodeData)
  const setNodeData = usePanelDetails((state) => state.setNodeData)
  const setSelectedNode = useSelectNodeStore((state) => state.setSelectedNode)
  const setPanel = useSelectNodeStore((state) => state.setPanel)
  const panel = useSelectNodeStore((state) => state.panel)

  const handleClick = () => {

    setNodes((nodes) => {
      nodes.splice(nodes.length - 1)

      return [
        ...nodes,
        {
          id: `${nodes.length + 1}`,
          position: {
            x: 0,
            y: nodes[nodes.length - 1].position.y + 100
          },
          data: {
            label: <IconCircleDashedPlus stroke={2} />
          },
          type: "actionNode"
        },
        {
          id: `${nodes.length + 2}`,
          position: {
            x: 0,
            y: nodes[nodes.length - 1].position.y + 200,
          },
          data: {
            label: <IconCircleDashedPlus stroke={2} />
          },
          type: "placeholderNode"
        }
      ]
    })


    setEdges((edges) => {
      const currNode = getNodes();
      const lastActionNode = currNode[currNode.length - 2];
      console.log("lastaction", lastActionNode)
      return [
        ...edges,
        {
          id: `e${Number(lastActionNode.id) + 1}-${Number(lastActionNode.id) + 2}`,
          source: `${lastActionNode.id}`,
          target: `${Number(lastActionNode.id) + 1}`
        }
      ]
    });


    setNodeData("")
    setSelectedNode(getNodes().length)

    if (!panel) {
      setPanel()
    }

    // setNodeData((prev)=>{

    // })


    // console.log(nodes)
  };

  return (
    <BaseNode
      id={id}
      selected={selected}
      className="bg-card text-center w-64 h-14 border-dashed border-gray-400 text-gray-400 shadow-none p-2 flex justify-center items-center bg-white dark:bg-[#242423]"
      onClick={handleClick}
    >
      {data.label}
      <Handle
        type="target"
        style={{ visibility: 'hidden' }}
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        type="source"
        style={{ visibility: 'hidden' }}
        position={Position.Bottom}
        isConnectable={false}
      />
    </BaseNode>
  );
}

PlaceholderNode.displayName = "PlaceholderNode";
