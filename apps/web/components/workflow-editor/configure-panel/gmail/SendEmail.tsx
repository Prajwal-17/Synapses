"use client"

import { Input } from "@repo/ui/components/input";
import { NodeData, usePanelDetails } from "@/store/panelDetailsStore";
import { useSelectNodeStore } from "@/store/selectNodeStore";
import { useState } from "react";

const SendEmail = ({ currData }: { currData: NodeData }) => {

  const [config, setConfig] = useState({
    to: "",
    cc: "",
    from: "",
    subject: "",
    body: ""
  });

  const setShowPanel = useSelectNodeStore((state) => state.setShowPanel)
  const updateNodeData = usePanelDetails((state) => state.updateNodeData)

  console.log("data inside send email ", currData)

  return (<>
    <div className="space-y-3">

      <div className="space-y-3">
        <span>To{config.to}</span>
        <Input
          type="email"
          value={currData.config.to}
          onChange={(e) => {
            const updatedConfig = { ...config, to: e.target.value }
            setConfig(updatedConfig)
            updateNodeData(currData.nodeId, { ...currData, config: updatedConfig })
          }}
        />
      </div>

      <div>
        <span>Cc</span>
        <Input
          value={currData.config.cc}
          onChange={(e) => {
            const updatedConfig = { ...config, cc: e.target.value }
            setConfig(updatedConfig)
            updateNodeData(currData.nodeId, { ...currData, config: updatedConfig })
          }}
        />
      </div>

      <div>
        <span>From</span>
        <Input
          value={currData.config.from}
          onChange={(e) => {
            const updatedConfig = { ...config, from: e.target.value }
            setConfig(updatedConfig)
            updateNodeData(currData.nodeId, { ...currData, config: updatedConfig })
          }}
        />
      </div>

      <div>
        <span>Subject</span>
        <Input
          value={currData.config.subject}
          onChange={(e) => {
            const updatedConfig = { ...config, subject: e.target.value }
            setConfig(updatedConfig)
            updateNodeData(currData.nodeId, { ...currData, config: updatedConfig })
          }}
        />
      </div>

      <div>
        <span>Body</span>
        <Input
          value={currData.config.body}
          onChange={(e) => {
            const updatedConfig = { ...config, body: e.target.value }
            setConfig(updatedConfig)
            updateNodeData(currData.nodeId, { ...currData, config: updatedConfig })
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