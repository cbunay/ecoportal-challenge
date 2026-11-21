"use client";

import { useRef, type RefObject } from "react";
import Dialog, { type DialogProps } from "@mui/material/Dialog";
import Paper, { type PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";

// Drag by the DialogTitle; buttons inside it stay clickable.
function DraggablePaper(props: PaperProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <Draggable
      nodeRef={nodeRef as RefObject<HTMLDivElement>}
      handle=".MuiDialogTitle-root"
      cancel="button"
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}

export function DraggableDialog(props: DialogProps) {
  return (
    <Dialog
      fullWidth
      slots={{ paper: DraggablePaper }}
      slotProps={{
        backdrop: { sx: { bgcolor: "transparent" } },
        paper: { sx: { bgcolor: "#f0f4f9", borderRadius: "28px" } },
      }}
      {...props}
    />
  );
}
