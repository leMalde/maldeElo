import type { GameModel } from "./GameModel";
import type { PlayerModel } from "./PlayerModel";

export class GameRecord {
    date: Date;
    game: GameModel;
    results: ResultModel[];
}

export class ResultModel {
    rank: number = 0;
    elochange: number = 0;
    ratingchange: number = 0;
    playerelo: number = 1000;
    playerrating: number = 1000;
    percent: number = 0;

    constructor(public player: PlayerModel, public score: number, public tiebreak: number = 0){}
}