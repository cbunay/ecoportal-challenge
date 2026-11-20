import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Suspense } from "react";
import { PeriodLabel } from "./PeriodLabel";
import { ViewMenu } from "./ViewMenu";

export async function CalendarToolbar() {
  return (
    <Box
      role="toolbar"
      aria-label="Toolbar"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 2,
      }}
    >
      <Button variant="outlined">Today</Button>
      <IconButton aria-label="Previous" size="small">
        <ChevronLeftIcon />
      </IconButton>
      <IconButton aria-label="Next" size="small">
        <ChevronRightIcon />
      </IconButton>
      <Suspense fallback={<div>Loading...</div>}>
        <PeriodLabel />
      </Suspense>
      <ViewMenu />
    </Box>
  );
}
