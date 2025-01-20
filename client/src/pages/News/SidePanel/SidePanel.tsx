import { TrendingCard } from "./TrendingCard";
import { GainersCard } from "./GainersCard";
import { LosersCard } from "./LosersCard";
import { Box } from "@mui/material";

export const SidePanel = () => {
  return (
    <Box padding="0 24px 0 0" display="flex" flexDirection="column" gap={2}>
      <TrendingCard />
      <GainersCard />
      <LosersCard />
    </Box>
  );
};
