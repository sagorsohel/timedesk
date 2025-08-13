"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string | undefined;
  onConfirm: () => void;
};

export default function DeleteDialog({
  open,
  onOpenChange,
  itemName,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          Are you sure you want to delete{" "}
          <strong>{itemName ?? "this item"}</strong>?
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
