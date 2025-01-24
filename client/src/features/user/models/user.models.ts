export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  stocks: { stock_symbol: string, company: string }[];
  createdAt: Date;
  updatedAt: Date;
}
