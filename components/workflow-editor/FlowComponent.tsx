"use client"

import {
  ReactFlowProvider,
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  MiniMap,
  useEdgesState,
  Controls
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TriggerNode from './TriggerNode';
import ActionNode from './ActionNode';
import { PlaceholderNode } from './Placeholder-node';
import { IconCircleDashedPlus } from '@tabler/icons-react';
import SetupPanel from './SetupPanel';

export const nodeTypes = {
  triggerNode: TriggerNode,
  placeholderNode: PlaceholderNode,
  actionNode: ActionNode,
}

const FlowComponent = () => {

  const initialNodes = [
    {
      id: '1',
      position: {
        x: 0,
        y: 0
      },
      data: {
        label: 'Node 1'
      },
      type: "triggerNode"
    },
    {
      id: '2',
      position: {
        x: 0,
        y: 100
      },
      data: {
        label: <IconCircleDashedPlus stroke={2} />
      },
      type: "placeholderNode"
    },
  ];
  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' }
  ];

  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  return (<>
    <div className='w-full h-full'>
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
          <Controls />
          <Background variant={BackgroundVariant.Cross} gap={40} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  </>
  );
};

export default FlowComponent;