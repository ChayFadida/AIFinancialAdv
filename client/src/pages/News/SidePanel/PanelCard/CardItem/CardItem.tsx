import { Box, Link, Typography } from "@mui/material";
import React from "react";

export type CardItemType = {
  symbol: string;
  price: number;
  name: string;
  changePercent: number;
  change: number;
};

type CardItemProps = {
  item: CardItemType;
};
export const CardItem = ({ item }: CardItemProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: "space-between",
        cursor: "pointer",
        "&:hover a": { textDecoration: "underline" },
      }}
      onClick={() =>
        window.open(`https://finance.yahoo.com/quote/${item.symbol}`, "_blank")
      }
    >
      <Box
        sx={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        <Link sx={{ textDecoration: "none", fontSize: "14px", fontWeight: '600' }}>
          {item.symbol}
        </Link>
        <Typography
          variant="subtitle2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "12px",
          }}
        >
          {item.name}
        </Typography>
      </Box>
      <Box>
        <Typography sx={{ textAlign: "end", fontSize: "12px" }}>
          {item.price}
        </Typography>
        <Typography
          component="span"
          variant="subtitle2"
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            color: item.change >= 0 ? "green" : "red",
            fontSize: "12px",
          }}
        >
          {item.changePercent >= 0 ? "+" : ""}
          {item.change.toFixed(2)} ({item.changePercent >= 0 ? "+" : ""}
          {item.changePercent.toFixed(2)}%)
        </Typography>
      </Box>
    </Box>
  );
};
