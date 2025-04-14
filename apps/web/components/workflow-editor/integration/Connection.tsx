import { Button } from "@repo/ui";
import { useEffect, useState } from "react";
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
import { Loader2Icon, RefreshCw } from "lucide-react";

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
  const [loading, setLoading] = useState(false);

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
        refreshConnections();
      }
    };

    //to listen messages from another window(popup) i.e connection status
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const isConnection = connections.find(
      (connection) => connection.id === connectionId,
    );

    if (isConnection) {
      setSelectedConnections(isConnection);
    }
  }, []);

  // Filter connections based on appType
  const filteredConnections = connections.filter(
    (connection) => connection.appType === appType,
  );

  const refreshConnections = async () => {
    if (!session?.user.id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/connections/${session.user.id}`, {
        method: "GET",
      });

      if (!response.ok) {
        console.log("Something went wrong while fetching connections");
      }

      const data = await response.json();
      setConnections(data.connections);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectChange = (value: string) => {
    const selected = connections.find(
      (connection) => connection.email === value,
    );
    if (selected) {
      setSelectedConnections(selected);
      updateNodeData(stepNo, { connectionId: selected.id });
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      {filteredConnections.length > 0 ? (
        <div className="flex w-full items-center justify-between gap-2">
          <Select
            disabled={loading}
            value={selectedConnection?.email || ""}
            onValueChange={(value) => handleSelectChange(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose account" />
            </SelectTrigger>

            <SelectContent>
              {filteredConnections.map((item: GmailConnectionType, index) => (
                <SelectItem key={index} value={item.email}>
                  {item.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button disabled={loading} onClick={handleGoogleLogin}>
            Connect
          </Button>
          {loading ? (
            <Loader2Icon className="h-9 w-9 animate-spin" />
          ) : (
            <Button
              onClick={refreshConnections}
              className="px-1"
              size="icon"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <Button
          disabled={loading}
          className="w-full"
          onClick={handleGoogleLogin}
        >
          {loading ? <span>Connecting ...</span> : <span>Connect</span>}
        </Button>
      )}
    </div>
  );
}
