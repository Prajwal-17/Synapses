import React from 'react';
import { ReactFlowProvider, ReactFlow, Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 250, y: 5 }, data: { label: 'Node 1' } },
  { id: '2', position: { x: 250, y: 150 }, data: { label: 'Node 2' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const FlowComponent = () => {
  return (
    <div className='w-full h-full'>
      <ReactFlowProvider>
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          fitView
          style={{ width: '100%', height: '100%' }}
        >
          <Background variant={BackgroundVariant.Dots} gap={10} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowComponent;
