"use client"

import { usePanelDetails } from "@/store/panelStore"
import axios from "axios"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function Save() {

  const nodeData = usePanelDetails((state) => state.nodeData)
  const pathname = usePathname().split("/");
  const userId = pathname[2];
  const workflowId = pathname[3]


  const handleSave = async () => {
    // console.log(pathname.split("/"))
    // console.log("userid", userId)
    // console.log("workflow id ", workflowId)
    try {
      // const response = await axios.post(`/api/save/8a03d2fd-d48b-4b6d-9d1e-a772a6a20d9e/df54b186-c553-4ec4-a7cd-e56627d45c87`, {
      //   body: nodeData`
      // });
      const value = JSON.stringify(nodeData);
      const response = await axios({
        method: "post",
        url: "/api/save/8a03d2fd-d48b-4b6d-9d1e-a772a6a20d9e/df54b186-c553-4ec4-a7cd-e56627d45c87",
        data: {
          value
          // nodeData
        },
        headers: {
          'Content-Type': 'application/json',
        }
      })
      // const data = response.json();
      console.log("response", response)
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect(() => {
  //   console.log(nodeData);
  //   console.log(pathname.split("/"))
  // }, [nodeData, pathname])

  return (<>
    <button
      onClick={handleSave}
      className='bg-black text-white p-3 rounded-xl absolute right-0 z-50'>
      Save
    </button>
  </>)
}