"use client";

import { useForm } from "react-hook-form";
import { addHours, startOfHour } from "date-fns";
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

import { useSearchParams } from "next/navigation";

import {
  fromInputValue,
  parseDateParam,
  toInputValue,
} from "@/lib/calendar-grid";
import { useSnackbar } from "notistack";
import { DraggableDialog } from "./DraggableDialog";
import { useCreateEventMutation } from "@/store/features/events/events.api";
import { EventType } from "@/sever/event.type";

type FormValues = {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
};

export type EventDraft = { date: string; startTime?: string };

type Props = { onClose: () => void; draft?: EventDraft };

function defaultTimes(focusedDate: Date, draft?: EventDraft) {
  const [focusedDay] = toInputValue(focusedDate).split("T");
  const date = draft?.date ?? focusedDay;
  const start = draft?.startTime
    ? (fromInputValue(`${date}T${draft.startTime}`) ?? new Date())
    : addHours(startOfHour(new Date()), 1);
  const [, startTime] = toInputValue(new Date(start)).split("T");
  const [, endTime] = toInputValue(addHours(new Date(start), 1)).split("T");
  return { date, startTime, endTime };
}

export function CreateEventDialog({ onClose, draft }: Props) {
  const [createEvent] = useCreateEventMutation();
  const { enqueueSnackbar } = useSnackbar();
  const dateParam = useSearchParams().get("date");
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      ...defaultTimes(parseDateParam(dateParam, new Date()), draft),
    },
  });

  async function onSubmit({ name, date, startTime, endTime }: FormValues) {
    const startDate = fromInputValue(`${date}T${startTime}`);
    const endDate = fromInputValue(`${date}T${endTime}`);
    if (!startDate || !endDate) {
      setError("root.server", { message: "Enter a valid date and time" });
      return;
    }

    const result = await createEvent({
      name: name.trim(),
      type: EventType.Meeting,
      startDate,
      endDate,
    });

    if ("error" in result) {
      const data = (result.error as { data?: { errors?: unknown[] } }).data;
      const messages = (data?.errors ?? []).map((e) =>
        typeof e === "string" ? e : String((e as { message?: string }).message),
      );
      setError("root.server", {
        message: messages.join(". ") || "Could not create the event",
      });
      return;
    }
    enqueueSnackbar("Event created", { variant: "success" });
    onClose();
  }

  const timeField = { sx: { width: 110 } };
  const smallText = {
    inputLabel: { shrink: true, sx: { fontSize: 13 } },
    input: { sx: { fontSize: 13 } },
    formHelperText: { sx: { fontSize: 11 } },
  };

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
        <DragHandleIcon fontSize="small" color="action" />
        <Box>
          <IconButton aria-label="Close" onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
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
              size="small"
              placeholder="Add title"
              {...register("name", {
                validate: (v) => v.trim() !== "" || "Name is required",
              })}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              autoFocus
              fullWidth
              slotProps={{
                htmlInput: { "aria-label": "Name" },
                input: { sx: { fontSize: 16 } },
              }}
            />
            <Box>
              <Chip
                label="Meeting"
                size="small"
                sx={{ bgcolor: "#c2e7ff", color: "#001d35", fontSize: 12 }}
              />
            </Box>
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 3, alignItems: "center" }}
          >
            <AccessTimeIcon fontSize="small" sx={{ width: 32 }} />
            <TextField
              type="date"
              size="small"
              label="Date"
              {...register("date", { required: "Date is required" })}
              error={Boolean(errors.date)}
              helperText={errors.date?.message}
              slotProps={smallText}
            />
            <TextField
              type="time"
              size="small"
              label="Start"
              {...register("startTime", { required: "Start time is required" })}
              error={Boolean(errors.startTime)}
              helperText={errors.startTime?.message}
              slotProps={smallText}
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
              slotProps={smallText}
              {...timeField}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={isSubmitting}
            sx={{ borderRadius: 999, px: 3, textTransform: "none", color: "#fff" }}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </DraggableDialog>
  );
}
