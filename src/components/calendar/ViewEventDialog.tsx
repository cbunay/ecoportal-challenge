"use client";

import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { eventRangeLabel } from "@/lib/calendar-grid";
import type { CalendarEvent } from "@/sever/event.type";

import { DraggableDialog } from "./DraggableDialog";
import { EditEventDialog } from "./EditEventDialog";

type Props = { event: CalendarEvent; onClose: () => void };

export function ViewEventDialog({ event, onClose }: Props) {
  const [editing, setEditing] = useState(false);

  if (editing) return <EditEventDialog event={event} onClose={onClose} />;

  return (
    <DraggableDialog open onClose={onClose} maxWidth="xs">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
          cursor: "grab",
          "&:active": { cursor: "grabbing" },
        }}
      >
        <DragHandleIcon color="action" />
        <Box>
          <IconButton
            aria-label="Edit event"
            onClick={() => setEditing(true)}
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton aria-label="Close" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pl: 6 }}>
          <Typography component="h2" sx={{ fontSize: 22 }}>
            {event.name}
          </Typography>
          <Box>
            <Chip
              label="Meeting"
              sx={{ bgcolor: "#c2e7ff", color: "#001d35", fontSize: 14 }}
            />
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mt: 3, alignItems: "center" }}>
          <AccessTimeIcon sx={{ width: 32 }} />
          <Typography sx={{ fontSize: 14 }}>
            {eventRangeLabel(event)}
          </Typography>
        </Stack>
      </DialogContent>
    </DraggableDialog>
  );
}
