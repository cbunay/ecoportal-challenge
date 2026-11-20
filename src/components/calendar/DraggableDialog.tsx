"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import Box from "@mui/material/Box";
import Dialog, { type DialogProps } from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Paper, { type PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";

const handleClass = "draggable-dialog-handle";

function DraggablePaper(props: PaperProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <Draggable
      nodeRef={nodeRef as RefObject<HTMLDivElement>}
      handle={`.${handleClass}`}
      cancel="button"
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}

type Props = {
  onClose: () => void;
  maxWidth?: DialogProps["maxWidth"];
  children: ReactNode;
};

export function DraggableDialog({ onClose, maxWidth = "sm", children }: Props) {
  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      slots={{ paper: DraggablePaper }}
      slotProps={{
        backdrop: { sx: { bgcolor: "transparent" } },
        paper: {
          sx: { bgcolor: "#f0f4f9", borderRadius: "28px", p: 3, pt: 2 },
        },
      }}
    >
      <Box
        className={handleClass}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "grab",
          "&:active": { cursor: "grabbing" },
        }}
      >
        <DragHandleIcon color="action" />
        <IconButton aria-label="Close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      {children}
    </Dialog>
  );
}
