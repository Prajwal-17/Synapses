"use client";

import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import TriggerNode from "./TriggerNode";
import ActionNode from "./ActionNode";
import { PlaceholderNode } from "./Placeholder-node";
import { initialNodes } from "@/constants/InitialNodes";
import { initialEdges } from "@/constants/InitialEdges";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { NodeDataType } from "@repo/types";
import { apiToNodeData } from "@/lib/apiToNodeFormat";
import EditPanel from "../setup-panel/EditPanel";
import { WorkflowFooter } from "@/components/workflow-footer/WorkflowFooter";
import { useWorkflowStore } from "@/store/workflowStore";

export const nodeTypes = {
  triggerNode: TriggerNode,
  placeholderNode: PlaceholderNode,
  actionNode: ActionNode,
};

export default function FlowComponent() {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const { userId, workflowId } = useParams();
  const setName = useWorkflowStore((state) => state.setName);
  const setStatus = useWorkflowStore((state) => state.setStatus);

  useEffect(() => {
    const fetchWorkflowDetails = async () => {
      const response = await fetch(`/api/${userId}/workflows/${workflowId}`, {
        method: "GET",
      });

      const data = await response.json();
      setName(data.workflow.name);
      setStatus(data.workflow.status);

      //updates the new nodeData in zustand
      const nodeData = apiToNodeData(data.workflow);

      if (nodeData) {
        //to create the node object for the frontend
        const fetchedNodes = nodeData.map(
          (node: NodeDataType, index: number) => ({
            id: `${index}`,
            position: {
              x: 0,
              y: index * 100,
            },
            data: {
              label: `Node ${index}`,
            },
            type: index === 0 ? "triggerNode" : "actionNode",
          }),
        );

        fetchedNodes.push({
          id: `${fetchedNodes.length}`,
          position: {
            x: 0,
            y: fetchedNodes.length * 100,
          },
          data: {
            label: "Placeholder Node",
          },
          type: "placeholderNode",
        });

        //to update edges
        const updatedEdges = nodeData.map(
          (node: NodeDataType, index: number) => ({
            id: `e${index}-${index + 1}`,
            source: `${index}`,
            target: `${index + 1}`,
          }),
        );
        setNodes((nds) => {
          nds.splice(0);
          return [...nds, ...fetchedNodes];
        });

        setEdges((eds) => {
          eds.splice(0);
          return [...eds, ...updatedEdges];
        });
      }
    };

    fetchWorkflowDetails();
  }, [userId, workflowId]);

  return (
    <>
      <div className="flex h-full w-full flex-col">
        <div className="relative w-full flex-grow">
          <ReactFlow
            defaultNodes={initialNodes}
            nodes={nodes}
            defaultEdges={initialEdges}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Controls orientation="horizontal" />
            <Background variant={BackgroundVariant.Cross} gap={40} />
            <EditPanel />
          </ReactFlow>
        </div>
        <WorkflowFooter
          userId={userId as string}
          workflowId={workflowId as string}
        />
      </div>
    </>
  );
}
