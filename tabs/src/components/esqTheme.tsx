import { createTheme } from "@mui/material";

export const esqDark = createTheme({
  palette: {
    mode: "dark",
    text: {
      primary: "#ebecf0",
    },
    primary: {
      main: "#F15A2B",
    },
  }, 
  typography: {
    allVariants: {
      color: "#ebecf0"
    }
  }
});

export const esqLight = createTheme({
  palette: {
    text: {
      primary: "#111111",
    },
    primary: {
      main: "#F15A2B",
    },
    background: {
      default: "#ebecf0",
    },
  },
});