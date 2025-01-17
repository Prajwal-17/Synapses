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
import { useEffect, useState } from "react";
import { NodeData, usePanelDetails } from "@/store/panelStore";
import { useSelectNodeStore } from "@/store/selectNodeStore";

const App = [
  {
    id: "1",
    Title: "Gmail",
    Icon: Gmail
  },
];

const SetupPanel = () => {

  const panel = useSelectNodeStore((state) => state.panel)
  const setPanel = useSelectNodeStore((state) => state.setPanel)

  const [panelStep, setPanelStep] = useState<string>("setup")
  /**------------------------------------------------------------------- */
  const setNodeData = usePanelDetails((state) => state.setNodeData);
  const selectedNode = useSelectNodeStore((state) => state.selectedNode)
  const nodeData: NodeData[] = usePanelDetails((state) => state.nodeData);
  const [app, setApp] = useState("")
  const [triggerEvent, setTriggerEvent] = useState("")
  const [account, setAccount] = useState("")

  const [config, setConfig] = useState({
    to: "",
    cc: "",
    from: "",
    body: ""
  })

  useEffect(() => {
    console.log(nodeData, selectedNode)
  }, [nodeData, selectedNode])


  // if (!panel) {
  //   return null;
  // }

  return (<>

    {
      nodeData.map((data) => (
        <div key={data.stepNo}>

          {data.stepNo === selectedNode && panel ? (
            <div>
              {/* render the data of the node config part  */}
              <Card className="bg-white h-[470px] w-[400px] rounded-lg border-[#503EBD] border-2">
                <CardHeader className="px-3 py-3">
                  <CardTitle className="p-1 flex items-center justify-between">
                    <span className="text-xl ">
                      {data.stepNo}. Select the event {data.app}
                    </span>
                    <button onClick={() => setPanel()}>
                      {/* <button > */}
                      <IconX stroke={2} />
                    </button>
                  </CardTitle>
                  <CardDescription className="px-3 flex items-center gap-3">
                    <div onClick={() => setPanelStep("setup")} className="flex items-center gap-1 py-1 border-blue-900 border-b-[2px]">
                      Setup
                      <IconExclamationCircleFilled size="16" className="text-yellow-500" />
                    </div>
                    <div>
                      <ChevronRight size="16" className="text-gray-500" />
                    </div>
                    <div onClick={() => setPanelStep("configure")} className="flex items-center gap-1">
                      Configure
                      <IconExclamationCircleFilled size="16" className="text-yellow-500" />
                    </div>
                  </CardDescription>
                  <Separator orientation="horizontal" className="w-full h-[1px] bg-gray-300 dark:bg-gray-200" />
                </CardHeader>

                {
                  panelStep === "setup" ? (
                    <CardContent className="flex flex-col justify-evenly">
                      <div>
                        {data.app}
                        <Select>
                          <SelectTrigger className="w-[180px] bg-white ">
                            <SelectValue className="bg-white" placeholder="Choose App" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectGroup className="bg-white">
                              <SelectItem value="Gmail" className="bg-white">Gmail</SelectItem>
                              <SelectItem value="Github" className="bg-white">Github</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <span>{data.event}</span>
                        <div>
                          <Input />
                        </div>
                      </div>

                      <div>
                        <span>Account</span>
                        <div>
                          Choose an account {data.account}
                        </div>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent className="h-[330px] flex flex-col justify-evenly overflow-auto">
                      <div>
                        <span>To{data.config.to}</span>
                        <Input
                          type="email"
                          value={config.to}
                          onChange={(e) => setConfig(prev => ({ ...prev, to: e.target.value }))}
                        />
                      </div>

                      <div>
                        <span>Cc</span>
                        <Input
                          value={config.cc}
                          onChange={(e) => setConfig(prev => ({ ...prev, cc: e.target.value }))}
                        />
                      </div>

                      <div>
                        <span>From</span>
                        <Input
                          value={config.from}
                          onChange={(e) => setConfig(prev => ({ ...prev, from: e.target.value }))}
                        />
                      </div>

                      <div>
                        <span>Body</span>
                        <Input
                          value={config.body}
                          onChange={(e) => setConfig(prev => ({ ...prev, body: e.target.value }))}
                        />
                      </div>
                    </CardContent>
                  )
                }

              </Card>
            </div>
          ) : null}
        </div>
      ))
    }
  </>)
}

export default SetupPanel