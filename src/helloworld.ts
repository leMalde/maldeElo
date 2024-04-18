import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { PlayerModel, PostProcess } from './models/PlayerModel';
import { GameModel } from './models/GameModel';
import type { GameRecord } from './models/GameRecord';
import { InitializeGameData, Recalculate } from './data/masterdata';
import { CalculateChanges } from './utilities/eloService';
import type { AllPlayersPageComponent } from './allplayers';
import { repeat } from 'lit/directives/repeat.js';

@customElement( 'malde-helloworld' )
export class HelloWorldComponent extends LitElement {

	@query('lem-allplayers') protected playerDataEl:AllPlayersPageComponent

	@property({type: Array})
	protected games:GameModel[] = [
		new GameModel("Beyond the sun", true), // 0 
        new GameModel("Dune (2020)", true), // 1
        new GameModel("Brass: Birmingham", true), // 2
        new GameModel("Puerto Rico", true), // 3
        new GameModel("FrisbeeGolf", false, "Sport"), // 4
		new GameModel("Everdell", true), // 5
		new GameModel("It's a wonderful world"), // 6
		new GameModel("Terraforming Mars", true), // 7
		new GameModel("Dominion"), // 8
		new GameModel("Diamant"), // 9
		new GameModel("Railroad Ink"), // 10
		new GameModel("Furnace"), // 11
		new GameModel("Dune Uprising (2023)", true), // 12
		new GameModel("Heat: Pedal to the metal"), // 13
	];

	protected playerData:PlayerModel[] = [
        new PlayerModel("Espen"), // 0 
        new PlayerModel("Roen"), // 1
        new PlayerModel("Magga"), // 2
        new PlayerModel("leMalde"), // 3
        new PlayerModel("Gaute"), // 4
		new PlayerModel("Katrine"), // 5
		new PlayerModel("Simen"), // 6
		new PlayerModel("Nora"), // 7
		new PlayerModel("Jostein"), // 8
		new PlayerModel("Elisa"), // 9
		new PlayerModel("Steini"), // 10
		new PlayerModel("Marita"), // 11
		new PlayerModel("Marius"), // 12
		new PlayerModel("Maren"), // 13
		new PlayerModel("Nobody"), // 14
		new PlayerModel("Rohan"), // 15
		new PlayerModel("Trippo"), // 16
		new PlayerModel("Atle"), // 17
		new PlayerModel("Tonstad"), // 18
		new PlayerModel("Henrik"), // 19
	];

	@property({type: Array})
	protected filteredPlayerData:PlayerModel[] = [];

	protected gameRecords:GameRecord[] = []

	protected playerData2:{[name: string] : PlayerModel} = {
		"Espen": new PlayerModel("Espen"),
		"Roen": new PlayerModel("Roen"),
		"Magga": new PlayerModel("Magga"),
		"leMalde": new PlayerModel("leMalde"),
		"Gaute": new PlayerModel("Gaute"),
		"Katrine": new PlayerModel("Katrine"),
		"Simen": new PlayerModel("Simen"),
		"Nora": new PlayerModel("Nora"),
		"Jostein": new PlayerModel("Jostein"),
		"Elisa": new PlayerModel("Elisa"),
		"Steini": new PlayerModel("Steini"),
		"Marita": new PlayerModel("Marita"),
		"Marius": new PlayerModel("Marius"),
		"Maren": new PlayerModel("Maren"),
		"Nobody": new PlayerModel("Nobody"),
		"Rohan": new PlayerModel("Rohan"),
		"Trippo": new PlayerModel("Trippo"),
		"Atle": new PlayerModel("Atle"),
	};

