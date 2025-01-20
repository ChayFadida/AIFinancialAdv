import { Divider, Typography } from "@mui/material";
import { Card } from "../../../../components";
import { CardItem, CardItemType } from "./CardItem";

type PanelCardProps = {
  title: string;
  data: CardItemType[];
};
// symbol, regularMarketPrice, longName, regularMarketChangePercent, regularMarketChange

export const PanelCard = ({ title, data }: PanelCardProps) => {
  return (
    <Card title="" sx={{ padding: 1, minHeight: "268px" }}>
      <Typography variant="h6">{title}</Typography>

      {data.map((item, index) => (
        <>
          <CardItem key={item.symbol + item.name} item={item} />
          {data.length !== index + 1 && (
            <Divider sx={{ borderStyle: "dashed" }} />
          )}
        </>
      ))}
    </Card>
  );
};
