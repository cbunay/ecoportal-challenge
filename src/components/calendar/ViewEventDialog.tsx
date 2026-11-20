"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { eventRangeLabel } from "@/lib/calendar-grid";
import type { CalendarEvent } from "@/sever/event.type";

import { DraggableDialog } from "./DraggableDialog";

type Props = { event: CalendarEvent; onClose: () => void };

export function ViewEventDialog({ event, onClose }: Props) {
  return (
    <DraggableDialog onClose={onClose} maxWidth="xs">
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
        <Typography sx={{ fontSize: 14 }}>{eventRangeLabel(event)}</Typography>
      </Stack>
    </DraggableDialog>
  );
}
