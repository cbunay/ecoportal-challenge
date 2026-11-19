"use client";

import { useState, type ReactNode } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

type CalendarView = "month" | "week";

export function CalendarToolbar({ dateLabel }: { dateLabel: ReactNode }) {
  const [view, setView] = useState<CalendarView>("month");
  return (
    <Box
      role="toolbar"
      aria-label="Toolbar"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        minHeight: 64,
        p: 1,
      }}
    >
      <Button
        variant="outlined"
        color="inherit"
        sx={{
          borderRadius: 999,
        }}
      >
        Today
      </Button>
      <IconButton aria-label="Previous" size="small">
        <ChevronLeftIcon />
      </IconButton>
      <IconButton aria-label="Next" size="small">
        <ChevronRightIcon />
      </IconButton>
      <Typography
        component="h1"
        sx={{ fontSize: 22, fontWeight: 400, color: "#3c4043" }}
      >
        {dateLabel}
      </Typography>
      <Select
        value={view}
        size="small"
        IconComponent={KeyboardArrowDownIcon}
        inputProps={{ "aria-label": "View" }}
        onChange={(event) => setView(event.target.value as CalendarView)}
        sx={{
          ml: "auto",
          borderRadius: 999,
        }}
      >
        <MenuItem value="month">Month</MenuItem>
        <MenuItem value="week">Week</MenuItem>
      </Select>
    </Box>
  );
}