	override async connectedCallback() {
        super.connectedCallback();
		
        InitializeGameData(this.gameRecords, this.playerData, this.games);

		this.games.forEach(g => {
			const filteredRecords = this.gameRecords.filter(l => l.game.name === g.name);
			var bestScore = 0;
			var bestScoreNames:string[] = [];
			filteredRecords.forEach(r => {
				g.avgWinningScore += r.results[0]!.score;

				if (r.results[0]!.score > bestScore){
					bestScore = r.results[0]!.score;
					bestScoreNames = [r.results[0]!.player.name];
				}
				else if (r.results[0]!.score === bestScore){
					bestScoreNames.push(r.results[0]!.player.name);
				}

			});

			g.avgWinningScore = Math.round(g.avgWinningScore / filteredRecords.length);

			Recalculate(filteredRecords, this.playerData);
			this.playerData.forEach(player => {
				// this.filteredPlayerData.push(player);
				player.scorepercent = Math.round(100 * player.scorepercent / player.games) / 100;
				player.winpercent = Math.round(100 * 100 * player.winpercent / player.games) / 100;
			});
			const bestEloPlayer = this.playerData.sort((a,b) => b.elo - a.elo || this.gamesCountSort(a,b,g.name))[0];
			g.bestEloPlayer = bestEloPlayer!.name + " (" + bestEloPlayer!.elo + ")";
			const bestRatedPlayer = this.playerData.sort((a,b) => b.rating - a.rating || this.gamesCountSort(a,b,g.name))[0];
			g.bestRatingPlayer = bestRatedPlayer!.name + " (" + bestRatedPlayer!.rating + ")";
			g.bestWinningScore = bestScore + " (" + bestScoreNames.join(', ') + ")";
		})

		Recalculate(this.gameRecords, this.playerData);
        // this.gameRecords.forEach(CalculateChanges);
        this.playerData.forEach(player => {
			this.filteredPlayerData.push(player);
            player.scorepercent = Math.round(100 * player.scorepercent / player.games) / 100;
            player.winpercent = Math.round(100 * 100 * player.winpercent / player.games) / 100;
        });
		this.filteredPlayerData.sort((a,b) => b.rating - a.rating);
    }

	private gamesCountSort(a:PlayerModel, b:PlayerModel, game:string){
		if (a.gamescount[game] === undefined && b.gamescount[game] === undefined)
			return 0;

		if (a.gamescount[game] === undefined)
			return -1;

		if (b.gamescount[game] === undefined)
			return 1;

		if (a.gamescount[game]! < b.gamescount[game]!)
			return -1;

		if (a.gamescount[game]! > b.gamescount[game]!)
			return 1;

		if (a.scorepercent < b.scorepercent)
			return 1;

		if (a.scorepercent > b.scorepercent)
			return -1;

		return 0;
	}

	override render() {
		return html`
		<es-tab-group>
			<es-tab slot="nav" panel="leaderboard">Leaderboard</es-tab>
			<es-tab slot="nav" panel="history">Game History</es-tab>
			<es-tab disabled slot="nav" panel="addgame">Add Game</es-tab>
			<es-tab slot="nav" panel="filterbuilder">Filter Builder</es-tab>
			<es-tab slot="nav" panel="profiles">Profiles</es-tab>


			<es-tab-panel name="leaderboard">
				<lem-allplayers .playerData=${this.filteredPlayerData} @myClick=${this.applyFilter}></lem-allplayers>
			</es-tab-panel>
			<es-tab-panel name="history">
				<lem-allgames .gameRecords=${this.gameRecords}></lem-allgames>
			</es-tab-panel>
			<es-tab-panel name="addgame">
				<lem-allplayers .playerData=${this.playerData}></lem-allplayers>
			</es-tab-panel>
			<es-tab-panel name="filterbuilder">
				<lem-filterbuilder .games=${this.games} @myClick=${this.applyFilter}></lem-filterbuilder>
			</es-tab-panel>
			<es-tab-panel name="profiles">				
				${repeat(
					this.playerData,
					(player) => html`<lem-playercard .playerModel=${player}></lem-playercard>`
				)}
			</es-tab-panel>
		</es-tab-group>
		`;
	}

	/*private refreshGames(){
		const newGames:GameModel[] = [];
		this.games.forEach(g => {
			newGames.push(g);
		});
		this.games = newGames;
	}*/

	private applyFilter(){
		const filtered:PlayerModel[] = [];
		Recalculate(this.gameRecords, this.playerData);
		this.playerData.forEach(player => {
			if (player.games > 0){
				PostProcess(player);
				console.log("Add " + player.name);
				filtered.push(player)
			}
		});
		this.filteredPlayerData = filtered;
		this.filteredPlayerData.sort((a,b) => b.rating - a.rating);
	}
}
/*
@customElement( 'malde-es-grid' )
export class MaldeGridCmp extends EsGridCmp {

}
*/