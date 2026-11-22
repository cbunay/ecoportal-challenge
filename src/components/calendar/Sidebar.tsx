"use client";

import { useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import {
  draftToEvent,
  formatDateParam,
  toInputValue,
} from "@/lib/calendar-grid";
import { useFocusedDate } from "@/lib/use-focused-date";
import {
  setDraftEvent,
  type EventDraft,
} from "@/store/features/calendar/calendar.slice";
import { useCalendarDispatch } from "@/store/hooks";
import { useParams, useRouter } from "next/navigation";

export function Sidebar() {
  const createButton = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useCalendarDispatch();
  const router = useRouter();
  const { view } = useParams<{ view: string }>();
  const focusedDate = useFocusedDate();
  const openCreate = (draft: EventDraft) => {
    dispatch(setDraftEvent(draft));
    router.push(
      `/calendar/${view}/${formatDateParam(focusedDate)}/event/new?slot=${Date.now()}`,
    );
  };

  const handleCreateMeeting = () => {
    setMenuOpen(false);
    const [date] = toInputValue(focusedDate).split("T");
    openCreate({ date });
  };
  return (
    <Box
      component="nav"
      aria-label="Sidebar"
      sx={{
        width: 256,
        flexShrink: 0,
        px: 2.5,
        pt: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          aria-hidden
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "grid",
            placeItems: "center",
          }}
        >
          <CalendarMonthOutlinedIcon fontSize="small" />
        </Box>
        <Typography
          component="span"
          sx={{
            fontSize: 22,
            fontWeight: 500,
          }}
        >
          Calendar
        </Typography>
      </Box>
      <Button
        variant="outlined"
        ref={createButton}
        endIcon={<AddIcon />}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls={menuOpen ? "create-menu" : undefined}
        onClick={() => setMenuOpen(true)}
        sx={{
          mt: 3,
          height: 40,
          px: 1.75,
          borderRadius: 999,
          fontWeight: 500,
          color: "#3c4043",
          borderColor: "#dadce0",
        }}
      >
        Create
      </Button>
      {menuOpen && (
        <Menu
          id="create-menu"
          anchorEl={() => createButton.current as HTMLElement}
          open
          onClose={() => setMenuOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <MenuItem onClick={handleCreateMeeting}>Meeting</MenuItem>
        </Menu>
      )}
    </Box>
  );
}
