import { useEffect, useState } from "react";
import { PanelCard } from "../PanelCard";
import { CardItemType } from "../PanelCard/CardItem";
import { yahooAxios } from "../../../../services/axios/yahooAxios";

type Loser = CardItemType;

export const LosersCard = () => {
  const [losers, setLosers] = useState<Loser[]>([]);

  useEffect(() => {
    const getLosers = async () => {
      const response = await yahooAxios.get("/market/get-day-losers");

      const losersResponse = (response.data.finance?.result?.[0]?.quotes?.slice(
        0,
        5
      ) || []) as any[];

      const formattedLosers = losersResponse.map((trending) => ({
        symbol: trending.symbol,
        price: trending.regularMarketPreviousClose,
        name: trending.longName,
        changePercent: trending.regularMarketChangePercent,
        change: trending.regularMarketChange,
      }));

      setLosers(formattedLosers);
    };

    getLosers();
  }, []);

  return <PanelCard title="Top losers" data={losers} />;
};
