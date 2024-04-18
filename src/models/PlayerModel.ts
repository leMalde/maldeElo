export class PlayerModel {
    rating: number = 1000;
    elo: number = 1000;
    games: number = 0;
    bestrating: number = 0;
    worstrating: number = 2000;
    bestelo: number = 0;
    worstelo: number = 2000;
    scorepercent: number = 0.00;
    winpercent: number = 0.00;
    gamescount: Record<string, number> = {};
    opponentswins: Record<string, number> = {}
    opponentslosses: Record<string, number> = {}

    constructor(public name:PlayerNames){};
}

export function AddOrIncrease(record: Record<string, number>, key: string){
    if (record.hasOwnProperty(key))
        record[key] ++;
    else
        record[key] = 1;
}

export function PostProcess(player: PlayerModel){
    player.scorepercent = Math.round(100 * player.scorepercent / player.games) / 100;
    player.winpercent = Math.round(100 * 100 * player.winpercent / player.games) / 100;
}

export function ResetPlayerValues(player:PlayerModel){
    player.rating = 1000;
    player.elo = 1000;
    player.games = 0;
    player.bestrating = 0;
    player.worstrating = 2000;
    player.bestelo = 0;
    player.worstelo = 2000;
    player.scorepercent = 0.00;
    player.winpercent = 0.00;
}

type PlayerNames = "Espen"|"Roen"|"Magga"|"leMalde"|"Gaute"|"Katrine"|"Simen"|"Nora"|"Jostein"|"Elisa"|"Steini"|"Marita"|"Marius"|"Maren"|"Nobody"|"Rohan"|"Trippo"|"Atle"|"Tonstad"|"Henrik";