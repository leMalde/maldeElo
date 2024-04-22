import type { CheckableField } from "@eyeshare/web-components/concepts";
import type { CheckableElement } from "@eyeshare/web-components/mixins";
import type { GameRecord } from "./GameRecord";

export class GameModel {
    gamesCount: number = 0;
    include: boolean = true;
    bestEloPlayer: string = "";
    bestRatingPlayer: string = "";
    avgWinningScore: number = 0;
    bestWinningScore: string = "";
    // gameType: GameType;
    /*exclude: CheckableElement;
    howtoswitch: CheckableField;*/
    // results?: ResultModel[];

    constructor(public readonly id:number, public name:string, public bigGame:boolean, public gameType:GameType, public gameMode:GameMode, public scoringType:ScoringType){
        // this.gameType = gameTypeInt;
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