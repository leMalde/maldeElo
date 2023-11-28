export class GameModel {
    scoringType: ScoringType = "MostPoints";
    gameMode: GameMode = "FFA";
    results?: ResultModel[];

    constructor(public name: string, public gameType: GameType = "BoardGame"){
        this.gameMode = "FFA";
        this.scoringType = "MostPoints";
    }
}

export class ResultModel {
    name: string;
    score: string;
    rank: number;
    elochange: number;
}

type GameType = "BoardGame"|"Gaming"|"Sport";

type ScoringType = "MostPoints"|"LeastPoints";

type GameMode = "FFA"|"Team";