export interface PlanType {
  planId: string;
  name: string;
  maxQuantity: string;
  maxUsers: number;
  maxWatchlist: number;
}

export interface UserDetailsType {
  id: string;
  email: string;
  name: string;
  SubStatus: string;
  plan: PlanType | null;
}
