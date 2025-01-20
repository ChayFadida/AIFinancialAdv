import { default as Axios } from "axios";

export const aiAxios = Axios.create({
  baseURL: "http://localhost:8000",
});