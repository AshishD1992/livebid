export interface IPlaceBet {
  backlay: string;
  bfId: string;
  info: string;
  marketId: number;
  matchBfId: string;
  matchId: number;
  odds: string;
  runnerName: string;
  score: string;
  source: string;
  sportId: string;
  stake: string;
}

export class PlaceMOBet {
  public backlay!: string;
  public bfId!: string;
  public info!: string;
  public marketId!: string;
  public matchBfId!: string;
  public matchId!: number;
  public odds!: string;
  public runnerName!: string;
  public score!: string;
  public source!: string;
  public sportId!: number;
  public stake!: string;

  constructor(
    obj?: IPlaceBet
  ) {
    Object.assign(this, obj);
  }
}
