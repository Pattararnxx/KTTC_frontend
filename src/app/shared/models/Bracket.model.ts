export interface Match {
  id: string;
  player1?: string;
  player2?: string;
  score1?: number;
  score2?: number;
  winner?: string;
  round: number;
}

export interface BracketData {
  matches: Match[];
  players: string[];
}
