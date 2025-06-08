export interface Registration {
  id: number;
  firstname: string;
  lastname: string;
  affiliation: string;
  seed_rank: string;
  category: string;
  slip_filename: string;
  is_paid: boolean;
  group_name?: string;
  created_at: string;
}

