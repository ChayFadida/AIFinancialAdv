import { axios } from "../../../../services/axios/axios";
import { User } from "../../../user";

export type LoginByTokenResponse = User;

export async function loginByToken(): Promise<LoginByTokenResponse> {
  const response = await axios.get<LoginByTokenResponse>(`/auth`);

  return response.data;
}
