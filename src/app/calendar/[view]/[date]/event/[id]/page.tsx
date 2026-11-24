"use client";

import { paths } from "@/lib/calendar-paths";

import CloseIcon from "@mui/icons-material/Close";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useParams, useRouter } from "next/navigation";

import { eventRangeLabel } from "@/lib/calendar-layout";
import {
  useDeleteEventMutation,
  useGetEventQuery,
} from "@/store/features/events/events.api";

import { useSnackbar } from "notistack";
import { DraggableDialog } from "@/components/calendar/DraggableDialog";

export default function ViewEventPage() {
  const router = useRouter();
  const { view, date, id } = useParams<{
    view: string;
    date: string;
    id: string;
  }>();
  const { data: event } = useGetEventQuery(id);
  const [deleteEvent, { isLoading: isRemoving }] = useDeleteEventMutation();
  const { enqueueSnackbar } = useSnackbar();

  if (!event) return null;

  const onEdit = () => router.push(paths.eventEdit(view, date, id));
  const onClose = () => router.push(paths.calendarDate(view, date));

  async function handleRemove() {
    try {
      await deleteEvent(id).unwrap();
      enqueueSnackbar("Event deleted", { variant: "success" });
      onClose();
    } catch {
      enqueueSnackbar("Could not delete the event", { variant: "error" });
    }
  }

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
        <DragHandleIcon fontSize="small" color="action" />
        <Box>
          <IconButton aria-label="Edit event" onClick={onEdit} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Remove event"
            onClick={handleRemove}
            disabled={isRemoving}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="Close" onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pl: 6 }}>
          <Typography component="h2" sx={{ fontSize: 16 }}>
            {event.name}
          </Typography>
          <Box>
            <Chip
              label="Meeting"
              size="small"
              sx={{ bgcolor: "#c2e7ff", color: "#001d35", fontSize: 12 }}
            />
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mt: 3, alignItems: "center" }}>
          <AccessTimeIcon fontSize="small" sx={{ width: 32 }} />
          <Typography sx={{ fontSize: 13 }}>
            {eventRangeLabel(event)}
          </Typography>
        </Stack>
      </DialogContent>
    </DraggableDialog>
  );
}
