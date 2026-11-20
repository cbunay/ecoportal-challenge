import { type ReactNode } from "react";
import Box from "@mui/material/Box";

import { CalendarToolbar } from "@/components/calendar/CalendarToolbar";
import { Sidebar } from "@/components/calendar/Sidebar";

export default function CalendarLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
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
          <CalendarToolbar />
          <Box
            component="main"
            sx={{
              flex: 1,
              minHeight: 0,
              mx: 2,
              mb: 2,
              display: "flex",
              flexDirection: "column",
              bgcolor: "#fff",
              border: "1px solid #e6e8ec",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
