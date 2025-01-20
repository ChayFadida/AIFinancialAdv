import Axios from "axios";
import { Config } from "../../config";

export const yahooChartAxios = Axios.create({
  baseURL: "https://yahoo-finance15.p.rapidapi.com/api/v1",
});

yahooChartAxios.interceptors.request.use(async (config) => {
  config.headers["x-rapidapi-key"] = Config.YAHOO_API_KEY;
  config.headers["x-rapidapi-host"] = Config.YAHOO_CHART_API_HOST;

  return config;
});
