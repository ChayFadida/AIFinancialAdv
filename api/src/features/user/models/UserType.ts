export interface UserType {
  _id: string;
  name: string;
  email: string;
  password: string;
  stocks: { symbol: string; company_name: string; }[];
  createdAt: Date;
}
