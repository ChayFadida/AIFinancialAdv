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
  Info,
  Person,
  PsychologyAlt,
  SmartToy,
} from "@mui/icons-material";
import { Drawer, DrawerHeader, StyledAppBar } from "./DashboardLayout.styles";
import { NavItem } from "./NavItem";
import { appStorage } from "../../services/appStorage";
import { useUser } from "../../context";
import { Avatar, TextField } from "@mui/material";
import { Menu, MenuItem, Button } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import company_symbol from "../../utils/company_symbol.json";
import { updateUserProfile } from "../../features/auth/api";
import HelpIcon from '@mui/icons-material/Help';
import SendIcon from '@mui/icons-material/Send';
import { Snackbar, Alert } from "@mui/material";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const { user, handleUser } = useUser();

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [isEditing, setIsEditing] = React.useState(false);
  const [editFormData, setEditFormData] = React.useState({
    name: user?.name || "",
    stocks: user?.stocks || [],
  });

  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  const handleEditClick = () => {
    setIsEditing(true);
    setEditFormData({
      name: user?.name || "",
      stocks: user?.stocks || [],
    });
  };

  const validateEditForm = () => {
    if (!editFormData.name.trim()) {
      setError("Name is required");
      return false;
    }

    if (editFormData.stocks.length === 0) {
      setError("Please select at least one stock to follow");
      return false;
    }

    setError("");
    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateEditForm()) {
      return; // The error state will trigger the Snackbar
    }

    try {
      const updatedUser = await updateUserProfile(editFormData);
      
      if (updatedUser) {
        handleUser({ ...user, ...updatedUser });
        setIsEditing(false);
        handleMenuClose();
        setSuccessMessage('Profile updated successfully!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    handleMenuClose();
  }


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
    {
      id: "About",
      label: "About",
      icon: <Info />,
      path: paths.dashboard.About.absolute,
    },
    {
      id: "FAQ",
      label: "FAQ",
      icon: <HelpIcon />,
      path: paths.dashboard.FAQ.absolute,
    },
    {
      id: "Contact",
      label: "Contact",
      icon: <SendIcon />,
      path: paths.dashboard.Contact.absolute,
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>

              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ marginRight: 5, ...(open && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6">Hello, {user?.name}</Typography>
            </Box>
            <Box >
              <Avatar sx={{ marginRight: 2, cursor: 'pointer' }} onClick={handleAvatarClick}>{user?.name.substring(0, 1).toUpperCase()}</Avatar>
              {/* <IconButton><ChevronDown></IconButton> */}
                <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            padding: 2,
            width: 320,
          }
        }}
      >
        {!isEditing ? (
          <>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <MenuItem>
              <Button 
                fullWidth 
                variant="contained"
                onClick={handleEditClick}
              >
                Edit Profile
              </Button>
            </MenuItem>
          </>
        ) : (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Edit Profile
            </Typography>
            <TextField
              fullWidth
              label="Name"
              value={editFormData.name}
              onChange={(e) => {
                setEditFormData({ ...editFormData, name: e.target.value });
                setError(""); // Clear error when user types
              }}
              sx={{ mb: 2 }}
              error={!!error && error.includes("Name")}
              helperText={error && error.includes("Name") ? error : ""}
            />
            <Autocomplete
              multiple
              options={company_symbol}
              disableCloseOnSelect
              getOptionLabel={(option) => String(option.company)}
              value={editFormData.stocks}
              onChange={(event, newValue) => {
                setEditFormData({ 
                  ...editFormData, 
                  stocks: newValue as { stock_symbol: string; company: string }[] 
                });
                setError(""); // Clear error when user selects stocks
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.stock_symbol} ({option.company})
                </li>
              )}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Stocks to follow" 
                  placeholder="Select stocks"
                  error={!!error && error.includes("stock")}
                  helperText={error && error.includes("stock") ? error : ""}
                />
              )}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                fullWidth 
                variant="contained"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
              <Button 
                fullWidth 
                variant="outlined"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Menu>

            </Box>
          </Box>
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
      
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError("")} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccessMessage("")} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
