import type { GameRecord } from "./GameRecord";

export class GameModel {
    gamesCount: number = 0;
    include: boolean = true;
    bestEloPlayer: string = "";
    bestRatingPlayer: string = "";
    avgWinningScore: number = 0;
    bestWinningScore: string = "";
    gameType: string = "";
    gameMode: string = "";
    scoringType: string = "";
    // gameType: GameType;
    /*exclude: CheckableElement;
    howtoswitch: CheckableField;*/
    // results?: ResultModel[];

    constructor(public readonly id:number, public name:string, public bigGame:boolean, public gameTypeInt:GameType, public gameModeInt:GameMode, public scoringTypeInt:ScoringType){
        // this.gameType = gameTypeInt;
        this.gameType = GameType[gameTypeInt]
        this.gameMode = GameMode[gameModeInt]
        this.scoringType = ScoringType[scoringTypeInt]
    };
}

export function findBestPlayer(game:GameModel, records:GameRecord){

}

/*export class ResultModel {
    name: string;
    score: string;
    rank: number;
    elochange: number;
}*/

export enum GameType {
    "Board game",
    "Gaming",
    "Sport"
}

// = "BoardGame"|"Gaming"|"Sport";

export enum ScoringType { 
    "MostPoints",
    "LeastPoints"
}

export enum GameMode {
    "FFA",
    "Team"
}