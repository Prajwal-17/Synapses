"use client"

import React from "react";
import { useReactFlow, Handle, Position, NodeProps, Node, getEdgeCenter } from "@xyflow/react";
import { BaseNode } from "@/components/workflow-editor/base-node"

type PlaceholderNodeData = Node<{
  label: string;
}>;

export function PlaceholderNode({ data, id, selected }: NodeProps<PlaceholderNodeData>) {

  const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();

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
            label: 'new node'
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
            label: "+ action node"
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
    })

    console.log("nodes", getNodes())
    console.log("edges", getEdges())
  };

  return (
    <BaseNode
      id={id}
      selected={selected}
      className="bg-card text-center w-[130px] border-dashed border-gray-400 text-gray-400 shadow-none p-2"
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
