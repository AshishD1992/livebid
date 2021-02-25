export interface UserBet {
  backLay: string;
  bfId: string;
  date: string;
  id: number;
  isFancy: number;
  marketId: number;
  marketName: string;
  matchId: number;
  matchName: string;
  odds: string;
  runnerName: string;
  score: number;
  sportName: string;
  stake: number;
  status: string;
  userId: number;

  stakeValid: boolean;
  isActive: boolean;
  profit: number;
  oldStake: number;
  oldOdds: string;
  update: boolean;
}
