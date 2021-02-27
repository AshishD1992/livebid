import { Market } from './market';

export class Match {
  _avgmatchedBets!: [
    {
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
      stake: string;
      status: string;
      userId: number;
    }
  ];
  _fancyBets!: [
    {
      Key: string;
      Value: [
        {
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
          stake: string;
          status: string;
          userId: number;
        }
      ];
    }
  ];
  _matchedBets!: [
    {
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
      stake: string;
      status: string;
      userId: number;
    }
  ];
  _unMatchedBets!: [
    {
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
      stake: string;
      status: string;
      userId: number;
    }
  ];
  bfId!: string;
  bookRates!: {
    id: number;
    isActive: number;
    isBetAllow: number;
    maxStake: string;
    minStake: string;
    name: string;
    runnerData: [
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
    type: number;
  }[];
  commentary!: string;
  data!: [
    {
      ballStatus: string;
      id: number;
      isActive: number;
      isBetAllow: number;
      maxStake: string;
      minStake: string;
      name: string;
      noRate: string;
      noScore: string;
      note: string;
      rateRange: number;
      yesRate: string;
      yesScore: string;
    }
  ];
  dataMode!: number;
  displayApplication!: number;
  id!: number;
  inPlay!: number;
  isAutomatic!: number;
  markets!: Market[];
  method!: number;
  name!: string;
  oddsType!: number;
  settings!: {
    betDelay: string;
    maxProfit: string;
    maxStake: string;
    minStake: string;
  };
  startDate!: string;
  status!: string;
  tvConfig!: {
    channelIp: string;
    channelNo: number;
    hdmi: string;
    program: string;
  };
  videoEnabled!:boolean;
  hasFancy!: number;
  fancyData!: [
    {
      ballStatus: string;
      id: number;
      isActive: number;
      isAuto: number;
      isBetAllow: number;
      maxStake: string;
      minStake: string;
      name: string;
      noRate: string;
      noScore: string;
      note: string;
      rateRange: number;
      yesRate: string;
      yesScore: string;
    }
  ];
  bookMakingData!: [
    {
      id: number;
      isActive: number;
      isBetAllow: number;
      maxStake: string;
      minStake: string;
      name: string;
      runnerData: [];
      type: number;
    }
  ];
  sportradar_url!:any;
}
