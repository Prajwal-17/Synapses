"use client"

import {
  CardContent,
} from "@repo/ui/components/card";
import { NodeData } from "@/store/panelDetailsStore";
import SendEmail from "./gmail/SendEmail";
import ListenEmail from "./gmail/ListenEmail";
import Commit from "./github/Commit";
import Pullrequest from "./github/Pullrequest";

const ConfigureData = ({ currData }: { currData: NodeData }) => {

  const renderConfigureComponent = (selectedEvent: string) => {
    switch (selectedEvent) {
      case "Listen-email":
        return <ListenEmail />;

      case "Send-email":
        return <SendEmail currData={currData} />;

      case "Commit":
        return <Commit />;

      case "Pull-request":
        return <Pullrequest />;

      default:
        break;
    }
  }

  return (<>

    <CardContent className="h-[330px] flex flex-col justify-evenly overflow-auto">

      {currData.event && renderConfigureComponent(currData.event)}

    </CardContent>
  </>)
}

export default ConfigureData