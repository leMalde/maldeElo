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

    constructor(public name:string){};
}