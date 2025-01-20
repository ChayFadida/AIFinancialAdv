import React, { useEffect, useState } from "react";
import { PanelCard } from "../PanelCard";
import { yahooAxios } from "../../../../services/axios/yahooAxios";
import { CardItemType } from "../PanelCard/CardItem";

type Gainer = CardItemType;

export const GainersCard = () => {
  const [gainers, setGainers] = useState<Gainer[]>([]);

  useEffect(() => {
    const getGainers = async () => {
      const response = await yahooAxios.get("/market/get-day-gainers");

      const gainersResponse =
        (response.data.finance?.result?.[0]?.quotes?.slice(0, 5) ||
          []) as any[];

      const formattedGainers = gainersResponse.map((trending) => ({
        symbol: trending.symbol,
        price: trending.regularMarketPreviousClose,
        name: trending.longName,
        changePercent: trending.regularMarketChangePercent,
        change: trending.regularMarketChange,
      }));

      setGainers(formattedGainers);
    };

    getGainers();
  }, []);
  
  return <PanelCard title="Top gainers" data={gainers} />;
};
