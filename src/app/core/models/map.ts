import {Hitbox} from "./hitbox";

export interface Map {
  id: number;
  description: string;
  imageUrl: string;
  hitboxes: Hitbox[];
}
