import { nodeToSaveApiFormat } from "@/lib/nodeToSaveApiFormat";
import { useWorkflowStore } from "@/store/workflowStore";
import { Button, Label, Switch } from "@repo/ui";
import { LoaderCircle, Save } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const WorkflowActions = () => {
  const pathname = usePathname().split("/");
  const userId = pathname[2] as string;
  const workflowId = pathname[3] as string;
  const originalNodeData = useWorkflowStore((state) => state.orignalNodeData);
  const name = useWorkflowStore((state) => state.name);
  const status = useWorkflowStore((state) => state.status);
  const setStatus = useWorkflowStore((state) => state.setStatus);
  const getChanges = useWorkflowStore((state) => state.getChanges);
  const saveChanges = useWorkflowStore((state) => state.saveChanges);

  const [isSaving, setIsSaving] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const changes = getChanges();

      if (!userId && !workflowId && !changes) {
        console.log("Nothing to save");
        setIsSaving(false);
        return;
      }

      if (changes.length <= 0) {
        setIsSaving(false);
        return;
      }

      const nodeChanges = nodeToSaveApiFormat(
        userId,
        workflowId,
        name,
        changes,
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
      setIsStatusLoading(true);
      const response = await fetch(
        `/api/${userId}/workflows/${workflowId}/status`,
        {
          method: "POST",
          body: JSON.stringify({ workflowStatus: !status }),
        },
      );
      if (!response.ok) {
        console.log("error");
        setIsStatusLoading(false);
        return;
      }
      const data = await response.json();
      setStatus(!status);
      setIsStatusLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <Label htmlFor="status">
          {status ? "Turn workflow off" : "Turn workflow on"}
        </Label>
        <Switch
          id="status"
          disabled={isStatusLoading}
          checked={status}
          onCheckedChange={handlePublish}
        />
        {isStatusLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
      </div>
      <Button
        onClick={handleSave}
        disabled={isSaving || isStatusLoading}
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
