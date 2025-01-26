"use client"

import { usePanelDetails } from "@/store/panelDetailsStore"
import { usePathname } from "next/navigation"

export default function Save() {

  const pathname = usePathname().split("/");
  const userId = pathname[2];
  const workflowId = pathname[3]
  const getChanges = usePanelDetails((state) => state.getChanges)
  const saveChanges = usePanelDetails((state) => state.saveChanges)

  const handleSave = async () => {

    const changes = getChanges();

    try {
      const response = await fetch(`/api/${userId}/workflows/${workflowId}`, {
        method: "POST",
        body: JSON.stringify(changes),
      })

      const data = await response.json();

      if (!response.ok) {
        console.log("error")
      }

      saveChanges();

      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (<>
    <button
      onClick={handleSave}
      className='bg-black text-white p-3 rounded-xl absolute right-0 z-50'>
      Save
    </button>
  </>)
}