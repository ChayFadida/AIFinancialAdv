import { axios } from "../../../../services/axios/axios";

export type GetConversationResponse = any;

export async function getConversation(): Promise<GetConversationResponse> {
  const response = await axios.get<GetConversationResponse>(`/conversation`);

  return response.data;
}
