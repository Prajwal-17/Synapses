"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconExclamationCircleFilled, IconX } from "@tabler/icons-react"
import { Input } from "../ui/input"
import { ChevronRight } from "lucide-react"
import { Separator } from "@radix-ui/react-separator"
import Gmail from "@/public/gmail.png";
import { useState } from "react";
import { usePanelStore } from "@/store/panelStore";

const App = [
  {
    id: "1",
    Title: "Gmail",
    Icon: Gmail
  },
];

const SetupPanel = () => {

  const panel = usePanelStore((state) => state.panel)
  const setPanel = usePanelStore((state) => state.setPanel)

  if (!panel) {
    return null;
  }

  return (<>
    <Card className="bg-white h-[470px] w-[400px] rounded-lg border-[#503EBD] border-2">
      <CardHeader className="px-3 py-3">
        <CardTitle className="p-1 flex items-center justify-between">
          <span className="text-xl ">
            1. Select the event
          </span>
          <button onClick={() => setPanel()}>
            <IconX stroke={2} />
          </button>
        </CardTitle>
        <CardDescription className="px-3 flex items-center gap-3">
          <div className="flex items-center gap-1 py-1 border-blue-900 border-b-[2px]">
            Setup
            <IconExclamationCircleFilled size="16" className="text-yellow-500" />
          </div>
          <div>
            <ChevronRight size="16" className="text-gray-500" />
          </div>
          <div className="flex items-center gap-1">
            Configure
            <IconExclamationCircleFilled size="16" className="text-yellow-500" />
          </div>
        </CardDescription>
        <Separator orientation="horizontal" className="w-full h-[1px] bg-gray-300 dark:bg-gray-200" />
      </CardHeader>
      <CardContent className="flex flex-col justify-evenly">
        <div>
          App
          <Select>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue className="bg-white" placeholder="Choose App" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup className="bg-white">
                <SelectItem value="Gmail" className="bg-white">Gmail</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <span>Action Event</span>
          <div>
            <Input />
          </div>
        </div>

        <div>
          <span>Account</span>
          <div>
            Choose an account
          </div>
        </div>
      </CardContent>
    </Card>
  </>)
}

export default SetupPanel