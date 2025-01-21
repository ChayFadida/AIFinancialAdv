import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArticleIcon from "@mui/icons-material/Article";
import { paths } from "../../services/routes";
import {
  Dashboard,
  ExitToApp,
  Grade,
  Person,
  SmartToy,
} from "@mui/icons-material";
import { Drawer, DrawerHeader, StyledAppBar } from "./DashboardLayout.styles";
import { NavItem } from "./NavItem";
import { appStorage } from "../../services/appStorage";
import { useUser } from "../../context";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const { handleUser } = useUser();

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Dashboard />,
      path: paths.dashboard.absolute,
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: <Person />,
      path: paths.dashboard.portfolio.absolute,
    },
    {
      id: "myNews",
      label: "My News",
      icon: <ArticleIcon />,
      path: paths.dashboard.myNews.absolute,
    },
    {
      id: "Recommendation",
      label: "Recommendation",
      icon: <Grade />,
      path: paths.dashboard.Recommendation.absolute,
    },
    {
      id: "chatBot",
      label: "Chat Bot",
      icon: <SmartToy />,
      path: paths.dashboard.chatBot.absolute,
    },
  ];

  const handleSignOut = () => {
    handleUser(null);
    appStorage.setToken("");
  };

  const bottomNavItems = [
    {
      id: "logout",
      label: "Logout",
      icon: <ExitToApp />,
      onClick: handleSignOut,
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <StyledAppBar position="fixed" open={open}>
        <Toolbar
          sx={{
            background: (theme) => theme.palette.background.paper,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <Divider />
      </StyledAppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Typography variant="h6" noWrap component="div">
            T&C Advisory
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{ height: "100%", paddingBottom: 2 }}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              {navItems.map((item) => (
                <NavItem
                  key={item.id}
                  id={item.id}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  open={open}
                />
              ))}
            </Box>
            {bottomNavItems.map((item) => (
              <NavItem
                key={item.id}
                id={item.id}
                icon={item.icon}
                label={item.label}
                path={paths.dashboard.absolute}
                open={open}
                onClick={item.onClick}
              />
            ))}
          </Box>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
