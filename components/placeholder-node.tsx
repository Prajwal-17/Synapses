import React from "react";
import { useReactFlow, Handle, Position, NodeProps, Node } from "@xyflow/react";
import { BaseNode } from "@/components/base-node";

type PlaceholderNodeData = Node<{
  label: string;
}>;

export function PlaceholderNode({ data, id, selected }: NodeProps<PlaceholderNodeData>) {

  const { setNodes, setEdges, getNodes } = useReactFlow();

  // console.log("getnodes", getNodes())
  const handleClick = () => {
    setEdges((edges) =>
      edges.map((edge) =>
        edge.target === id ? { ...edge, animated: false } : edge
      )
    );

    setNodes((nodes) => {
      const updatedNodes = nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, label: "New Node" },
            type: "triggerNode",
          };
        }
        return node;
      });
      return updatedNodes;
    });

    setNodes((nodes) => {
      return [
        ...nodes,
        { id: "4", position: { x: 0, y: 0 }, data: { label: 'Node 1' }, type: "placeholderNode" },
      ]
    })
  };

  return (
    <BaseNode
      id={id}
      selected={selected}
      className="bg-card text-center w-[150px] border-dashed border-gray-400 text-gray-400 shadow-none p-2"
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
