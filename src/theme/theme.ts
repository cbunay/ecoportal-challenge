import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1A73E8",
    },
    background: {
      default: "#F7F8FA",
    },
    text: {
      primary: "#202124",
    },
  },
  typography: {
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderColor: "#dadce0",
          color: "inherit",
          borderRadius: 999,
        },
      },
    },
  },
});

export default theme;
