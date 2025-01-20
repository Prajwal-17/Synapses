"use client"

import React from "react";
import {
  Handle,
  Position,
  NodeProps,
  Node
} from "@xyflow/react";
import { BaseNode } from "@/components/workflow-editor/nodes/Base-node"
import { IconCircleDashedPlus } from "@tabler/icons-react";
import { useAddNode } from "@/hooks/useAddNode";

type PlaceholderNodeData = Node<{
  label: string;
}>;

export function PlaceholderNode({ id, selected }: NodeProps<PlaceholderNodeData>) {

  const handleAddNode = useAddNode();

  return (
    <BaseNode
      id={id}
      selected={selected}
      className="bg-card text-center w-64 h-14 border-dashed border-gray-400 text-gray-400 shadow-none p-2 flex justify-center items-center bg-white dark:bg-[#242423]"
      onClick={handleAddNode}
    >
      <IconCircleDashedPlus stroke={2} />
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