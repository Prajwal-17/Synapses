"use client"

import { nodeToSaveApiFormat } from "@/lib/nodeToSaveApiFormat";
import { useWorkflowStore } from "@/store/workflowStore"
import { usePathname } from "next/navigation"

export default function Save() {

  const pathname = usePathname().split("/");
  const userId = pathname[2] as string;
  const workflowId = pathname[3] as string;
  const originalNodeData = useWorkflowStore((state) => state.orignalNodeData);
  const getChanges = useWorkflowStore((state) => state.getChanges);
  const saveChanges = useWorkflowStore((state) => state.saveChanges)

  const handleSave = async () => {
    try {
      const changes = getChanges();

      if (!userId && !workflowId && !changes) {
        console.log("Nothing to save")
      }
      const nodeChanges = nodeToSaveApiFormat(workflowId, userId, getChanges())

      const response = await fetch(`/api/${userId}/workflows/${workflowId}`, {
        method: "POST",
        body: JSON.stringify(nodeChanges),
      })
      const data = await response.json();

      if (!response.ok) {
        console.log("Something went wrong")
      }
      saveChanges();
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