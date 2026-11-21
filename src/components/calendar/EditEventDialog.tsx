"use client";

import { useForm } from "react-hook-form";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { fromInputValue, toInputValue } from "@/lib/calendar-grid";
import { useUpdateEventMutation } from "@/store/features/events/events.api";
import { EventType, type CalendarEvent } from "@/sever/event.type";

import { DraggableDialog } from "./DraggableDialog";

type FormValues = {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
};

type Props = { event: CalendarEvent; onClose: () => void };

function eventDefaults(event: CalendarEvent): FormValues {
  const [date, startTime] = toInputValue(new Date(event.startDate)).split("T");
  const [, endTime] = toInputValue(new Date(event.endDate)).split("T");
  return { name: event.name, date, startTime, endTime };
}

export function EditEventDialog({ event, onClose }: Props) {
  const [updateEvent] = useUpdateEventMutation();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: eventDefaults(event) });

  async function onSubmit({ name, date, startTime, endTime }: FormValues) {
    const startDate = fromInputValue(`${date}T${startTime}`);
    const endDate = fromInputValue(`${date}T${endTime}`);
    if (!startDate || !endDate) {
      setError("root.server", { message: "Enter a valid date and time" });
      return;
    }

    const result = await updateEvent({
      id: event.id,
      patch: { name: name.trim(), type: EventType.Meeting, startDate, endDate },
    });

    if ("error" in result) {
      const data = (result.error as { data?: { errors?: unknown[] } }).data;
      const messages = (data?.errors ?? []).map((e) =>
        typeof e === "string" ? e : String((e as { message?: string }).message),
      );
      setError("root.server", {
        message: messages.join(". ") || "Could not update the event",
      });
      return;
    }
    onClose();
  }

  const timeField = { sx: { width: 120 } };

  return (
    <DraggableDialog open onClose={onClose}>
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
          <IconButton aria-label="Close" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pl: 6 }}>
            {errors.root?.server && (
              <Alert severity="error">{errors.root.server.message}</Alert>
            )}
            <TextField
              variant="standard"
              placeholder="Add title"
              {...register("name", {
                validate: (v) => v.trim() !== "" || "Name is required",
              })}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              fullWidth
              slotProps={{
                htmlInput: { "aria-label": "Name" },
                input: { sx: { fontSize: 22 } },
              }}
            />
            <Box>
              <Chip
                label="Meeting"
                sx={{ bgcolor: "#c2e7ff", color: "#001d35", fontSize: 14 }}
              />
            </Box>
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 3, alignItems: "center" }}
          >
            <AccessTimeIcon sx={{ width: 32 }} />
            <TextField
              type="date"
              size="small"
              label="Date"
              {...register("date", { required: "Date is required" })}
              error={Boolean(errors.date)}
              helperText={errors.date?.message}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              type="time"
              size="small"
              label="Start"
              {...register("startTime", { required: "Start time is required" })}
              error={Boolean(errors.startTime)}
              helperText={errors.startTime?.message}
              slotProps={{ inputLabel: { shrink: true } }}
              {...timeField}
            />
            <TextField
              type="time"
              size="small"
              label="End"
              {...register("endTime", {
                required: "End time is required",
                validate: (v) =>
                  v > getValues("startTime") || "End must be after start",
              })}
              error={Boolean(errors.endTime)}
              helperText={errors.endTime?.message}
              slotProps={{ inputLabel: { shrink: true } }}
              {...timeField}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ borderRadius: 999, px: 3, textTransform: "none" }}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </DraggableDialog>
  );
}
