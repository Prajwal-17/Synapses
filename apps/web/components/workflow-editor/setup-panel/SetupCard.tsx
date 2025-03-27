"use client"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { IconX } from "@tabler/icons-react"
import { Separator } from "@repo/ui"
import { NodeDataType } from "@repo/types";
import { useSelectNodeStore } from "@/store/selectNodeStore";
import ConfigureData from "../configure-panel/ConfigureCard";
import SetupData from "./SetupData";

export const SetupCard = ({ currNode }: { currNode: NodeDataType }) => {

  const setShowPanel = useSelectNodeStore((state) => state.setShowPanel)
  const panelStep = useSelectNodeStore((state) => state.panelStep);
  const setPanelStep = useSelectNodeStore((state) => state.setPanelStep)

  return (
    <Card className="bg-white h-[470px] w-[400px] rounded-lg border-[#503EBD] border-2">

      <CardHeader className="px-3 py-3">
        <CardTitle className="p-1 flex items-center justify-between">
          <span className="text-xl font-bold">
            {currNode.stepNo + 1}. {currNode.eventType === "" ? "Select an event" : `${currNode.eventType}`}
          </span>
          <button onClick={() => setShowPanel("close")}>
            <IconX stroke={2} />
          </button>
        </CardTitle>

        <CardDescription className="flex justify-center items-center gap-2 py-2 px-6">
          <button
            onClick={() => setPanelStep("setup")}
            className="flex justify-center items-center gap-1 border-blue-900"
          >
            <div className="h-5 w-5 flex justify-center items-center font-medium bg-black rounded-full text-white">
              1
            </div>
            <div className="font-medium">
              Setup
            </div>
          </button>

          <Separator
            orientation="horizontal"
            className="w-full h-[1px] bg-gray-300 dark:bg-gray-200"
          />

          <button
            disabled={!currNode.appType}
            onClick={() => setPanelStep("configure")}
            className="flex justify-center items-center gap-1 border-blue-900"
          >
            <div className="h-5 w-5 flex justify-center items-center font-medium bg-black rounded-full text-white">
              2
            </div>
            <div className="font-medium">
              Configure
            </div>
          </button>
        </CardDescription>

      </CardHeader>

      {
        panelStep === "setup" ? (
          <SetupData currNode={currNode} />
        ) : (
          <ConfigureData currNode={currNode} />
        )
      }

    </Card>
  )
}