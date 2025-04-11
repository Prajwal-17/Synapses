"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@repo/ui";
import {
  EllipsisVertical,
  PlusCircle,
  RefreshCw,
  Search,
  Zap,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GoTrash } from "react-icons/go";
import { PiPencilSimpleDuotone } from "react-icons/pi";

type FeData = {
  workflowId: string;
  name: string;
  status: boolean;
  last_modified: string;
  apps: string[];
};

export default function Workflows() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingCircle, setLoadingCircle] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const [search, setSearch] = useState("");

  const { data: session } = useSession();

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      if (!session?.user.id) {
        return;
      }
      setLoading(true);
      const response = await fetch(`/api/${session?.user.id}/workflows`, {
        method: "GET",
      });

      if (!response.ok) {
        console.log("Error fetching workflows");
      }
      const data = await response.json();
      setWorkflows(data.workflows);
      setLoading(false);
    } catch (error) {
      console.log("Fetch workflows error");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const createWorkflow = async () => {
    try {
      if (!session?.user.id) {
        return;
      }
      setLoadingCircle(true);
      const response = await fetch(`/api/${session?.user.id}/workflows`, {
        method: "POST",
      });

      if (!response.ok) {
        console.log("Something went wrong while creating workflow");
      }
      const data = await response.json();
      router.push(`/workflow/${data.workflow.userId}/${data.workflow.id}`);
      setLoadingCircle(true);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredWorkflows = workflows.filter((wf: FeData) =>
    wf.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="h-[calc(100vh-4rem)] w-full px-16 py-9">
        <div className="mb-7 flex items-center justify-between">
          <div className="text-3xl font-bold">Workflows</div>
          <div className="flex items-center">
            <Button
              onClick={createWorkflow}
              disabled={loadingCircle}
              className="gap-2 transition-all active:scale-95"
            >
              {loadingCircle ? "" : <PlusCircle className="h-4 w-4" />}
              {loadingCircle ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-500"></div>
                  <span>Creating ...</span>
                </div>
              ) : (
                "Create Flow"
              )}
            </Button>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              type="search"
              placeholder="Search by name"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              className="transition-all hover:bg-gray-100 active:scale-95"
              onClick={fetchWorkflows}
            >
              <RefreshCw />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px] min-w-[300px] px-4 py-3">
                  <div>Name</div>
                </TableHead>
                <TableHead className="min-w-[150px]">Apps</TableHead>
                <TableHead className="min-w-[150px]">
                  <div className="flex items-center gap-1 hover:cursor-pointer hover:text-black">
                    Last Modified
                  </div>
                </TableHead>
                <TableHead className="min-w-[100px]">
                  <div className="flex items-center gap-1 hover:cursor-pointer hover:text-black">
                    Status
                  </div>
                </TableHead>
                <TableHead className="w-[50px] min-w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkflows.length > 0 ? (
                filteredWorkflows.map((wf: FeData, index) => (
                  <TableRow key={index} className="text-[15px] font-medium">
                    <TableCell
                      onClick={() => {
                        router.push(
                          `/workflow/${session?.user.id}/${wf.workflowId}`,
                        );
                      }}
                      className="flex items-center justify-start gap-2 px-4 py-5 hover:cursor-pointer hover:underline"
                    >
                      <Zap className="h-4 w-4 text-orange-500" />
                      {wf.name}
                    </TableCell>
                    <TableCell className="">
                      <div className="flex items-center justify-start gap-1">
                        {wf.apps.map((app, index) => (
                          <div key={index} className="">
                            <Image
                              className="border"
                              key={index + 1}
                              src={`/icons/${app.toLowerCase()}.svg`}
                              height={20}
                              width={20}
                              alt={app}
                            />
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{wf.last_modified}</TableCell>
                    <TableCell>
                      <Switch />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <EllipsisVertical className="h-4 w-4 hover:bg-gray-100 hover:bg-primary-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem className="hover:cursor-pointer">
                            <div>
                              <PiPencilSimpleDuotone />
                            </div>
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <div>
                              <GoTrash />
                            </div>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-5 text-center">
                    No Workflows Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
