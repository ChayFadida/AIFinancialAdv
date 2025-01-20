import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type NavItemProps = {
  id: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  open: boolean;
  onClick?: () => void;
};

export const NavItem = ({
  id,
  path,
  open,
  icon,
  label,
  onClick,
}: NavItemProps) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <ListItem
      key={id}
      onClick={onClick}
      disablePadding
      sx={{ display: "block" }}
    >
      <ListItemButton
        onClick={() => handleNavigation(path)}
        sx={{
          minHeight: 48,
          px: 2.5,
          justifyContent: open ? "initial" : "center",
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            justifyContent: "center",
            mr: open ? 3 : "auto",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>
  );
};
