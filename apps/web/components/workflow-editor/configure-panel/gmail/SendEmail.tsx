"use client"

import { Input } from "@repo/ui";
import { useSelectNodeStore } from "@/store/selectNodeStore";
import { NodeDataType } from "@repo/types";
import { useWorkflowStore } from "@/store/workflowStore";

const SendEmail = ({ currNode }: { currNode: NodeDataType }) => {
  const setShowPanel = useSelectNodeStore((state) => state.setShowPanel)
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)

  return (<>
    <div className="space-y-3">

      <div className="space-y-3">
        <span>To</span>
        <Input
          type="email"
          value={currNode.payload.to}
          onChange={(e) => {
            const updatedPayload = { ...currNode.payload, to: e.target.value }
            updateNodeData(currNode.stepNo, { ...currNode, payload: updatedPayload })
          }}
        />
      </div>

      <div>
        <span>Cc</span>
        <Input
          value={currNode.payload.cc}
          onChange={(e) => {
            const updatedPayload = { ...currNode.payload, cc: e.target.value }
            updateNodeData(currNode.stepNo, { ...currNode, payload: updatedPayload })
          }}
        />
      </div>

      <div>
        <span>From</span>
        <Input
          value={currNode.payload.from}
          onChange={(e) => {
            const updatedPayload = { ...currNode.payload, from: e.target.value }
            updateNodeData(currNode.stepNo, { ...currNode, payload: updatedPayload })
          }}
        />
      </div>

      <div>
        <span>Subject</span>
        <Input
          value={currNode.payload.subject}
          onChange={(e) => {
            const updatedPayload = { ...currNode.payload, subject: e.target.value }
            updateNodeData(currNode.stepNo, { ...currNode, payload: updatedPayload })
          }}
        />
      </div>

      <div>
        <span>Body</span>
        <Input
          value={currNode.payload.body}
          onChange={(e) => {
            const updatedPayload = { ...currNode.payload, body: e.target.value }
            updateNodeData(currNode.stepNo, { ...currNode, payload: updatedPayload })
          }}
        />
      </div>

      <button
        onClick={() => { setShowPanel("close") }}
        className="bg-black w-full text-white py-2 font-medium rounded-xl"
      >
        Continue
      </button>

    </div>
  </>)
}

export default SendEmail