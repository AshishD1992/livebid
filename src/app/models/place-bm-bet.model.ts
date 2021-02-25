export interface IPlaceBet {
  backlay: String;
  bookId: number;
  eventId: number;
  info: String;
  mktname: String;
  odds: String;
  runnerId: number;
  runnerName: String;
  source: String;
  stake: String;
}

export class PlaceBMBet {
  backlay!: String;
  bookId!: number;
  eventId!: number;
  info!: String;
  mktname!: String;
  odds!: String;
  runnerId!: number;
  runnerName!: String;
  source!: String;
  stake!: String;

  constructor(obj?: IPlaceBet) {
    Object.assign(this, obj);
  }
}
