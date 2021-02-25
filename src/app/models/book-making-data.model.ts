export class BookMakingData {
  id!: number;
  isActive!: number;
  isBetAllow!: number;
  maxStake!: string;
  minStake!: string;
  name!: string;
  runnerData!: [
    {
      backPrice: string;
      backSize: string;
      ballStatus: string;
      book: string;
      id: number;
      layPrice: string;
      laySize: string;
      name: string;
    }
  ];
  type!: number;
  oldPnl?: any;
}
