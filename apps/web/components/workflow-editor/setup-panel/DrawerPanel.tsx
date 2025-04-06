import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@repo/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { NodeDataType } from "@repo/types";
import SetupData from "./SetupData";
import ConfigureCard from "../configure-panel/ConfigureCard";

export const DrawerPanel = ({
  props,
}: {
  props: {
    showPanel: boolean;
    setShowPanel: (value: string) => void;
    currNode: NodeDataType;
  };
}) => {
  return (
    <>
      <Drawer
        open={props.showPanel}
        onOpenChange={() => props.setShowPanel("close")}
      >
        <DrawerContent className="px-2 sm:px-16">
          <DrawerHeader>
            <DrawerTitle className="text-2xl">
              <span>{props.currNode.stepNo + 1}. </span>
              {props.currNode.eventType
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </DrawerTitle>
          </DrawerHeader>
          <DrawerFooter>
            <Tabs defaultValue="setup" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="setup">
                  Setup
                </TabsTrigger>
                <TabsTrigger className="w-full" value="configure">
                  Configure
                </TabsTrigger>
              </TabsList>
              <TabsContent value="setup">
                <SetupData currNode={props.currNode} />
              </TabsContent>
              <TabsContent value="configure">
                <ConfigureCard currNode={props.currNode} />
              </TabsContent>
            </Tabs>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
