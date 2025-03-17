"use client"

import { nodeToApiFormat } from "@/lib/nodeToApiFormat";
import { useWorkflowStore } from "@/store/workflowStore"
import { usePathname } from "next/navigation"

export default function Save() {

  const pathname = usePathname().split("/");
  const userId = pathname[2];
  const workflowId = pathname[3]
  const getChanges = useWorkflowStore((state) => state.getChanges)
  const saveChanges = useWorkflowStore((state) => state.saveChanges)
  const originalNodeData = useWorkflowStore((state) => state.orignalNodeData)
  const nodeData = useWorkflowStore((state) => state.nodeData)

  const handleSave = async () => {


    try {

      const saveChanges = nodeToApiFormat("e7770b71-eec8-4c60-929f-573d35908a56", "93959914-f676-428c-88b3-de7befc39798", nodeData)

      const response = await fetch(`/api/${userId}/workflows/${workflowId}`, {
        method: "POST",
        body: JSON.stringify(saveChanges),
      })

      const data = await response.json();
      if (!response.ok) {
        console.log("error")
      }

      console.log("fedata", data)
    } catch (error) {
      console.log(error)
    }
  }

  const handlePublish = async () => {

    try {
      const response = await fetch(`/api/${userId}/workflows/${workflowId}/publish`, {
        method: "POST",
        body: JSON.stringify(originalNodeData)
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("error")
      }

      console.log(data)

    } catch (error) {
      console.log(error)
    }
  }

  return (<>
    <div>
      <button
        onClick={handlePublish}
        className='bg-black text-white p-3 rounded-xl absolute right-24 z-50'>
        Publish
      </button>

      <button
        onClick={handleSave}
        className='bg-black text-white p-3 rounded-xl absolute right-0 z-50'>
        Save
      </button>
    </div>
  </>)
}