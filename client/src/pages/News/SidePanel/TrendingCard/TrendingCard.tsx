import { useEffect, useState } from "react";
import { PanelCard } from "../PanelCard";
import { yahooAxios } from "../../../../services/axios/yahooAxios";
import { CardItemType } from "../PanelCard/CardItem";

type Trending = CardItemType;

export const TrendingCard = () => {
  const [trendings, setTrendings] = useState<Trending[]>([]);

  useEffect(() => {
    const getTrendings = async () => {
      const response = await yahooAxios.get("/market/get-trending");

      const trendingsResponse =
        (response.data.finance?.result?.[0]?.quotes?.slice(0, 5) ||
          []) as any[];

      const formattedTrendings = trendingsResponse.map((trending) => ({
        symbol: trending.symbol,
        price: trending.regularMarketPreviousClose,
        name: trending.longName,
        changePercent: trending.regularMarketChangePercent,
        change: trending.regularMarketChange,
      }));

      setTrendings(formattedTrendings);
    };

    getTrendings();
  }, []);

  return <PanelCard title="Trending tickers" data={trendings} />;
};
