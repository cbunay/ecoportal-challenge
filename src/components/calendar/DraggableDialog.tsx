"use client";

import { createContext, useContext, useRef, type RefObject } from "react";
import Dialog, { type DialogProps } from "@mui/material/Dialog";
import Paper, { type PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";

const AnchorToDraft = createContext(false);

const besideDraft = {
  position: "fixed",
  margin: 0,
  positionAnchor: "--draft",
  positionArea: "right span-bottom",
  positionTryFallbacks: "flip-inline",
} as const;

function DraggablePaper(props: PaperProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const anchored = useContext(AnchorToDraft);
  return (
    <Draggable
      nodeRef={nodeRef as RefObject<HTMLDivElement>}
      handle=".MuiDialogTitle-root"
      cancel="button"
    >
      <Paper
        {...props}
        ref={nodeRef}
        style={anchored ? { ...props.style, ...besideDraft } : props.style}
      />
    </Draggable>
  );
}

export function DraggableDialog({
  anchorToDraft = false,
  ...props
}: DialogProps & { anchorToDraft?: boolean }) {
  return (
    <AnchorToDraft.Provider value={anchorToDraft}>
      <Dialog
        fullWidth
        slots={{ paper: DraggablePaper }}
        slotProps={{
          backdrop: { sx: { bgcolor: "transparent" } },
          paper: { sx: { bgcolor: "#f0f4f9", borderRadius: "28px" } },
        }}
        {...props}
      />
    </AnchorToDraft.Provider>
  );
}
