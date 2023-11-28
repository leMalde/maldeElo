import type { GameModel } from "./GameModel";

export class GameRecord {
    date: Date;
    game: GameModel;
    results: ResultModel[];
}

export class ResultModel {
    rank: number = 0;
    elochange: number = 0;
    playerelo: number = 1000;
    percent: number = 0;

    constructor(public player: PlayerModel, public score: number, public tiebreak: number = 0){}
}