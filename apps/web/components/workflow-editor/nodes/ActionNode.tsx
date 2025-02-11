"use client";

import React from "react";
import {
  Handle,
  Position
} from "@xyflow/react";
import { IconExclamationCircleFilled } from '@tabler/icons-react';
import { useSelectNodeStore } from "@/store/selectNodeStore";
import { usePanelDetails } from "@/store/panelDetailsStore";
import Image from "next/image";

type ActionNodeProps = {
  id: string,
}

const ActionNode = ({ id }: ActionNodeProps) => {

  const setSelectedNode = useSelectNodeStore((state) => state.setSelectedNode)
  const setShowPanel = useSelectNodeStore((state) => state.setShowPanel)
  const nodeData = usePanelDetails((state) => state.nodeData)

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="bg-blue-600 dark:bg-blue-300"
      />
      <div
        onClick={() => {
          setSelectedNode(id)
          setShowPanel("open")
        }}
        className="w-64 h-auto border-[1.5px] border-dashed dark:border-gray-400 border-gray-900 hover:border-[1px] hover:border-blue-500 hover:border-solid rounded-lg px-3 py-2 bg-white dark:bg-[#242423] shadow-xl transition-colors duration-200"
      >
        <div className="text-sm text-[12px] font-medium mb-2">
          <span className="font-bold text-gray-800 dark:text-gray-100">{id}. </span>
          <span className="text-gray-600 dark:text-gray-300">
            {nodeData[Number(id) - 1].event ? nodeData[Number(id) - 1].event : "Select an event."}
          </span>
        </div>

        <div className="flex items-center gap-2">

          <IconExclamationCircleFilled size="16" className="text-yellow-500" />

          <div className="flex items-center gap-2  border border-gray-300 dark:border-gray-600 rounded-md px-2 py-0.5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition">
            <Image
              src={`/icons/${nodeData[Number(id) - 1].app ? nodeData[Number(id) - 1].app.toLowerCase() + ".svg" : "zap.svg"}`}
              width={12}
              height={12}
              alt="Gmail Icon"
            />
            <span className="text-[10px] font-medium text-gray-800 dark:text-gray-200">
              {nodeData[Number(id) - 1].app ? nodeData[Number(id) - 1].app : "Action"}
            </span>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-blue-600 dark:bg-blue-300"
      />
    </>
  );
};

export default ActionNode