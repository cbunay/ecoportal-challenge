import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import type { ReactNode } from "react";

export const HOUR_HEIGHT = 48;
export const GUTTER_WIDTH = 72;
export const WEEK_COLUMNS = `${GUTTER_WIDTH}px repeat(7, minmax(0, 1fr))`;

export function WeekBody({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: WEEK_COLUMNS }}>
      {children}
    </Box>
  );
}

export function HourColumn({ hours }: { hours: string[] }) {
  return (
    <Box>
      {hours.map((hour) => (
        <Typography
          key={hour}
          sx={{
            height: HOUR_HEIGHT,
            pr: 1,
            pt: 0.5,
            textAlign: "right",
            fontSize: 10,
            color: "#70757a",
            borderBottom: "1px solid #e6e8ec",
          }}
        >
          {hour}
        </Typography>
      ))}
    </Box>
  );
}

export const DayColumn = styled(Box)({
  position: "relative",
  minWidth: 0,
  borderLeft: "1px solid #e6e8ec",
});

export const HourCell = styled(Box)({
  height: HOUR_HEIGHT,
  borderBottom: "1px solid #e6e8ec",
  cursor: "pointer",
});
