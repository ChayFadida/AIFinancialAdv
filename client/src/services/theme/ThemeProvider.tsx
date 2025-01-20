import React from "react";
import { theme } from "./theme";
import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
