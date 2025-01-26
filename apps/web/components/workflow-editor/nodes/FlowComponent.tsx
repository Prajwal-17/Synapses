"use client"

import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TriggerNode from './TriggerNode';
import ActionNode from './ActionNode';
import { PlaceholderNode } from './Placeholder-node';
import { initialNodes } from '@/constants/InitialNodes';
import { initialEdges } from '@/constants/InitialEdges';
import Save from '../save';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { NodeData, usePanelDetails } from '@/store/panelDetailsStore';

export const nodeTypes = {
  triggerNode: TriggerNode,
  placeholderNode: PlaceholderNode,
  actionNode: ActionNode,
}

export default function FlowComponent() {

  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const { userId, workflowId } = useParams();
  const initialWorkflowUpdate = usePanelDetails((state) => state.initialWorkflowUpdate)

  useEffect(() => {

    const fetchWorkflowDetails = async () => {
      const response = await fetch(`/api/${userId}/workflows/${workflowId}`, {
        method: "GET"
      });

      const data = await response.json();
      const nodeData = data.nodeData;

      //updates the new nodeData in zustand
      initialWorkflowUpdate(nodeData)

      //to create the node object for the frontend
      const fetchedNodes = nodeData.map((node: NodeData, index: number) => ({
        id: `${index + 1}`,
        position: {
          x: 0,
          y: (index + 1) * 100,
        },
        data: {
          label: `Node ${index + 1}`
        },
        type: index === 0 ? "triggerNode" : "actionNode"
      }
      ));

      fetchedNodes.push(
        {
          id: `${fetchedNodes.length + 1}`,
          position: {
            x: 0,
            y: (fetchedNodes.length + 1) * 100,
          },
          data: {
            label: "Placeholder Node"
          },
          type: "placeholderNode"
        }
      )

      //to update edges 
      const updatedEdges = nodeData.map((node: NodeData, index: number) => ({
        id: `e${index + 1}-${index + 2}`,
        source: `${index + 1}`,
        target: `${index + 2}`
      }))
      setNodes((nds) => {
        nds.splice(0);
        return [...nds, ...fetchedNodes]
      })

      setEdges((eds) => {
        eds.splice(0)
        return [...eds, ...updatedEdges]
      })
    }

    fetchWorkflowDetails();
    // eslint-disable-next-line
  }, [userId, workflowId])

  return (<>
    <div className='w-full h-full relative'>
      <ReactFlow
        defaultNodes={initialNodes}
        nodes={nodes}
        defaultEdges={initialEdges}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        style={{ width: '100%', height: '100%' }}
        proOptions={{ hideAttribution: true }}
      >
        {/* <MiniMap /> */}
        <Save />
        <Controls />
        <Background variant={BackgroundVariant.Cross} gap={40} />
      </ReactFlow>
    </div>
  </>
  );
};