import { GameModel } from "../models/GameModel";
import { GameRecord, ResultModel } from "../models/GameRecord";
import { ResetPlayerValues, type PlayerModel } from "../models/PlayerModel";
import { CalculateChanges, SetRanksAndPlayerStats } from "../utilities/eloService";



export function InitializeGameData(gameRecords:GameRecord[], playerData:PlayerModel[], games:GameModel[]){
    /*var rawGameData = [
        {
            date: new Date(2022, 10, 11),
            game: games[0]!,
            results: [
                new ResultModel(playerData[0]!, 51), // Espen
                new ResultModel(playerData[1]!, 51, 1), // Roen
                // new ResultModel(playerData[2]!, 51), // Magga
                new ResultModel(playerData[3]!, 44), // leMalde
            ]
        },
        {
            date: new Date(2022, 10, 12),
            game: games[0]!,
            results: [
                new ResultModel(playerData[0]!, 59), // Espen
                new ResultModel(playerData[1]!, 50), // Roen
                new ResultModel(playerData[2]!, 30), // Magga
                new ResultModel(playerData[3]!, 54), // leMalde
            ]
        },
        {
            date: new Date(2022, 10, 13),
            game: games[0]!,
            results: [
                new ResultModel(playerData[0]!, 48), // Espen
                new ResultModel(playerData[1]!, 27), // Roen
                // new ResultModel(playerData[2]!, 51), // Magga
                new ResultModel(playerData[3]!, 37), // leMalde
            ]
        },
        {
            date: new Date(2022, 10, 14),
            game: games[0]!,
            results: [
                new ResultModel(playerData[0]!, 51), // Espen
                new ResultModel(playerData[1]!, 52), // Roen
                new ResultModel(playerData[2]!, 46), // Magga
                new ResultModel(playerData[3]!, 68), // leMalde
            ]
        },


        {
            date: new Date(2023, 3, 28),
            game: games[1]!,
            results: [
                new ResultModel(playerData[0]!, 9), // Espen
                new ResultModel(playerData[1]!, 10), // Roen
                new ResultModel(playerData[2]!, 6), // Magga
                new ResultModel(playerData[3]!, 8), // leMalde
            ]
        },
        {
            date: new Date(2023, 4, 18),
            game: games[1]!,
            results: [
                new ResultModel(playerData[0]!, 9), // Espen
                new ResultModel(playerData[1]!, 9), // Roen
                new ResultModel(playerData[2]!, 11), // Magga
                new ResultModel(playerData[3]!, 5), // leMalde
            ]
        },

        {
            date: new Date(2023, 4, 19),
            game: games[0]!,
            results: [
                new ResultModel(playerData[0]!, 59), // Espen
                new ResultModel(playerData[1]!, 46), // Roen
                new ResultModel(playerData[2]!, 44), // Magga
                new ResultModel(playerData[3]!, 32), // leMalde
            ]
        },

        {
            date: new Date(2023, 7, 8),
            game: games[2]!,
            results: [
                new ResultModel(playerData[0]!, 129), // Espen
                new ResultModel(playerData[1]!, 136), // Roen
                new ResultModel(playerData[2]!, 134), // Magga
                new ResultModel(playerData[3]!, 119), // leMalde
            ]
        },
        {
            date: new Date(2023, 7, 13),
            game: games[2]!,
            results: [
                new ResultModel(playerData[0]!, 114), // Espen
                new ResultModel(playerData[1]!, 141), // Roen
                new ResultModel(playerData[2]!, 140), // Magga
                new ResultModel(playerData[3]!, 142), // leMalde
            ]
        },
        {
            date: new Date(2023, 7, 18),
            game: games[2]!,
            results: [
                new ResultModel(playerData[0]!, 101), // Espen
                new ResultModel(playerData[1]!, 128), // Roen
                new ResultModel(playerData[2]!, 109), // Magga
                new ResultModel(playerData[3]!, 138), // leMalde
            ]
        },
        {
            date: new Date(2023, 7, 19),
            game: games[3]!,
            results: [
                new ResultModel(playerData[0]!, 57), // Espen
                new ResultModel(playerData[1]!, 52), // Roen
                new ResultModel(playerData[2]!, 51), // Magga
                new ResultModel(playerData[3]!, 43), // leMalde
            ]
        },
        {
            date: new Date(2023, 7, 19),
            game: games[1]!,
            results: [
                new ResultModel(playerData[0]!, 7), // Espen
                new ResultModel(playerData[1]!, 10), // Roen
                new ResultModel(playerData[2]!, 8), // Magga
                new ResultModel(playerData[3]!, 10, 1), // leMalde
            ]
        },
        {
            date: new Date(2023, 7, 19),
            game: games[2]!,
            results: [
                new ResultModel(playerData[0]!, 133), // Espen
                new ResultModel(playerData[1]!, 148), // Roen
                new ResultModel(playerData[2]!, 131), // Magga
                new ResultModel(playerData[3]!, 150), // leMalde
            ]
        },
        {
            date: new Date(2023, 7, 20),
            game: games[4]!,
            results: [
                new ResultModel(playerData[0]!, 56, 1), // Espen
                new ResultModel(playerData[1]!, 44), // Roen
                new ResultModel(playerData[2]!, 56), // Magga
                new ResultModel(playerData[3]!, 50), // leMalde
            ]
        },

        {
            date: new Date(2023, 8, 9),
            game: games[5]!,
            results: [
                new ResultModel(playerData[0]!, 67, 1), // Espen
                new ResultModel(playerData[1]!, 60), // Roen
                new ResultModel(playerData[2]!, 70), // Magga
                new ResultModel(playerData[3]!, 67), // leMalde
            ]
        },
        {
            date: new Date(2023, 9, 1),
            game: games[2]!,
            results: [
                new ResultModel(playerData[0]!, 117), // Espen
                new ResultModel(playerData[1]!, 105), // Roen
                new ResultModel(playerData[2]!, 123), // Magga
                new ResultModel(playerData[3]!, 119), // leMalde
            ]
        },
        {
            date: new Date(2023, 9, 1),
            game: games[5]!,
            results: [
                new ResultModel(playerData[0]!, 83), // Espen
                new ResultModel(playerData[1]!, 56), // Roen
                new ResultModel(playerData[2]!, 75), // Magga
                new ResultModel(playerData[3]!, 50), // leMalde
            ]
        },
        {
            date: new Date(2023, 9, 11),
            game: games[1]!,
            results: [
                new ResultModel(playerData[0]!, 5), // Espen
                new ResultModel(playerData[1]!, 6), // Roen
                new ResultModel(playerData[2]!, 7), // Magga
                new ResultModel(playerData[3]!, 10), // leMalde
            ]
        },
        {
            date: new Date(2023, 9, 11),
            game: games[2]!,
            results: [
                new ResultModel(playerData[0]!, 152), // Espen
                new ResultModel(playerData[1]!, 131), // Roen
                new ResultModel(playerData[2]!, 127), // Magga
                new ResultModel(playerData[3]!, 108), // leMalde
            ]
        },
        {
            date: new Date(2023, 9, 14),
            game: games[2]!,
            results: [
                new ResultModel(playerData[0]!, 130), // Espen
                new ResultModel(playerData[4]!, 116), // Gaute
                new ResultModel(playerData[2]!, 150), // Magga
                new ResultModel(playerData[3]!, 112), // leMalde
            ]
        },
        {
            date: new Date(2023, 10, 10),
            game: games[1]!,
            results: [
                new ResultModel(playerData[0]!, 10), // Espen
                // new ResultModel(playerData[1]!, 6), // Roen
                new ResultModel(playerData[2]!, 9), // Magga
                new ResultModel(playerData[3]!, 12), // leMalde
            ]
        },
        {
            date: new Date(2023, 10, 10),
            game: games[2]!,
            results: [
                new ResultModel(playerData[0]!, 136), // Espen
                // new ResultModel(playerData[1]!, 6), // Roen
                new ResultModel(playerData[2]!, 167), // Magga
                new ResultModel(playerData[3]!, 170), // leMalde
            ]
        },
        {
            date: new Date(2023, 10, 11),
            game: games[2]!,
            results: [
                new ResultModel(playerData[0]!, 143), // Espen
                // new ResultModel(playerData[1]!, 6), // Roen
                new ResultModel(playerData[2]!, 156), // Magga
                new ResultModel(playerData[3]!, 141), // leMalde
            ]
        },

        {
            date: new Date(2023, 10, 11),
            game: games[1]!,
            results: [
                new ResultModel(playerData[0]!, 14), // Espen
                new ResultModel(playerData[1]!, 10), // Roen
                new ResultModel(playerData[2]!, 8), // Magga
                new ResultModel(playerData[3]!, 9), // leMalde
            ]
        },            
        {
            date: new Date(2023, 10, 11),
            game: games[2]!,
            results: [
                new ResultModel(playerData[0]!, 121), // Espen
                new ResultModel(playerData[1]!, 132), // Roen
                new ResultModel(playerData[2]!, 132, 1), // Magga
                new ResultModel(playerData[3]!, 136), // leMalde
            ]
        },
        {
            date: new Date(2023, 10, 11),
            game: games[6]!,
            results: [
                new ResultModel(playerData[0]!, 62), // Espen
                new ResultModel(playerData[1]!, 30), // Roen
                new ResultModel(playerData[2]!, 37), // Magga
                new ResultModel(playerData[3]!, 57), // leMalde
            ]
        },
        {
            date: new Date(2023, 10, 12),
            game: games[6]!,
            results: [
                new ResultModel(playerData[0]!, 39), // Espen
                new ResultModel(playerData[1]!, 59), // Roen
                new ResultModel(playerData[2]!, 33), // Magga
                new ResultModel(playerData[3]!, 57), // leMalde
            ]
        },
        {
            date: new Date(2023, 11, 5),
            game: games[7]!,
            results: [
                new ResultModel(playerData[0]!, 62), // Espen
                new ResultModel(playerData[1]!, 48), // Roen
                new ResultModel(playerData[2]!, 53), // Magga
                new ResultModel(playerData[3]!, 59), // leMalde
            ]
        },
        {
            date: new Date(2023, 11, 5),
            game: games[8]!,
            results: [
                new ResultModel(playerData[0]!, 16), // Espen
                new ResultModel(playerData[1]!, 17), // Roen
                new ResultModel(playerData[2]!, 23), // Magga
                new ResultModel(playerData[3]!, 25), // leMalde
            ]
        },
        {
            date: new Date(2023, 11, 5),
            game: games[8]!,
            results: [
                new ResultModel(playerData[0]!, 16), // Espen
                new ResultModel(playerData[1]!, 6), // Roen
                new ResultModel(playerData[2]!, 24), // Magga
                new ResultModel(playerData[3]!, 22), // leMalde
            ]
        },
        {
            date: new Date(2023, 11, 8),
            game: games[8]!,
            results: [
                new ResultModel(playerData[0]!, 30), // Espen
                // new ResultModel(playerData[1]!, 6), // Roen
                new ResultModel(playerData[2]!, 37), // Magga
                new ResultModel(playerData[3]!, 56), // leMalde
            ]
        },
        {
            date: new Date(2023, 11, 8),
            game: games[7]!,
            results: [
                new ResultModel(playerData[0]!, 65), // Espen
                // new ResultModel(playerData[1]!, 6), // Roen
                new ResultModel(playerData[2]!, 62), // Magga
                new ResultModel(playerData[3]!, 94), // leMalde
            ]
        },
        {
            date: new Date(2023, 11, 14),
            game: games[7]!,
            results: [
                new ResultModel(playerData[0]!, 75), // Espen
                new ResultModel(playerData[1]!, 80), // Roen
                new ResultModel(playerData[2]!, 87), // Magga
                new ResultModel(playerData[3]!, 88), // leMalde
            ]
        },
        {
            date: new Date(2023, 11, 20),
            game: games[7]!,
            results: [
                new ResultModel(playerData[0]!, 62), // Espen
                new ResultModel(playerData[1]!, 48), // Roen
                new ResultModel(playerData[2]!, 79), // Magga
                new ResultModel(playerData[3]!, 84), // leMalde
            ]
        },
        {
            date: new Date(2023, 11, 21),
            game: games[9]!,
            results: [
                new ResultModel(playerData[5]!, 2), // Katrine
                new ResultModel(playerData[3]!, 1), // leMalde
            ]
        },
        {
            date: new Date(2023, 11, 23),
            game: games[9]!,
            results: [
                new ResultModel(playerData[6]!, 24), // Simen
                new ResultModel(playerData[7]!, 10), // Nora
                new ResultModel(playerData[8]!, 4), // Jostein
                new ResultModel(playerData[9]!, 18), // Elisa
                new ResultModel(playerData[10]!, 8), // Steini
                new ResultModel(playerData[11]!, 17), // Marita
                new ResultModel(playerData[12]!, 3), // Marius
                new ResultModel(playerData[13]!, 52), // Maren
            ]
        },
        {
            date: new Date(2023, 11, 23),
            game: games[10]!,
            results: [
                new ResultModel(playerData[3]!, 40), // leMalde
                new ResultModel(playerData[8]!, 43, 1), // Jostein
                new ResultModel(playerData[10]!, 35), // Steini
                new ResultModel(playerData[11]!, 43), // Marita
            ]
        },
        {
            date: new Date(2023, 11, 27),
            game: games[9]!,
            results: [
                new ResultModel(playerData[3]!, 51), // leMalde
                new ResultModel(playerData[14]!, 19), // Nobody
                new ResultModel(playerData[15]!, 22), // Rohan
                new ResultModel(playerData[16]!, 52), // Trippo
            ]
        },
        {
            date: new Date(2023, 11, 29),
            game: games[11]!,
            results: [
                new ResultModel(playerData[0]!, 72), // Espen
                new ResultModel(playerData[1]!, 73), // Roen
                new ResultModel(playerData[17]!, 86), // Atle
                new ResultModel(playerData[3]!, 74), // leMalde
            ]
        },
        {
            date: new Date(2023, 11, 29),
            game: games[7]!,
            results: [
                new ResultModel(playerData[0]!, 81), // Espen
                new ResultModel(playerData[1]!, 59), // Roen
                new ResultModel(playerData[17]!, 63), // Atle
                new ResultModel(playerData[3]!, 59, 1), // leMalde
            ]
        },
        {
            date: new Date(2024, 0, 4),
            game: games[7]!,
            results: [
                new ResultModel(playerData[0]!, 78), // Espen
                new ResultModel(playerData[1]!, 79), // Roen
                new ResultModel(playerData[2]!, 71), // Magga
                new ResultModel(playerData[3]!, 75), // leMalde
            ]
        },
        {
            date: new Date(2024, 0, 4),
            game: games[8]!,
            results: [
                new ResultModel(playerData[0]!, 13), // Espen
                new ResultModel(playerData[1]!, 27), // Roen
                new ResultModel(playerData[2]!, 20), // Magga
                new ResultModel(playerData[3]!, 22), // leMalde
            ]
        },
        {
            date: new Date(2024, 0, 14),
            game: games[12]!,
            results: [
                new ResultModel(playerData[0]!, 11), // Espen
                new ResultModel(playerData[1]!, 10), // Roen
                new ResultModel(playerData[2]!, 8), // Magga
                new ResultModel(playerData[18]!, 8, 1), // Tonstad
            ]
        },
        {
            date: new Date(2024, 1, 11),
            game: games[12]!,
            results: [
                new ResultModel(playerData[0]!, 12), // Espen
                new ResultModel(playerData[1]!, 10), // Roen
                new ResultModel(playerData[2]!, 11), // Magga
                new ResultModel(playerData[3]!, 9), // leMalde
            ]
        },
        {
            date: new Date(2024, 1, 11),
            game: games[6]!,
            results: [
                new ResultModel(playerData[0]!, 52), // Espen
                new ResultModel(playerData[1]!, 47), // Roen
                new ResultModel(playerData[2]!, 23), // Magga
                new ResultModel(playerData[3]!, 41), // leMalde
            ]
        },
        {
            date: new Date(2024, 1, 22),
            game: games[8]!,
            results: [
                new ResultModel(playerData[0]!, 33), // Espen
                new ResultModel(playerData[2]!, 30), // Magga
                new ResultModel(playerData[3]!, 44), // leMalde
            ]
        },
        {
            date: new Date(2024, 1, 22),
            game: games[7]!,
            results: [
                new ResultModel(playerData[0]!, 84), // Espen
                new ResultModel(playerData[1]!, 72), // Roen
                new ResultModel(playerData[2]!, 81), // Magga
                new ResultModel(playerData[3]!, 59), // leMalde
            ]
        },
        {
            date: new Date(2024, 1, 27),
            game: games[8]!,
            results: [
                new ResultModel(playerData[0]!, 40), // Espen
                new ResultModel(playerData[2]!, 26), // Magga
                new ResultModel(playerData[3]!, 49), // leMalde
            ]
        },
        {
            date: new Date(2024, 1, 27),
            game: games[7]!,
            results: [
                new ResultModel(playerData[0]!, 86), // Espen
                new ResultModel(playerData[4]!, 50), // Gaute
                new ResultModel(playerData[2]!, 64), // Magga
                new ResultModel(playerData[3]!, 73), // leMalde
            ]
        },
        {
            date: new Date(2024, 2, 3),
            game: games[7]!,
            results: [
                new ResultModel(playerData[0]!, 76), // Espen
                new ResultModel(playerData[1]!, 69), // Roen
                new ResultModel(playerData[2]!, 81), // Magga
                new ResultModel(playerData[3]!, 66), // leMalde
            ]
        },
        {
            date: new Date(2024, 2, 9),
            game: games[7]!,
            results: [
                new ResultModel(playerData[0]!, 80), // Espen
                new ResultModel(playerData[1]!, 67), // Roen
                new ResultModel(playerData[2]!, 75), // Magga
            ]
        },
        {
            date: new Date(2024, 2, 9),
            game: games[7]!,
            results: [
                new ResultModel(playerData[0]!, 91), // Espen
                new ResultModel(playerData[1]!, 113), // Roen
                new ResultModel(playerData[2]!, 85), // Magga
            ]
        },
        {
            date: new Date(2024, 2, 13),
            game: games[7]!,
            results: [
                new ResultModel(playerData[0]!, 100), // Espen
                new ResultModel(playerData[1]!, 102), // Roen
                new ResultModel(playerData[2]!, 94), // Magga
                new ResultModel(playerData[4]!, 86), // Gaute
            ]
        },
        {
            date: new Date(2024, 2, 23),
            game: games[7]!,
            results: [
                new ResultModel(playerData[0]!, 86), // Espen
                new ResultModel(playerData[1]!, 65), // Roen
                new ResultModel(playerData[2]!, 92), // Magga
                new ResultModel(playerData[4]!, 73), // Gaute
            ]
        },
        {
            date: new Date(2024, 2, 26),
            game: games[7]!,
            results: [
                new ResultModel(playerData[0]!, 65), // Espen
                new ResultModel(playerData[1]!, 64), // Roen
                new ResultModel(playerData[2]!, 66), // Magga
                new ResultModel(playerData[3]!, 57), // leMalde
            ]
        },
        {
            date: new Date(2024, 2, 26),
            game: games[13]!,
            results: [
                new ResultModel(playerData[0]!, 4), // Espen
                new ResultModel(playerData[1]!, 6), // Roen
                new ResultModel(playerData[2]!, 9), // Magga
                new ResultModel(playerData[3]!, 3), // leMalde
            ]
        },
        {
            date: new Date(2024, 2, 31),
            game: games[7]!,
            results: [
                new ResultModel(playerData[0]!, 66), // Espen
                new ResultModel(playerData[1]!, 49), // Roen
                new ResultModel(playerData[2]!, 61), // Magga
                new ResultModel(playerData[3]!, 54), // leMalde
            ]
        },        
        {
            date: new Date(2024, 3, 5),
            game: games[0]!,
            results: [
                new ResultModel(playerData[0]!, 52), // Espen
                new ResultModel(playerData[19]!, 37), // Henrik
                new ResultModel(playerData[2]!, 35), // Magga
                new ResultModel(playerData[3]!, 45), // leMalde
            ]
        },        
        {
            date: new Date(2024, 3, 5),
            game: games[8]!,
            results: [
                new ResultModel(playerData[0]!, 20), // Espen
                new ResultModel(playerData[19]!, 24), // Henrik
                new ResultModel(playerData[2]!, 23), // Magga
                new ResultModel(playerData[3]!, 24), // leMalde
            ]
        }, 
        {
            date: new Date(2024, 3, 5),
            game: games[8]!,
            results: [
                new ResultModel(playerData[0]!, 28), // Espen
                new ResultModel(playerData[19]!, 8), // Henrik
                new ResultModel(playerData[2]!, 36), // Magga
                new ResultModel(playerData[3]!, 30), // leMalde
            ]
        }, 
        {
            date: new Date(2024, 3, 5),
            game: games[11]!,
            results: [
                new ResultModel(playerData[0]!, 69), // Espen
                new ResultModel(playerData[19]!, 79), // Henrik
                new ResultModel(playerData[2]!, 90), // Magga
                new ResultModel(playerData[3]!, 91), // leMalde
            ]
        },
        {
            date: new Date(2024, 3, 13),
            game: games[2]!,
            results: [
                new ResultModel(playerData[0]!, 116), // Espen
                new ResultModel(playerData[1]!, 97), // Roen
                new ResultModel(playerData[2]!, 161), // Magga
                new ResultModel(playerData[3]!, 136), // leMalde
            ]
        },
        {
            date: new Date(2024, 3, 13),
            game: games[11]!,
            results: [
                new ResultModel(playerData[0]!, 83), // Espen
                new ResultModel(playerData[1]!, 76), // Roen
                new ResultModel(playerData[2]!, 73), // Magga
                new ResultModel(playerData[3]!, 72), // leMalde
            ]
        },
        {
            date: new Date(2024, 3, 18),
            game: games[14]!,
            results: [
                new ResultModel(playerData[20]!, 8), // Sven
                new ResultModel(playerData[22]!, 10), // Sandnes
                new ResultModel(playerData[21]!, 9), // King
                new ResultModel(playerData[4]!, 11), // Gaute
                new ResultModel(playerData[3]!, 12), // leMalde
            ]
        },
        {
            date: new Date(2024, 3, 18),
            game: games[14]!,
            results: [
                new ResultModel(playerData[20]!, 7), // Sven
                new ResultModel(playerData[22]!, 5), // Sandnes
                new ResultModel(playerData[21]!, 12), // King
                new ResultModel(playerData[4]!, 11), // Gaute
                new ResultModel(playerData[3]!, 10), // leMalde
                new ResultModel(playerData[26]!, 4), // Viken
                new ResultModel(playerData[25]!, 6), // Stian
                new ResultModel(playerData[24]!, 8), // Håvard
                new ResultModel(playerData[23]!, 9), // Filip
            ]
        },
        {
            date: new Date(2024, 3, 18),
            game: games[15]!,
            results: [
                new ResultModel(playerData[20]!, 100), // Sven
                new ResultModel(playerData[21]!, 42), // King
                new ResultModel(playerData[27]!, 50), // Ulland
                new ResultModel(playerData[24]!, 59), // Håvard
            ]
        },
        {
            date: new Date(2024, 3, 18),
            game: games[16]!,
            results: [
                new ResultModel(playerData[20]!, 95), // Sven
                new ResultModel(playerData[21]!, 82), // King
            ]
        },

    ];*/

    playerData.forEach(ResetPlayerValues);
    // gameData.length = 0; DO I NEED THIS: gameRecords.length = 0
    gameRecords.forEach(raw => {
        SetRanksAndPlayerStats(raw);
        raw.game.gamesCount++;
        // gameData.push(raw);
    });
}

export function Recalculate(gameData:GameRecord[], playerData:PlayerModel[]){
    playerData.forEach(ResetPlayerValues);
    gameData.forEach(CalculateChanges);
}