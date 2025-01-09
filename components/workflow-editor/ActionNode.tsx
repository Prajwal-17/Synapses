"use client";

import React from "react";
import {
  Handle,
  Position
} from "@xyflow/react";
import Image from "next/image";
import Gmail from "@/public/gmail.png";
import { IconExclamationCircleFilled } from '@tabler/icons-react';

type ActionNodeProps = {
  id: string,
}

const ActionNode = ({ id }: ActionNodeProps) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="bg-blue-600 dark:bg-blue-300"
      />
      <div className="w-64 h-auto border-[1.5px] border-dashed border-gray-900 hover:border-[1px] hover:border-blue-500 hover:border-solid rounded-lg px-3 py-2 bg-white dark:bg-[#242423] shadow-xl transition-colors duration-200">        <div className="text-sm text-[12px] font-medium mb-2">
        <span className="font-bold text-gray-800 dark:text-gray-100">{id}. </span>
        <span className="text-gray-600 dark:text-gray-300">
          Select an event.
        </span>
      </div>

        <div className="flex items-center gap-2">

          <IconExclamationCircleFilled size="16" className="text-yellow-500" />

          <div className="flex items-center gap-2  border border-gray-300 dark:border-gray-600 rounded-md px-2 py-0.5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition">
            <Image
              src={Gmail}
              width={12}
              height={12}
              alt="Gmail Icon"
            />
            <span className="text-[10px] font-medium text-gray-800 dark:text-gray-200">
              Gmail
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