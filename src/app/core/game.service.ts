import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";
import {Character, Context, IGame, Message, Room, RoomToGame} from "./models/game";
import {MessageService, MessageStatus} from "./message.service";
import {environment} from '../../environments/environment';

export const baseUrl = environment.apiURL;
// baseUrlDomain is used in game component & game-detail-edit-final-configuration to display link to game
export const baseUrlDomain = environment.urlClient;
// url to chatbot application
export const chatbotUrl = environment.chatbotUrl;

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private httpClient: HttpClient, private messageService: MessageService) { }

  getGames(): Observable<IGame[]> {
    return this.httpClient.get<IGame[]>(`${baseUrl}/games`)
      .pipe(
        tap(_ => console.log("fetched games")),
        catchError(this.handleError<IGame[]>('Fetch games', []))
      );
  }

  getGame(id: string): Observable<IGame> {
    return this.httpClient.get<IGame>(`${baseUrl}/games/${id}`)
      .pipe(
        tap(_ => console.log("fetched game")),
        catchError(this.handleError<IGame>('Fetch game', ))
      );
  }

  deleteGame(id: string) {
    return this.httpClient.delete(`${baseUrl}/games/${id}`)
      .pipe(
        tap(_ => console.log("Game deleted")),
        tap(_ => this.messageService.Show("Game has been deleted", MessageStatus.Success)),
        catchError(this.handleError('deleteCharacter'))
      )
  }

  playGame(id: string): Observable<IGame> {
    return this.httpClient.get<IGame>(`${baseUrl}/play/${id}`)
      .pipe(
        tap(_ => console.log("fetched games")),
        catchError(this.handleError<IGame>('playGame', ))
      );
  }

  addGame(game: IGame): Observable<IGame> {
    return this.httpClient.post<IGame>(`${baseUrl}/games`, game)
      .pipe(
        tap(_ => console.log("created game")),
        catchError(this.handleError<IGame>('addGame', game))
      );
  }

  updateGame(id: string, game: IGame): Observable<IGame> {
    return this.httpClient.put<IGame>(`${baseUrl}/games/${id}`, game)
      .pipe(
        tap(_ => this.messageService.Show("Game has been updated", MessageStatus.Success)),
        catchError(this.handleError<IGame>('updateGame', game))
      )
  }

  getRooms(): Observable<Room[]> {
    return this.httpClient.get<Room[]>(`${baseUrl}/rooms`)
      .pipe(
        tap(_ => console.log("fetched rooms")),
        catchError(this.handleError<Room[]>('getRooms', []))
      );
  }

  getRoomsInGame(id: string): Observable<RoomToGame[]> {
    return this.httpClient.get<RoomToGame[]>(`${baseUrl}/rooms/game/${id}`)
      .pipe(
        tap(_ => console.log("fetched rooms")),
        catchError(this.handleError<RoomToGame[]>('getRoomsInGame', []))
      );
  }

  getCharactersInGame(id: string): Observable<Character[]> {
    return this.httpClient.get<Character[]>(`${baseUrl}/characters/game/${id}`)
      .pipe(
        tap(_ => console.log("fetched characters")),
        catchError(this.handleError<Character[]>('getCharactersInGame', []))
      );
  }

  createRoomToGame(gameId: string, roomToGame: RoomToGame): Observable<RoomToGame> {
    return this.httpClient.post<RoomToGame>(`${baseUrl}/rooms/game/${gameId}`, roomToGame)
      .pipe(
        tap(_ => this.messageService.Show("Room has been created", MessageStatus.Success)),
        catchError(this.handleError<RoomToGame>('createRoomToGame', roomToGame))
      )
  }

  updateRoomToGame(id: number, roomToGame: RoomToGame): Observable<RoomToGame> {
    return this.httpClient.put<RoomToGame>(`${baseUrl}/rooms/game/${id}`, roomToGame)
      .pipe(
        tap(_ => this.messageService.Show("Room has been updated", MessageStatus.Success)),
        catchError(this.handleError<RoomToGame>('updateRoomToGame', roomToGame))
      )
  }

  deleteRoomToGame(id: number) {
    return this.httpClient.delete(`${baseUrl}/rooms/game/${id}`)
      .pipe(
        tap(_ => console.log("Room deleted")),
        tap(_ => this.messageService.Show("Room has been deleted", MessageStatus.Success)),
        catchError(this.handleError('deleteRoomToGame'))
      )
  }

  createCharacter(gameId: string, character: Character): Observable<Character> {
    return this.httpClient.post<Character>(`${baseUrl}/characters/game/${gameId}`, character)
      .pipe(
        tap(_ => this.messageService.Show("Character has been created", MessageStatus.Success)),
        catchError(this.handleError<Character>('createCharacter', character))
      )
  }

  updateCharacter(id: number, character: Character): Observable<Character> {
    return this.httpClient.put<Character>(`${baseUrl}/characters/game/${id}`, character)
      .pipe(
        tap(_ => this.messageService.Show("Character has been updated", MessageStatus.Success)),
        catchError(this.handleError<Character>('updateCharacter', character))
      )
  }

  deleteCharacter(id: number) {
    return this.httpClient.delete(`${baseUrl}/characters/game/${id}`)
      .pipe(
        tap(_ => console.log("Character deleted")),
        tap(_ => this.messageService.Show("Character has been deleted", MessageStatus.Success)),
        catchError(this.handleError('deleteCharacter'))
      )
  }

  createCustomRoom(room: Room): Observable<Room> {
    return this.httpClient.post<Room>(`${baseUrl}/rooms`, room)
      .pipe(
        tap(_ => this.messageService.Show("Room has been created", MessageStatus.Success)),
        catchError(this.handleError<Room>('CreateRoom', room))
      )
  }

  deleteCustomRoom(id: number) {
    return this.httpClient.delete(`${baseUrl}/rooms/${id}`)
      .pipe(
        tap(_ => console.log("Custom room deleted")),
        tap(_ => this.messageService.Show("Room has been deleted", MessageStatus.Success)),
        catchError(this.handleError('deleteCharacter'))
      )
  }

  getContextsOfCharacter(id: number): Observable<Context[]> {
    return this.httpClient.get<Context[]>(`${baseUrl}/contexts/character/${id}`)
        .pipe(
            tap(_ => console.log("fetched contexts")),
            catchError(this.handleError<Context[]>('getContextsOfCharacter', []))
        );
  }

  getContextsInGame(id: string): Observable<Context[]> {
    return this.httpClient.get<Context[]>(`${baseUrl}/contexts/game/${id}`)
        .pipe(
            tap(_ => console.log("fetched contexts")),
            catchError(this.handleError<Context[]>('getContextsInGame', []))
        );
  }

  createContext(characterId: number, context: Context): Observable<Context> {
    return this.httpClient.post<Context>(`${baseUrl}/contexts/character/${characterId}`, context)
      .pipe(
        tap(_ => this.messageService.Show("Context has been created", MessageStatus.Success)),
        catchError(this.handleError<Context>('createContext', context))
      )
  }

  updateContext(id: number, context: Context): Observable<Context> {
    return this.httpClient.put<Context>(`${baseUrl}/contexts/${id}`, context)
      .pipe(
        tap(context => this.messageService.Show("Context " + context.name + " has been updated", MessageStatus.Success)),
        catchError(this.handleError<Context>('updateContext', context))
      )
  }

  deleteContext(id: number) {
    return this.httpClient.delete(`${baseUrl}/contexts/${id}`)
      .pipe(
        tap(_ => console.log("Context deleted ", _ )),
        tap(_ => this.messageService.Show("Context has been deleted", MessageStatus.Success)),
        catchError(this.handleError('deleteContext'))
      )
  }

  updateMessage(intent: number, message: Message): Observable<Message> {
    return this.httpClient.put<Message>(`${baseUrl}/messages/${intent}`, message)
        .pipe(
            tap(_ => this.messageService.Show("Message has been updated", MessageStatus.Success)),
            catchError(this.handleError<Message>('updateMessage', message))
        )
  }

  deleteMessage(intent: number) {
    return this.httpClient.delete(`${baseUrl}/messages/${intent}`)
        .pipe(
            tap(_ => this.messageService.Show("Message has been deleted", MessageStatus.Success)),
            tap(_ => console.log("Message deleted")),
            catchError(this.handleError('deleteMessage'))
        )
  }

  // Chatbot related endpoints


  checkChatbotStatus() {
    return this.httpClient.head(`${chatbotUrl}`)
        .pipe(
            map(()=> true),
            catchError((error: HttpErrorResponse) => {
              console.error('Chatbot server is not available');
              return of(false);
            })
        );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      if (error.error && error.error.message) {
        this.messageService.Show(error.error.message, MessageStatus.Error);
      } else {
        this.messageService.Show("Unknown error", MessageStatus.Error);
      }


        // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
