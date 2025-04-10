import { useWorkflowStore } from "@/store/workflowStore";
import { NodeDataType } from "@repo/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";

const ListenEmail = ({ currNode }: { currNode: NodeDataType }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  const handleChange = (value: string) => {
    updateNodeData(currNode.stepNo, { payload: { label: value } });
  };

  return (
    <>
      <div className="space-y-2 py-2 text-sm font-semibold">Select a label</div>
      <Select
        value={currNode.payload.label}
        onValueChange={(value) => handleChange(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Label" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL MAIL">ALL MAIL</SelectItem>
          <SelectItem value="INBOX">INBOX</SelectItem>
          <SelectItem value="TRASH">TRASH</SelectItem>
          <SelectItem value="SPAM">SPAM</SelectItem>
          <SelectItem value="UNREAD">UNREAD</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default ListenEmail;
