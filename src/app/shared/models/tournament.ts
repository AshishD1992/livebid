import { Match } from './match.model';

export class Tournament {
  bfId: string = "";
  id: number = -1;
  matches!: Match[];
  name!: "";
}
