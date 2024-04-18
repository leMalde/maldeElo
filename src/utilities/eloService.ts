import { GameRecord, ResetResultValues } from "../models/GameRecord";
import { AddOrIncrease } from "../models/PlayerModel";

export function CalculateChanges(gameRecord:GameRecord){
    if (!gameRecord.game.include)
        return;

    var results = gameRecord.results.sort((a, b) =>  a.rank - b.rank);
    results.forEach(ResetResultValues);
    var topscore = 0;

    for (var i = 0; i < results.length; i++) {
        const resultA = results[i]!;
        resultA.player.games++;
        if (resultA!.score > topscore)
            topscore = resultA!.score;

        for (var j = i + 1; j < results.length; j++) {
            const resultB = results[j]!;
            var wA = 1;
            if (resultA!.rank > resultB!.rank) {
                wA = 0;
            } else if (resultA!.rank == resultB!.rank) {
                wA = 0.5;
            }
            

            var change = ChangeInElo(resultA.player.elo, resultB.player.elo, wA);
            resultA.elochange += change;
            resultB.elochange -= change;
            resultA.ratingchange += 100 * (wA - 0.5);
            resultB.ratingchange -= 100 * (wA - 0.5);
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

        if (result.rank == 1){
            result.player.winpercent++;
            gameRecord.winner = result.player;
        }
            

    });
}

export function SetRanksAndPlayerStats(gameRecord:GameRecord){
    var results = gameRecord.results.sort((a, b) =>  b.score - a.score || b.tiebreak - a.tiebreak);

    for (let i = 0; i < results.length; i++) {
        if (i > 0 && results[i]!.score === results[i - 1]!.score && results[i]!.tiebreak === results[i - 1]!.tiebreak)
            results[i]!.rank = i;
        else
            results[i]!.rank = i + 1;
        
        AddOrIncrease(results[i]!.player.gamescount, gameRecord.game.name);

        for (let j = 0; j < results.length; j++) {
            if (i == j)
                continue;

            if (i < j)
                AddOrIncrease(results[i]!.player.opponentswins, results[j]!.player.name);
            else
                AddOrIncrease(results[i]!.player.opponentslosses, results[j]!.player.name);
            
        }

    }
}

function ChangeInElo(eloA:number, eloB:number, wA:number, k = 100){ // wA 1 if A wins, 0.5 if draw and 0 if B wins
	var R1 = Math.pow(10,eloA/1000);
	var R2 = Math.pow(10,eloB/1000);
	var change = k * (wA - R1/(R1+R2));
	return Math.round(change);
}