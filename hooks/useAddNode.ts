import { useReactFlow } from "@xyflow/react";
import { usePanelDetails } from "@/store/panelStore";
import { useSelectNodeStore } from "@/store/selectNodeStore";

export const useAddNode = () => {

  const { setNodes, setEdges, getNodes } = useReactFlow();
  const setNodeData = usePanelDetails((state) => state.setNodeData)
  const setSelectedNode = useSelectNodeStore((state) => state.setSelectedNode)
  const setShowPanel = useSelectNodeStore((state) => state.setShowPanel)
  const showPanel = useSelectNodeStore((state) => state.showPanel);

  const handleAddNode = () => {

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
            label: 'Placeholder Node'
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
            label: 'Placeholder Node'
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
    });

    setNodeData()
    setSelectedNode(getNodes().length)

    if (!showPanel) {
      setShowPanel("open")
    };

  }
  return handleAddNode
}
