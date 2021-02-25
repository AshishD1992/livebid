import { Match } from './match.model';

export interface SportsDataById {
  [id: number]: {
    id: number;
    name: string;
    bfId: string;
    tournaments: {
      [id: number]: {
        bfId: string;
        id: number;
        name: string;
        matches: {
          [id: number]: Match;
        };
      };
    };
  }
}
