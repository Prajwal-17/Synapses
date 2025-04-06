"use client";

import { useSelectNodeStore } from "@/store/selectNodeStore";
import { SetupCard } from "./SetupCard";
import { NodeDataType } from "@repo/types";
import { useWorkflowStore } from "@/store/workflowStore";
import { AnimatePresence, motion } from "motion/react";
import { DrawerPanel } from "./DrawerPanel";
import { useEffect, useState } from "react";

const EditPanel = () => {
  const showPanel = useSelectNodeStore((state) => state.showPanel);
  const setShowPanel = useSelectNodeStore((state) => state.setShowPanel);
  const selectedNode = useSelectNodeStore((state) => state.selectedNode);
  const nodeData = useWorkflowStore((state) => state.nodeData);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width:750px)");
    setIsMobile(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
  }, []);

  return (
    <AnimatePresence>
      {showPanel && (
        <>
          {/* for larger screens */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, x: 40, y: "-50%" }}
              animate={{ opacity: 1, x: 0, y: "-50%" }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.2, ease: "easeIn" }}
              className="absolute right-3 top-1/2 z-50 w-[410px]"
            >
              {nodeData.length > 0 &&
                nodeData.map((node: NodeDataType, index) => (
                  <div key={index} className="">
                    {index === selectedNode && showPanel ? (
                      <SetupCard currNode={node} />
                    ) : null}
                  </div>
                ))}
            </motion.div>
          )}

          {/* for smaller screens */}
          {isMobile && (
            <div className="absolute right-3 top-1/2 z-50 w-96">
              {nodeData.length > 0 &&
                nodeData.map((currNode: NodeDataType, index) => (
                  <div key={index}>
                    {index === selectedNode && showPanel ? (
                      <DrawerPanel
                        props={{ showPanel, setShowPanel, currNode }}
                      />
                    ) : null}
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default EditPanel;
