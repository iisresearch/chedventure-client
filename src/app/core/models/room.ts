import {Hitbox} from "./hitbox";

export interface Room {
  id: number;
  imageUrl: string;
  hitboxes: Hitbox[];
  description: string|undefined;
  name: string;
  instructions: String[];
}
