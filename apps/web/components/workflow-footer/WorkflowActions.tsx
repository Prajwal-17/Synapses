import { nodeToSaveApiFormat } from "@/lib/nodeToSaveApiFormat";
import { useWorkflowStore } from "@/store/workflowStore";
import { Button, Switch } from "@repo/ui";
import { LoaderCircle, Save, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const WorkflowActions = () => {
  const pathname = usePathname().split("/");
  const userId = pathname[2] as string;
  const workflowId = pathname[3] as string;
  const originalNodeData = useWorkflowStore((state) => state.orignalNodeData);
  const name = useWorkflowStore((state) => state.name);
  const getChanges = useWorkflowStore((state) => state.getChanges);
  const saveChanges = useWorkflowStore((state) => state.saveChanges);

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const changes = getChanges();

      if (!userId && !workflowId && !changes) {
        console.log("Nothing to save");
        setIsSaving(false);
        return;
      }
      const nodeArray = getChanges();

      if (nodeArray.length <= 0) {
        setIsSaving(false);
        return;
      }

      const nodeChanges = nodeToSaveApiFormat(
        userId,
        workflowId,
        name,
        nodeArray,
      );

      const response = await fetch(`/api/${userId}/workflows/${workflowId}`, {
        method: "POST",
        body: JSON.stringify(nodeChanges),
      });
      if (!response.ok) {
        setIsSaving(false);
        return;
      }
      const data = await response.json();
      saveChanges();
      setIsSaving(false);
    } catch (error) {
      console.log(error);
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      const response = await fetch(
        `/api/${userId}/workflows/${workflowId}/publish`,
        {
          method: "POST",
          body: JSON.stringify(originalNodeData),
        },
      );
      if (!response.ok) {
        console.log("error");
        return;
      }

      const data = await response.json();
      setIsPublishing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button disabled={isSaving || isPublishing} onClick={handlePublish}>
        {isPublishing ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            <span>Publishing ...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Publish</span>
          </>
        )}
      </Button>
      <Button
        onClick={handleSave}
        disabled={isSaving || isPublishing}
        variant="outline"
      >
        {isSaving ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            <span>Saving ...</span>
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            <span>Save</span>
          </>
        )}
      </Button>
    </>
  );
};
