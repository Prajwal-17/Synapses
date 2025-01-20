"use client"

import {
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NodeData, usePanelDetails } from "@/store/panelStore";
import { useSelectNodeStore } from "@/store/selectNodeStore";
import Image from "next/image";
import { Label } from "@radix-ui/react-label";
import { integrations } from "@/constants/Integrations";

const SetuptData = ({ currData }: { currData: NodeData }) => {

  const setPanelStep = useSelectNodeStore((state) => state.setPanelStep)
  const updateNodeData = usePanelDetails((state) => state.updateNodeData);

  return (<>
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="app" className="font-semibold">
          App
        </Label>
        <Select
          value={currData.app}
          onValueChange={(value) => {
            updateNodeData(currData.nodeId, { app: value });
          }}
        >
          <SelectTrigger id="app" className="w-full">
            <SelectValue className="bg-white" placeholder="Choose App" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup className="bg-white">
              {integrations.map((app) => (
                <SelectItem
                  key={app.integrationId}
                  value={app.appValue}
                  className="bg-white focus:bg-neutral-200 focus:cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={app.image}
                      height={20}
                      width={20}
                      alt={app.appLabel}
                    />
                    {app.appLabel}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={currData.type === "trigger" ? "trigger-event" : "action-event"}
          className="font-semibold"
        >
          {currData.type === "trigger" ? "Trigger Event" : "Action Event"}
        </Label>
        <Select
          disabled={!currData.app}
          value={currData.event}
          onValueChange={(value) => {
            updateNodeData(currData.nodeId, { event: value });
          }}
        >
          <SelectTrigger
            id={currData.type === "trigger" ? "trigger-event" : "action-event"}
            className="w-full"
          >
            <SelectValue className="bg-white" placeholder="Choose Event" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup className="bg-white">
              {integrations
                .filter((item) => currData.app === item.appValue)
                .map((item) =>
                  item.actions.map((actionItem) => (
                    <SelectItem
                      key={actionItem.eventId}
                      value={actionItem.eventValue}
                      className="bg-white focus:bg-neutral-200 focus:cursor-pointer"
                    >
                      <div className="text-left">
                        <div>{actionItem.eventLabel}</div>
                        <div>{actionItem.description}</div>
                      </div>
                    </SelectItem>
                  ))
                )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="font-semibold">Account</div>
        <div className="bg-gray-100 py-2 px-2 flex justify-between items-center">
          <div className="font-medium">prajwalk1702@gmail.com</div>
          <button className="font-medium text-sm text-blue-500">Switch</button>
        </div>
      </div>

      <div className="mt-6">
        <button
          disabled={!currData.event}
          onClick={() => {
            console.log("arrived")
            setPanelStep("configure")
            console.log("updated")
          }}
          className={`w-full rounded-lg py-2 text-white ${currData.event ? "bg-black hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Continue
        </button>
      </div>

    </CardContent>
  </>)
}

export default SetuptData