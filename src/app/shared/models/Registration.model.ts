export interface Registration {
  id: number;
  firstname: string;
  lastname: string;
  affiliation: string;
  seed_rank: string;
  category: string;
  slip_url: string;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'pending' | 'approved' | 'rejected';
