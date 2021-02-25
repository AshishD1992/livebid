import { Tournament } from "./tournament";

export class Sport extends Map {
  bfId!: string;
  id!: number;
  img!: string;
  name!: string;
  tournaments!: Tournament[];
}
