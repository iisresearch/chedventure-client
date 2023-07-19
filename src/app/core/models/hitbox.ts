export interface Hitbox {
  id: number;
  targetId: number;
  coordinates: Coordinate[];
  displayHitbox?: boolean;
  blink?: boolean;
}

export interface Coordinate {
  x: number;
  y: number;
}
