"use client";

import { paths } from "@/lib/calendar-paths";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import {
  CalendarView,
  formatDateParam,
  formatPeriodLabel,
  shiftPeriod,
} from "@/lib/calendar-grid";
import { useFocusedDate } from "@/lib/use-focused-date";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useParams, useRouter } from "next/navigation";

export function CalendarToolbar() {
  const { view, date } = useParams<{ view: CalendarView; date?: string }>();
  const focusedDate = useFocusedDate();
  const router = useRouter();

  const go = (amount: number) => {
    const as = formatDateParam(shiftPeriod(focusedDate, view, amount));
    router.push(paths.calendarDate(view, as));
  };

  return (
    <Box
      component="nav"
      role="toolbar"
      aria-label="Toolbar"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 2,
      }}
    >
      <Button
        variant="outlined"
        onClick={() => router.push(paths.calendarToday(view))}
      >
        Today
      </Button>

      <Tooltip title="Previous">
        <IconButton aria-label="Previous" size="small" onClick={() => go(-1)}>
          <ChevronLeftIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Next">
        <IconButton aria-label="Next" size="small" onClick={() => go(1)}>
          <ChevronRightIcon />
        </IconButton>
      </Tooltip>

      <Typography
        component="h1"
        sx={{ fontSize: 22, fontWeight: 400, color: "#3c4043" }}
      >
        {formatPeriodLabel(focusedDate, view)}
      </Typography>

      <Select
        value={view}
        variant="outlined"
        size="small"
        inputProps={{ "aria-label": "View" }}
        onChange={(event) =>
          router.push(
            date
              ? paths.calendarDate(event.target.value, date)
              : paths.calendarToday(event.target.value),
          )
        }
        sx={{ ml: "auto", borderRadius: 999 }}
      >
        <MenuItem value={CalendarView.Month}>Month</MenuItem>
        <MenuItem value={CalendarView.Week}>Week</MenuItem>
      </Select>
    </Box>
  );
}
