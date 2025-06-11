export interface UserModel {
  id: number;
  firstname: string;
  lastname: string;
  affiliation?: string;
  seed_rank?: number | null;
  category: string;
  slip_filename?: string;
  is_paid?: boolean;
  group_name?: string;
  createdAt?: string;
}

export interface TournamentModel {
  id: number;
  name: string;
  category: string;
  status: string;
  qualification_rules?: string;
  created_at?: string;
}

export interface MatchModel {
  id: number;
  tournament_id: number;
  round: string;
  group_name?: string;
  player1_id?: number | null;
  player2_id?: number | null;
  player1?: UserModel | null;
  player2?: UserModel | null;
  player1_score?: number | null;
  player2_score?: number | null;
  winner_id: number;
  winner?: UserModel | null;
  match_order: number;
  status: string;
  created_at: string;
  tournament?: TournamentModel;
}
