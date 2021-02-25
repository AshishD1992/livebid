import { Match } from './match.model';
import { Market } from './market';

export class NavigationModel {
  bfId!: number;
  id!: number;
  name!: string;
  tournaments!: {
    bfId: number;
    id: number;
    name: string;
    matches: {
        id: {
            id: number,
            bfId: number,
            name: string,
            markets: {
                id: Market
            }
        }
    };
  };
}
