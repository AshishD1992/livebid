import { Market } from './market';

export class Highlight extends Market {
    sportId!: number;
    bfId!: string;
    inPlay!: number;
    isBettingAllow!: number;
    isMulti!: number;
    marketId!: number;
    matchDate!: string;
    matchId!: number;
    matchBfId!: string;
    matchName!: string;
    sportName!: string;
    status!: string;
    tourBfId!: string;
    tourId!: number;
    tourName!: string;
    sportBfId!: string;
    hasFancy!: number;
    hasBookMaker!: number;
}
