import { Game } from "./gameModel";

export interface GameRepository {
  get(): Promise<Game[] | null>;
}