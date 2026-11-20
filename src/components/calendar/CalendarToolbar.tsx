"use client";

import Box from "@mui/material/Box";
import { PeriodNav } from "./PeriodNav";
import { PeriodLabel } from "./PeriodLabel";
import { TodayButton } from "./TodayButton";
import { ViewMenu } from "./ViewMenu";

export function CalendarToolbar() {
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
      <TodayButton />
      <PeriodNav />
      <PeriodLabel />
      <ViewMenu />
    </Box>
  );
}
