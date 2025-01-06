"use client"

import React from "react"
import { Handle, Position } from "@xyflow/react"

const ActionNode = ({ id }: { id: string }) => {
  return (<>
    <div onClick={() => console.log("done")} className="border-2 p-1.5 border-gray-300 w-32 h-10 rounded-lg bg-white">
      {id !== "1" && <Handle type="target" position={Position.Top} />}
      <div className=" font-medium ">
        {/* <div className="text-[10px] font-medium"> */}
        <div className="text-[10px]">Action Node {id}</div>
        {/* <h2>Trigger Event</h2> */}
        {/* <div>Description</div> */}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  </>)
}

export default ActionNode