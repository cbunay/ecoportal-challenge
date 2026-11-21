"use client";

import type { ReactNode } from "react";
import { SnackbarProvider } from "notistack";

export function NotificationProvider({ children }: { children: ReactNode }) {
  return (
    <SnackbarProvider
      autoHideDuration={4000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      {children}
    </SnackbarProvider>
  );
}
