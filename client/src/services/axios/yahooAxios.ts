import Axios from "axios";
import { Config } from "../../config";

export const yahooAxios = Axios.create({
  baseURL: "https://yahoo-finance166.p.rapidapi.com/api",
});

yahooAxios.interceptors.request.use(async (config) => {
  config.headers["x-rapidapi-key"] = Config.YAHOO_API_KEY;
  config.headers["x-rapidapi-host"] = Config.YAHOO_API_HOST;

  return config;
});
