"use client";

import { createContext, useContext, useRef, type RefObject } from "react";
import Dialog, { type DialogProps } from "@mui/material/Dialog";
import Paper, { type PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";

const AnchorToDraft = createContext(false);

// CSS anchor positioning: the draft event in the grid declares
// `anchor-name: --draft`; the browser places the paper beside it and flips
// to the left when there is no room on the right.
const besideDraft = {
  position: "fixed",
  margin: 0,
  positionAnchor: "--draft",
  positionArea: "right span-bottom",
  positionTryFallbacks: "flip-inline",
} as const;

// Drag by the DialogTitle; buttons inside it stay clickable.
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
