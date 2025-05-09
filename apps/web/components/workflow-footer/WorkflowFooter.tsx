import { useWorkflowStore } from "@/store/workflowStore";
import { Button, Input } from "@repo/ui";
import { Check, LoaderCircle, Pencil, X } from "lucide-react";
import { useState } from "react";
import { WorkflowActions } from "./WorkflowActions";

export const WorkflowFooter = ({
  userId,
  workflowId,
}: {
  userId: string;
  workflowId: string;
}) => {
  const [nameLoading, setNameLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const name = useWorkflowStore((state) => state.name);
  const setName = useWorkflowStore((state) => state.setName);
  const [tempName, setTempName] = useState(name);

  const handleNameChange = async () => {
    setName(tempName);
    setNameLoading(true);

    try {
      const response = await fetch(
        `/api/${userId}/workflows/${workflowId}/name`,
        {
          method: "POST",
          body: JSON.stringify({ workflowName: name }),
        },
      );

      if (!response.ok) {
        console.error("Failed to update workflow name");
        return;
      }

      setNameLoading(false);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempName(name);
  };

  return (
    <>
      <div className="flex h-16 w-full items-center justify-between rounded-t-lg bg-neutral-50 px-8 py-3 shadow-2xl">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex items-center justify-center gap-2">
              <Input
                className="h-9 text-base font-medium"
                placeholder="Enter workflow name"
                onChange={(e) => setTempName(e.target.value)}
                value={tempName}
              />
              <div className="flex items-center justify-center">
                {nameLoading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Button
                      disabled={tempName.trim() === ""}
                      onClick={handleNameChange}
                      variant="ghost"
                      size="icon"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button onClick={handleCancel} variant="ghost" size="icon">
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg font-semibold">{name}</span>
              <Button
                className="opacity-50 hover:opacity-100"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setTempName(name);
                  setIsEditing(true);
                }}
              >
                <Pencil className="h-1 w-1" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-3">
          <WorkflowActions />
        </div>
      </div>
    </>
  );
};
