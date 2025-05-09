"use client";

import { CardContent } from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { useWorkflowStore } from "@/store/workflowStore";
import { useSelectNodeStore } from "@/store/selectNodeStore";
import Image from "next/image";
import { Label } from "@repo/ui";
import { integrations } from "@/constants/Integrations";
import { NodeDataType } from "@repo/types";
import Connection from "../integration/Connection";

const SetupData = ({ currNode }: { currNode: NodeDataType }) => {
  const setPanelStep = useSelectNodeStore((state) => state.setPanelStep);
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  return (
    <>
      <CardContent className="space-y-6 p-0">
        <div className="space-y-2">
          <Label htmlFor="appType" className="font-semibold">
            App
          </Label>
          <Select
            value={currNode.appType}
            onValueChange={(value) => {
              updateNodeData(currNode.stepNo, { appType: value });
            }}
          >
            <SelectTrigger id="appType" className="w-full">
              <SelectValue className="bg-white" placeholder="Choose App" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup className="bg-white">
                {integrations.map((appType) => (
                  <SelectItem
                    key={appType.integrationId}
                    value={appType.appValue}
                    className="bg-white focus:cursor-pointer focus:bg-neutral-200"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={appType.image}
                        height={20}
                        width={20}
                        alt={appType.appLabel}
                      />
                      {appType.appLabel}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={
              currNode.type === "trigger" ? "trigger-event" : "action-event"
            }
            className="font-semibold"
          >
            {currNode.type === "trigger" ? "Trigger Event" : "Action Event"}
          </Label>
          <Select
            disabled={!currNode.appType}
            value={currNode.eventType}
            onValueChange={(value) => {
              updateNodeData(currNode.stepNo, { eventType: value });
            }}
          >
            <SelectTrigger
              id={
                currNode.type === "trigger" ? "trigger-event" : "action-event"
              }
              className="w-full"
            >
              <SelectValue className="bg-white" placeholder="Choose Event" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup className="bg-white">
                {integrations
                  .filter((item) => currNode.appType === item.appValue)
                  .map((item) =>
                    currNode.stepNo === 0
                      ? item.trigger?.map((triggerItem) => (
                          <SelectItem
                            key={triggerItem.eventId}
                            value={triggerItem.eventValue}
                            className="bg-white focus:cursor-pointer focus:bg-neutral-200"
                          >
                            <div className="text-left">
                              <div>{triggerItem.eventLabel}</div>
                              <div>{triggerItem.description}</div>
                            </div>
                          </SelectItem>
                        ))
                      : item.actions.map((actionItem) => (
                          <SelectItem
                            key={actionItem.eventId}
                            value={actionItem.eventValue}
                            className="bg-white focus:cursor-pointer focus:bg-neutral-200"
                          >
                            <div className="text-left">
                              <div>{actionItem.eventLabel}</div>
                              <div>{actionItem.description}</div>
                            </div>
                          </SelectItem>
                        )),
                  )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="font-semibold">Account</div>
          <div className="flex items-center justify-between">
            <Connection
              connectionId={currNode.connectionId}
              appType={currNode.appType}
              stepNo={currNode.stepNo}
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            disabled={!currNode.eventType}
            onClick={() => {
              setPanelStep("configure");
            }}
            className={`w-full rounded-lg py-2 text-white ${
              currNode.eventType
                ? "bg-black hover:bg-gray-800"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            Continue
          </button>
        </div>
      </CardContent>
    </>
  );
};

export default SetupData;
