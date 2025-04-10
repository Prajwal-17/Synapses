import { Button } from "@repo/ui";
import { useEffect, useState } from "react";
import { MdRefresh } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { useSession } from "next-auth/react";
import { useConnectionStore } from "@/store/connectionStore";
import { GmailConnectionType } from "@repo/types";
import { useWorkflowStore } from "@/store/workflowStore";

export default function Connection({
  connectionId,
  appType,
  stepNo,
}: {
  connectionId: string;
  appType: string;
  stepNo: number;
}) {
  const { data: session } = useSession();
  const connections = useConnectionStore((state) => state.connections);
  const setConnections = useConnectionStore((state) => state.setConnections);
  const [selectedConnection, setSelectedConnections] =
    useState<GmailConnectionType | null>(null);
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth/google/callback`;
    const scope =
      "https://mail.google.com/ https://www.googleapis.com/auth/user.emails.read https://www.googleapis.com/auth/userinfo.profile";

    // Use 'state' to indicate it's a popup flow
    const state = encodeURIComponent(JSON.stringify({ popup: true }));

    //
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline&prompt=consent&state=${state}`;

    //to open a popup window
    window.open(googleAuthUrl, "Google Sign In", "height=600,width=800");
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
        fetchConnections();
      }
    };

    //to listen messages from another window(popup) i.e connection status
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    fetchConnections();

    const isConnection = connections.find(
      (connection) => connection.id === connectionId,
    );

    if (isConnection) {
      setSelectedConnections(isConnection);
    }
  }, [connectionId]);

  const fetchConnections = async () => {
    if (!session?.user.id) return;

    try {
      const response = await fetch(
        `/api/connections?app=${appType}&userId=${session?.user.id}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        console.log("Something went wrong while fetching connections");
      }

      const data = await response.json();
      setConnections(data.connections);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectChange = (value: string) => {
    const selected = connections.find(
      (connection) => connection.metaData.email === value,
    );
    if (selected) {
      setSelectedConnections(selected);
      updateNodeData(stepNo, { connectionId: selected.id });
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      <Select
        value={selectedConnection?.email || ""}
        onValueChange={(value) => handleSelectChange(value)}
        onOpenChange={() => fetchConnections()}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Choose account" />
        </SelectTrigger>

        <SelectContent>
          {connections.length > 0 ? (
            connections.map((item: GmailConnectionType, index) => (
              <SelectItem key={index} value={item.email}>
                {item.email}
              </SelectItem>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </SelectContent>
      </Select>

      <Button onClick={handleGoogleLogin}>Connect</Button>
      <div className="hover:cursor-pointer">
        <MdRefresh size={25} />
      </div>
    </div>
  );
}
