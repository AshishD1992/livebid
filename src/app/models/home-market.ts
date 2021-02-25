export class HomeMarket {
  mktId!: number;
  status!: string;
  name!: string;
  bfId!: string;
  id!: string;
  isBettingAllow!: number;
  isMulti!: number;
  pnl!: [{
    Key: string,
    Value: string
  }]
  runnerData!: [
    {
      back1: string;
      back2: string;
      back3: string;
      backSize1: string;
      backSize2: string;
      backSize3: string;
      bfId: string;
      lay1: string;
      lay2: string;
      lay3: string;
      laySize1: string;
      laySize2: string;
      laySize3: string;
      marketId: number;
      mktStatus: string;
      runnerName: string;
      selectionId: number;
      status: string;
    }
  ];
}
