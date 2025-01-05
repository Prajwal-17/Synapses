"use client"

import React, { useEffect } from 'react';
import { ReactFlowProvider, ReactFlow, Background, BackgroundVariant, Position, useNodesState, MiniMap, useEdgesState, Handle } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TriggerNode from './TriggerNode';
import { PlaceholderNode } from '../placeholder-node';

const nodeTypes = {
  triggerNode: TriggerNode,
  placeholderNode: PlaceholderNode,
}

const FlowComponent = () => {

  const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' }, type: "triggerNode" },
    { id: '2', position: { x: 250, y: 5 }, data: { label: 'Node 2' }, type: "placeholderNode" },
    // { id: "3", position: { x: 0, y: 100 }, data: { label: "trigger node" }, type: "triggerNode" },
    // { id: "4", position: { x: 450, y: 300 }, data: { label: "placeholder node" }, type: "placeholderNode" }
  ];
  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' }
  ];

  const [nodes, setNodes, onNodesChanges] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const addNode = () => {

    setNodes((currentNodeArray) => {
      return [
        ...currentNodeArray,
        {
          id: `${currentNodeArray.length + 1}`,
          position: { x: Math.random() * 400, y: Math.random() * 400 },
          data: { label: `New Node ${currentNodeArray.length + 1}` },
          type: "triggerNode"
        }
      ]
    })
  }

  return (
    <div className='w-full h-full'>
      <button onClick={addNode} className='absolute'>click me</button>
      <ReactFlowProvider>
        <ReactFlow
          defaultNodes={nodes}
          nodes={nodes}
          defaultEdges={edges}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          fitView
          style={{ width: '100%', height: '100%' }}
        >
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={10} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowComponent;