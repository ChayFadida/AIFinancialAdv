export interface Message {
  content: string;
  sender: "bot" | "user";
  timestamp: Date;
}
