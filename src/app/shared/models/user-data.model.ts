import { Sport } from './sport.model';
import { SportsData } from './sports-data';
import { UserBet } from './user-bet';

export interface UserData {
  _allinfo: [
    {
      Key: number;
      Value: [
        {
          Key: number;
          Value: [
            {
              Key: number;
              Value: [
                {
                  Key: number;
                  Value: {
                    bfId: string;
                    id: number;
                    isBettingAllow: number;
                    isMulti: number;
                    name: string;
                    runnerData: {
                      runner1Back: string;
                      runner1BackSize: string;
                      runner1Lay: string;
                      runner1LaySize: string;
                      runner1Name: string;
                      runner2Back: string;
                      runner2BackSize: string;
                      runner2Lay: string;
                      runner2LaySize: string;
                      runner2Name: string;
                      runner3Back: string;
                      runner3BackSize: string;
                      runner3Lay: string;
                      runner3LaySize: string;
                      runner3Name: string;
                    };
                    runnerData1: [
                      {
                        Key: string;
                        Value: {
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
                          selectionId: 9223372036854775807;
                          status: string;
                        };
                      }
                    ];
                    status: string;
                  };
                }
              ];
            }
          ];
        }
      ];
    }
  ];
  _multimkt: [
    {
      Key: number;
      Value: [number];
    }
  ];
  _userAvgmatchedBets: { [Key: number]: UserBet[] };
  _userMatchedBets: { [Key: number]: UserBet[] };
  _userUnMatchedBets: { [Key: number]: UserBet[] };
  _userTpBets: { [Key: number]: UserBet[] };

  curTime: string;
  description: {
    result: string;
    status: string;
  };
  news: string;
  sportsData: SportsData;
  _fancyBook:any;
}
