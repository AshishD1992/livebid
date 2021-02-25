
export interface IBetDataModel {
    profit: string;
    betType: number;
    bookId: number;
    bookType: number;
    yesNo: "Yes" | "No";
    rate: string;
    backlay: string;
    eventId: number;
    info: string;
    mktname: string;
    odds: string;
    runnerId: number;
    runnerName: string;
    source: string;
    stake: string
}

export class BetDataModel implements IBetDataModel {
    profit!: string;
    betType!: number;
    bookId!: number;
    bookType!: number;
    yesNo!: "Yes" | "No";
    yesno!:string;
    rate!: string;
    eventId!: number;
    backlay!: string;
    info!: string;
    mktname!: string;
    odds!: string;
    runnerId!: number;
    runnerName!: string;
    source!: string;
    stake!: string;
    bfId!: string;
    marketId!: string;
    matchBfId!: string;
    matchId!: number;
    score!: string;
    sportId!: number;
    fancyId!:number;
	mktBfId!:string;

    constructor(obj?: BetDataModel) {
        Object.assign(this, obj);
    }
}
