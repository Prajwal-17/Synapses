import { useReactFlow } from "@xyflow/react";
import { useSelectNodeStore } from "@/store/selectNodeStore";
import { useWorkflowStore } from "@/store/workflowStore";

export const useAddNode = () => {

  const { setNodes, setEdges, getNodes } = useReactFlow();
  const addNode = useWorkflowStore((state) => state.addNode)
  const setSelectedNode = useSelectNodeStore((state) => state.setSelectedNode)
  const setShowPanel = useSelectNodeStore((state) => state.setShowPanel)
  const showPanel = useSelectNodeStore((state) => state.showPanel);

  const handleAddNode = () => {

    setNodes((nodes) => {
      nodes.splice(nodes.length - 1)

      return [
        ...nodes,
        {
          id: `${nodes.length}`,
          position: {
            x: 0,
            y: nodes.length * 100,
          },
          data: {
            label: 'Action Node'
          },
          type: "actionNode"
        },
        {
          id: `${nodes.length + 1}`,
          position: {
            x: 0,
            y: nodes.length * 100 + 100,
          },
          data: {
            label: 'Placeholder Node'
          },
          type: "placeholderNode"
        }
      ]
    })

    setEdges((edges) => {
      const currNode = getNodes();
      const lastActionNode = currNode[currNode.length - 2];
      return [
        ...edges,
        {
          id: `e${Number(lastActionNode?.id)}-${Number(lastActionNode?.id) + 1}`,
          source: `${lastActionNode?.id}`,
          target: `${Number(lastActionNode?.id) + 1}`
        }
      ]
    });

    addNode()
    setSelectedNode(getNodes().length)

    if (!showPanel) {
      setShowPanel("open")
    };

  }
  return handleAddNode
}
