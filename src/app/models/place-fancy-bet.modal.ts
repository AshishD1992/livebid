export interface IfPlaceBet {
    
	fancyId:number,
	info:String,
	matchBfId:String,
	matchId:number,
	mktBfId:String,
	rate:String,
	runnerName:String,
	score:String,
	source:String,
	stake:String,
	yesno:String
   
  }
  
  export class PlaceFancyBet {
    public fancyId!:number;
	public info!:String;
	public matchBfId!:String;
	public matchId!:number;
	public mktBfId!:String;
	public rate!:String;
	public runnerName!:String;
	public score!:String;
	public source!:String;
	public stake!:String;
	public yesNo!:String
    
    constructor(
      obj?: IfPlaceBet
    ) {
      Object.assign(this, obj);
    }
  }