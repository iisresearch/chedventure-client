export class Game implements IGame {
  public id: string;
  public name: string;
  public subtitle?: string;
  public author: string;
  public version: string;
  public createdAt?: string;
  public updatedAt?: string;
  public initialRoom?: InitialRoom;
  public documentation?: string;
  public isPublished: boolean

  constructor(id: string, name: string, subtitle: string | undefined, author: string,
              version: string, createdAt: string | undefined, updatedAt: string | undefined, initialRoom: InitialRoom | undefined, documentation: string | undefined, isPublished: boolean | undefined) {
    this.id = id;
    this.name = name;
    this.subtitle = subtitle;
    this.author = author;
    this.version = version;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.initialRoom = initialRoom;
    this.documentation = documentation;
    if (!isPublished) {
      this.isPublished = false;
    } else {
      this.isPublished = isPublished;
    }
  }
}



export interface IGame {
  id: string;
  name: string;
  subtitle?: string;
  author: string;
  version: string;
  createdAt?: string;
  updatedAt?: string;
  initialRoom?: InitialRoom;
  roomToGames?: RoomToGame[];
  characters?: Character[];
  contexts?: Context[];
  documentation?: string;
  isPublished: boolean;
}

export interface InitialRoom {
  id: number;
}

export interface RoomToGame {
  id: number;
  name: string;
  description: string | null;
  instructions?: String[] | null;
  room: Room;
  hitboxesToRoomToGame: HitboxesToRoomToGame[];
}

export interface Room {
  id: number;
  name: string;
  image: IImage;
  createdByUserId?: string;
  hitboxes?: Hitbox[];
}

export interface IImage {
  type: string;
  data: ArrayBuffer;
}

export interface HitboxesToRoomToGame {
  id: number;
  displayHitbox?: boolean;
  blink?: boolean;
  hitbox: Hitbox;
  targetRoom: RoomToGame | null;
  targetCharacter: Character | null;
}

export interface Hitbox {
  id: number;
  coordinates: Coordinate[];
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Character {
  id: number;
  name: string;
  description?: string;
  title?: string;
  history?: number;
  chatbotUrl: string;
}

export interface Context {
  id: number;
  name: string;
  prompt: string[];
  dialogues: Dialogue[];
}

export interface Dialogue {
    id: number;
    utterance: string;
    response: string;
}
