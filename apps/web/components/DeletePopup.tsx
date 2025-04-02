"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui";
import { Dispatch, SetStateAction } from "react";

export default function DeletePopup({
  props,
}: {
  props: {
    showPopup: boolean;
    setShowPopup: Dispatch<SetStateAction<boolean>>;
  };
}) {
  return (
    <>
      <AlertDialog open={props.showPopup} onOpenChange={props.setShowPopup}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete This Step?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the selected node from your workflow.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
