"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@repo/ui";
import { IconX } from "@tabler/icons-react";
import { Separator } from "@repo/ui";
import ConfigureCard from "../configure-panel/ConfigureCard";
import SetupData from "./SetupData";
import { useSelectNodeStore } from "@/store/selectNodeStore";
import { NodeDataType } from "@repo/types";

export const SetupCard = ({ currNode }: { currNode: NodeDataType }) => {
  const setShowPanel = useSelectNodeStore((state) => state.setShowPanel);
  const panelStep = useSelectNodeStore((state) => state.panelStep);
  const setPanelStep = useSelectNodeStore((state) => state.setPanelStep);

  return (
    <Card className="rounded-lg border-2 border-[#503EBD] bg-white px-0 py-0 sm:px-5 sm:py-5">
      <CardHeader className="p-0 py-0">
        <CardTitle className="flex items-center justify-between p-1">
          <span className="text-xl font-bold">
            {currNode.stepNo + 1}.{" "}
            {currNode.eventType === ""
              ? "Select an event"
              : `${currNode.eventType
                  .toLowerCase()
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}`}
          </span>
          <button onClick={() => setShowPanel("close")}>
            <IconX stroke={2} />
          </button>
        </CardTitle>

        <CardDescription className="flex items-center justify-between gap-2 py-2">
          <div className="flex items-center">
            <button
              onClick={() => setPanelStep("setup")}
              className="flex items-center gap-1 border-blue-900"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black font-semibold text-white">
                1
              </div>

              <div className="font-medium">Setup</div>
            </button>
          </div>

          <div className="flex flex-1 justify-center">
            <Separator className="w-full max-w-[180px] bg-gray-300 dark:bg-gray-200" />
          </div>

          <div className="flex items-center">
            <button
              disabled={!currNode.appType}
              onClick={() => setPanelStep("configure")}
              className="flex items-center gap-1 border-blue-900"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black font-semibold text-white">
                2
              </div>
              <div className="font-medium">Configure</div>
            </button>
          </div>
        </CardDescription>
      </CardHeader>

      {panelStep === "setup" ? (
        <SetupData currNode={currNode} />
      ) : (
        <ConfigureCard currNode={currNode} />
      )}
    </Card>
  );
};
