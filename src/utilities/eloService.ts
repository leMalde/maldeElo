import { GameRecord } from "../models/GameRecord";

export function CalculateChanges(gameRecord:GameRecord){
    var results = gameRecord.results.sort((a, b) =>  a.rank - b.rank);
    var topscore = 0;

    for (var i = 0; i < results.length; i++) {
        const resultA = results[i];
        resultA!.player.games++;
        if (resultA!.score > topscore)
            topscore = resultA!.score;

        for (var j = i + 1; j < results.length; j++) {
            var resultB = results[j];
            var wA = 1;
            if (resultA!.rank > resultB!.rank) {
                wA = 0;
            } else if (resultA!.rank == resultB!.rank) {
                wA = 0.5;
            }

            var change = ChangeInElo(resultA!.player.elo, resultB!.player.elo, wA);
            resultA!.elochange += change;
            resultB!.elochange -= change;

            resultA!.ratingchange += 100 * (wA - 0.5);
            resultB!.ratingchange -= 100 * (wA - 0.5);
        } 
    }

    results.forEach(function(result){
        result.player.elo += result.elochange;
        result.playerelo = result.player.elo;
        result.player.rating += result.ratingchange;
        result.playerrating = result.player.rating;
        result.percent = 100 * result.score / topscore;
        result.player.scorepercent += result.percent;

        if (result.playerrating > result.player.bestrating)
            result.player.bestrating = result.playerrating;
        
        if (result.playerrating < result.player.worstrating)
            result.player.worstrating = result.playerrating;

        if (result.playerelo > result.player.bestelo)
            result.player.bestelo = result.playerelo;
        
        if (result.playerelo < result.player.worstelo)
            result.player.worstelo = result.playerelo;

        if (result.rank == 1)
            result.player.winpercent++;

    });
}

export function SetRanks(gameRecord:GameRecord){
    var results = gameRecord.results.sort((a, b) =>  b.score - a.score || b.tiebreak - a.tiebreak);

    for (let i = 0; i < results.length; i++) {        
        results[i]!.rank = i + 1;
        // console.log(gameRecord.game.name + ": #" + (i + 1) + " " + results[i]?.player.name );
    }
}

function ChangeInElo(eloA:number, eloB:number, wA:number, k = 100){ // wA 1 if A wins, 0.5 if draw and 0 if B wins
	var R1 = Math.pow(10,eloA/1000);
	var R2 = Math.pow(10,eloB/1000);
	var change = k * (wA - R1/(R1+R2));
	return Math.round(change);
}