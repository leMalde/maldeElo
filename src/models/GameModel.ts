import type { CheckableField } from "@eyeshare/web-components/concepts";
import type { CheckableElement } from "@eyeshare/web-components/mixins";
import type { GameRecord } from "./GameRecord";

export class GameModel {
    scoringType: ScoringType = "MostPoints";
    gameMode: GameMode = "FFA";
    gamesCount: number = 0;
    include: boolean = true;
    bestEloPlayer: string = "";
    bestRatingPlayer: string = "";
    avgWinningScore: number = 0;
    bestWinningScore: string = "";
    /*exclude: CheckableElement;
    howtoswitch: CheckableField;*/
    // results?: ResultModel[];

    constructor(public name: string, public bigGame: boolean = false, public gameType: GameType = "BoardGame"){
        this.gameMode = "FFA";
        this.scoringType = "MostPoints";
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

type GameType = "BoardGame"|"Gaming"|"Sport";

type ScoringType = "MostPoints"|"LeastPoints";

type GameMode = "FFA"|"Team";