"use client";

import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { IconExclamationCircleFilled } from "@tabler/icons-react";
import { useSelectNodeStore } from "@/store/selectNodeStore";
import { useWorkflowStore } from "@/store/workflowStore";
import Image from "next/image";
import { motion } from "motion/react";
import { GoTrash } from "react-icons/go";
import DeletePopup from "@/components/DeletePopup";

type TriggerNodeProps = {
  id: string;
};

const TriggerNode = ({ id }: TriggerNodeProps) => {
  const setSelectedNode = useSelectNodeStore((state) => state.setSelectedNode);
  const setShowPanel = useSelectNodeStore((state) => state.setShowPanel);
  const nodeData = useWorkflowStore((state) => state.nodeData);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handleDeleteNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopup(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 250,
            damping: 20,
            duration: 0.3,
          },
        }}
      >
        {id !== "0" && (
          <Handle
            type="target"
            isConnectable={false}
            position={Position.Top}
            className="bg-blue-600 dark:bg-blue-300"
          />
        )}
        <div
          onClick={() => {
            setSelectedNode(id);
            setShowPanel("open");
          }}
          className="h-auto w-64 rounded-md border-[1.5px] border-neutral-100 bg-white px-3 py-2 shadow-xl transition-colors duration-200 hover:border-[1px] hover:border-solid hover:border-blue-500 dark:border-gray-400 dark:bg-[#242423]"
        >
          <div className="mb-2 flex items-center justify-between text-[12px] text-sm font-medium">
            <div>
              <span className="font-bold text-gray-800 dark:text-gray-100">
                1.{" "}
              </span>
              <span className="text-gray-600 dark:text-gray-300">
                {nodeData[0]?.eventType
                  ? nodeData[0].eventType
                      .toLowerCase()
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())
                  : "Choose a trigger for your flow"}
              </span>
            </div>
            <button
              className="rounded-sm p-0.5 text-red-500 transition-colors duration-200 hover:bg-red-100 hover:text-red-700"
              onClick={(e) => handleDeleteNode(e)}
            >
              <GoTrash className="" size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <IconExclamationCircleFilled
              size="16"
              className="text-yellow-500"
            />

            <div className="flex cursor-pointer items-center gap-2 rounded-md border-dashed border-gray-300 bg-gray-50 px-2 py-0.5 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600">
              <Image
                src={`/icons/${nodeData[0]?.appType ? nodeData[0].appType.toLowerCase() + ".svg" : "zap.svg"}`}
                width={12}
                height={12}
                alt={nodeData[0]?.appType as string}
              />
              <span className="text-[10px] font-medium text-gray-800 dark:text-gray-200">
                {nodeData[0]?.appType ? nodeData[0]?.appType : "Trigger"}
              </span>
            </div>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="bg-blue-600 dark:bg-blue-300"
        />
      </motion.div>
      {showPopup && <DeletePopup props={{ showPopup, setShowPopup }} />}
    </>
  );
};

export default TriggerNode;
