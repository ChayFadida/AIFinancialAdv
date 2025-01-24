import { axios } from "../../../../services/axios/axios";
import { User } from "../../../user";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  stocks: { stock_symbol: string; company: string }[]
}

export type RegisterResponse = User;

export async function register(
  request: RegisterRequest
): Promise<RegisterResponse> {
  const response = await axios.post<RegisterResponse>(
    `/auth/register`,
    request
  );

  return response.data;
}
