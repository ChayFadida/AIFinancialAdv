import { Box, Chip, Typography } from "@mui/material";

type PriceProps = {
  price: number;
  change?: number;
};
export const Price = ({ price, change }: PriceProps) => {
  const changeLabel = change ? `${change}%` : "";

  const getColor = () => {
    if (change === 0 || !change) {
      return "default";
    }

    return change > 0 ? "success" : "error";
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        component="span"
        variant="h5"
        sx={{ color: (theme) => theme.palette.primary.contrastText }}
      >
        $ {price}
      </Typography>

      {change && (
        <Chip
          label={changeLabel}
          color={getColor()}
          variant="outlined"
          size="small"
        />
      )}
    </Box>
  );
};
