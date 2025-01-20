import { Card as MuiCard, SxProps, Typography } from "@mui/material";
import { ReactNode } from "react";

type CardProps = {
  title: ReactNode;
  sx?: SxProps;
  children: React.ReactNode;
};

export const Card = ({ title, children, sx }: CardProps) => {
  return (
    <MuiCard
      sx={{
        padding: 2,
        minWidth: "200px",
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: (theme) => theme.shape.borderRadius,
        ...sx,
      }}
    >
      <Typography variant="subtitle1">{title}</Typography>
      {children}
    </MuiCard>
  );
};
