import { axios } from "../../../../services/axios/axios";
import { User } from "../../../user";

export type SendMessageRequest = {
  question: string;
};

export type SendMessageResponse = any;

export async function sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
  const response = await axios.post<SendMessageResponse>(`/conversation`, request);

  return response.data;
}
