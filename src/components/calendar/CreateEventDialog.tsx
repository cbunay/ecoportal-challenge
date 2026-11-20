"use client";

import { useForm } from "react-hook-form";
import { addHours, startOfHour } from "date-fns";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
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
import { DraggableDialog } from "./DraggableDialog";
import { useCreateEventMutation } from "@/store/features/events/events.api";
import { EventType } from "@/sever/event.type";

type FormValues = {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
};

type Props = { onClose: () => void };

function defaultTimes(focusedDate: Date) {
  const start = addHours(startOfHour(new Date()), 1);
  const [, startTime] = toInputValue(start).split("T");
  const [, endTime] = toInputValue(addHours(start, 1)).split("T");
  const [date] = toInputValue(focusedDate).split("T");
  return { date, startTime, endTime };
}

export function CreateEventDialog({ onClose }: Props) {
  const [createEvent] = useCreateEventMutation();
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
      ...defaultTimes(parseDateParam(dateParam, new Date())),
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
    onClose();
  }

  const timeField = { sx: { width: 120 } };

  return (
    <DraggableDialog onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            autoFocus
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
        <Stack direction="row" spacing={2} sx={{ mt: 3, alignItems: "center" }}>
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
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ borderRadius: 999, px: 3, textTransform: "none" }}
          >
            Save
          </Button>
        </Box>
      </form>
    </DraggableDialog>
  );
}
