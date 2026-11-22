import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

const hourHeight = 48;

export function HourCell({ onClick }: { onClick: () => void }) {
  return (
    <Box
      role="gridcell"
      onClick={onClick}
      sx={{ borderLeft: "1px solid #e6e8ec", cursor: "pointer" }}
    />
  );
}

export function HourRow({
  hour,
  children,
}: {
  hour: string;
  children: ReactNode;
}) {
  return (
    <Box
      role="row"
      sx={{
        display: "grid",
        gridTemplateColumns: "72px repeat(7, minmax(0, 1fr))",
        height: hourHeight,
        borderBottom: "1px solid #e6e8ec",
      }}
    >
      <Typography
        sx={{
          pr: 1,
          pt: 0.5,
          textAlign: "right",
          fontSize: 10,
          color: "#70757a",
        }}
      >
        {hour}
      </Typography>
      {children}
    </Box>
  );
}
