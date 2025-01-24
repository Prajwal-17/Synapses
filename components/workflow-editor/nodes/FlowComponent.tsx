"use client"

import {
  ReactFlowProvider,
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  // MiniMap,
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

export const nodeTypes = {
  triggerNode: TriggerNode,
  placeholderNode: PlaceholderNode,
  actionNode: ActionNode,
}

export default function FlowComponent() {

  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  return (<>
    <div className='w-full h-full relative'>
      <ReactFlowProvider>
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
      </ReactFlowProvider>
    </div>
  </>
  );
};