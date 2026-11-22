import { CalendarToolbar } from "@/components/calendar/CalendarToolbar";
import { Sidebar } from "@/components/calendar/Sidebar";
import Stack from "@mui/material/Stack";
import { Suspense, type ReactNode } from "react";
import { StoreProvider } from "@/app/StoreProvider";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";

export default function CalendarLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoreProvider>
        <NotificationProvider>
          <Stack direction="row" sx={{ height: "100dvh" }}>
            <Sidebar />
            <Stack sx={{ flex: 1 }}>
              <CalendarToolbar />
              <Stack
                component="main"
                sx={{
                  m: "0rem 1rem 1rem",
                  bgcolor: "background.paper",
                  border: "1px solid #e6e8ec",
                  borderRadius: "12px",
                  overflow: "hidden",
                  flex: 1,
                  position: "relative",
                }}
              >
                {children}
              </Stack>
            </Stack>
          </Stack>
        </NotificationProvider>
      </StoreProvider>
    </Suspense>
  );
}
