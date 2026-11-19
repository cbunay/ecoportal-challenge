"use client";

import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

export function Sidebar() {
  const [createAnchor, setCreateAnchor] = useState<HTMLElement | null>(null);
  const createOpen = Boolean(createAnchor);
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
        endIcon={<AddIcon />}
        aria-haspopup="menu"
        aria-expanded={createOpen}
        aria-controls={createOpen ? "create-menu" : undefined}
        onClick={(event) => setCreateAnchor(event.currentTarget)}
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
      <Menu
        id="create-menu"
        anchorEl={createAnchor}
        open={createOpen}
        onClose={() => setCreateAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem onClick={() => setCreateAnchor(null)}>Meeting</MenuItem>
      </Menu>
    </Box>
  );
}
