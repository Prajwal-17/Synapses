"use client";

import { CardContent } from "@repo/ui";
import { NodeDataType } from "@repo/types";
import SendEmail from "./gmail/SendEmail";
import ListenEmail from "./gmail/ListenEmail";
import Commit from "./github/Commit";
import Pullrequest from "./github/Pullrequest";

const ConfigureCard = ({ currNode }: { currNode: NodeDataType }) => {
  const renderConfigureComponent = (selectedEvent: string) => {
    switch (selectedEvent) {
      case "LISTEN_EMAIL":
        return <ListenEmail currNode={currNode} />;

      case "SEND_EMAIL":
        return <SendEmail currNode={currNode} />;

      case "DRAFT_EMAIL":
        return <SendEmail currNode={currNode} />;

      case "COMMIT":
        return <Commit />;

      case "PULL_REQUEST":
        return <Pullrequest />;

      default:
        break;
    }
  };

  return (
    <>
      <CardContent className="h-[330px] flex-col items-start justify-center overflow-auto p-1">
        {currNode.eventType && renderConfigureComponent(currNode.eventType)}
      </CardContent>
    </>
  );
};

export default ConfigureCard;
