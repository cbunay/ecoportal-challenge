"use client";

import { paths } from "@/lib/calendar-paths";

import { useForm } from "react-hook-form";
import { addHours, startOfHour } from "date-fns";
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
import Typography from "@mui/material/Typography";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  clearDraftEvent,
  selectDraftEvent,
  setDraftEvent,
  type EventDraft,
} from "@/store/features/calendar/calendar.slice";
import { useCalendarDispatch, useCalendarSelector } from "@/store/hooks";
import { useFocusedDate } from "@/lib/use-focused-date";

import { fromInputValue, toInputValue } from "@/lib/calendar-grid";
import { useSnackbar } from "notistack";
import { DraggableDialog } from "@/components/calendar/DraggableDialog";
import { useCreateEventMutation } from "@/store/features/events/events.api";
import { EventType } from "@/sever/event.type";

type FormValues = {
  name: string;
  date: string;
  endDate: string;
  startTime: string;
  endTime: string;
};

function defaultTimes(draftEvent: EventDraft) {
  const { date } = draftEvent;
  const start = draftEvent.startTime
    ? (fromInputValue(`${date}T${draftEvent.startTime}`) ?? new Date())
    : addHours(startOfHour(new Date()), 1);
  const [, startTime] = toInputValue(new Date(start)).split("T");
  const [, endTime] = toInputValue(addHours(new Date(start), 1)).split("T");
  return { date, endDate: draftEvent.endDate ?? date, startTime, endTime };
}

export default function CreateEventPage() {
  const slot = useSearchParams().get("slot");
  return <CreateEventForm key={slot} />;
}

function CreateEventForm() {
  const dispatch = useCalendarDispatch();
  const router = useRouter();
  const { view, date } = useParams<{ view: string; date: string }>();
  const focusedDate = useFocusedDate();
  const draft = useCalendarSelector(selectDraftEvent);
  const draftEvent: EventDraft = draft ?? {
    date: toInputValue(focusedDate).split("T")[0],
  };
  const [createEvent] = useCreateEventMutation();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      ...defaultTimes(draftEvent),
    },
  });

  const syncDraft = () => {
    const { name, date, endDate, startTime, endTime } = getValues();
    if (date && startTime) {
      dispatch(
        setDraftEvent({
          date,
          endDate,
          startTime,
          endTime,
          name,
        }),
      );
    }
  };

  function onClose() {
    dispatch(clearDraftEvent());
    router.push(paths.calendarDate(view, date));
  }

  async function onSubmit(values: FormValues) {
    const { date, startTime, endTime } = values;
    const startDate = fromInputValue(`${date}T${startTime}`);
    const endDate = fromInputValue(`${values.endDate}T${endTime}`);
    if (!startDate || !endDate) {
      setError("root.server", { message: "Enter a valid date and time" });
      return;
    }

    const result = await createEvent({
      name: values.name.trim(),
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

  return (
    <DraggableDialog open onClose={onClose} anchorToDraft>
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
                onChange: syncDraft,
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
            spacing={1}
            useFlexGap
            sx={{
              mt: 3,
              alignItems: "center",
              flexWrap: "wrap",
              "& .MuiTextField-root": {
                flex: 1,
                minWidth: 150,
                "&:has(input[type=time])": { flex: "none", width: 120 },
              },
              "& .MuiFilledInput-root": {
                fontSize: 14,
                borderRadius: 1,
                bgcolor: "#e1e3e8",
                "&::before, &::after": { display: "none" },
              },
              "& .MuiFilledInput-input": { py: 1 },
            }}
          >
            <AccessTimeIcon fontSize="small" sx={{ width: 32 }} />
            <TextField
              type="date"
              aria-label="Start date"
              variant="filled"
              size="small"
              hiddenLabel
              {...register("date", {
                required: "Date is required",
                onChange: (e) => {
                  setValue("endDate", e.target.value);
                  syncDraft();
                },
              })}
              error={Boolean(errors.date)}
              helperText={errors.date?.message}
            />

            <TextField
              type="time"
              aria-label="Start time"
              variant="filled"
              size="small"
              hiddenLabel
              {...register("startTime", {
                required: "Start time is required",
                onChange: syncDraft,
              })}
              error={Boolean(errors.startTime)}
              helperText={errors.startTime?.message}
            />
            <Typography color="text.secondary" sx={{ px: 0.5 }}>
              –
            </Typography>
            <TextField
              type="time"
              aria-label="End time"
              variant="filled"
              size="small"
              hiddenLabel
              {...register("endTime", {
                required: "End time is required",
                onChange: syncDraft,
                validate: (v) =>
                  `${getValues("endDate")}T${v}` >
                    `${getValues("date")}T${getValues("startTime")}` ||
                  "End must be after start",
              })}
              error={Boolean(errors.endTime)}
              helperText={errors.endTime?.message}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={isSubmitting}
            sx={{
              borderRadius: 999,
              px: 3,
              textTransform: "none",
              color: "#fff",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </DraggableDialog>
  );
}
