"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CalendarToolbar } from "./CalendarToolbar";
import { Sidebar } from "./Sidebar";

export function Calendar({ dateLabel }: { dateLabel: ReactNode }) {
  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      <Box aria-hidden sx={{ height: 10, flexShrink: 0, bgcolor: "#1E4E8C" }} />
      <Box sx={{ flex: 1, minHeight: 0, display: "flex" }}>
        <Sidebar />
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CalendarToolbar dateLabel={dateLabel} />
          <Box
            component="main"
            sx={{
              flex: 1,
              minHeight: 0,
              mx: 2,
              mb: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "#fff",
              border: "1px solid #e6e8ec",
              borderRadius: "12px",
            }}
          >
            <Typography sx={{ fontSize: 16, color: "text.secondary" }}>
              Calendar content
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
