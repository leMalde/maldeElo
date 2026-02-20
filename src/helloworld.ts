import { css, html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { PlayerModel, PostProcess } from './models/PlayerModel';
import { GameModel } from './models/GameModel';
import { GameRecord, ResultModel } from './models/GameRecord';
import { InitializeGameData, Recalculate } from './data/masterdata';
// import { translationFiles } from '@eye-share/web-components/translations';
// import { translationLoader } from '@eye-share/web-components/utilities';
import type { AllPlayersPageComponent } from './allplayers';
import { repeat } from 'lit/directives/repeat.js';

// translationLoader(translationFiles);

@customElement( 'malde-helloworld' )
export class HelloWorldComponent extends LitElement {
	@query('lem-allplayers') protected playerDataEl:AllPlayersPageComponent


	@property()
	protected username:string = '';

	@property({type: Array})
	protected games:GameModel[] = [
		/*new GameModel("Beyond the sun", true), // 0 
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
		new GameModel("Exploding kittens"), // 14
		new GameModel("Hi-Lo"), // 15
		new GameModel("6nimmt!"), // 16*/
	];

	protected playerData:PlayerModel[] = [
        /*new PlayerModel("Espen"), // 0 
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
		new PlayerModel("Sven"), // 20
		new PlayerModel("King"), // 21
		new PlayerModel("Sandnes"), // 22
		new PlayerModel("Filip"), // 23
		new PlayerModel("Håvard"), // 24
		new PlayerModel("Stian"), // 25
		new PlayerModel("Viken"), // 26
		new PlayerModel("Ulland"), // 27*/
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

	private async fetchUsers(): Promise<PlayerModel[]> {	  
		const res = await fetch('/elosystem/users.php', {
			// learn more about this API here: https://graphql-pokemon2.vercel.app/
			method: 'GET',
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
			// body: JSON.stringify({}),
		});
		const res_1 = await res.json();
		return res_1.map((user: PlayerModel) => new PlayerModel(user.id, user.username, user.name));
	}

	private async fetchGames(): Promise<GameModel[]> {	  
		const res = await fetch('/elosystem/games.php', {
			method: 'GET',
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
			// body: JSON.stringify({}),
		});
		const res_1 = await res.json();
		return res_1.map((game:any) => new GameModel(game.id, game.name, game.bigGame, game.gameType, game.gameMode, game.scoringType));
	}

	private async fetchRecords(users:PlayerModel[], games:GameModel[]): Promise<GameRecord[]> {	  
		const res = await fetch('/elosystem/records.php', {
			method: 'GET',
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
			// body: JSON.stringify({}),
		});
		const res_1 = await res.json();
		var records:GameRecord[] = [];

		res_1.forEach((line: any) => {
			if (records[line.id] === undefined){
				records[line.id] = {
					date: new Date(line.date),
					game: games.find(g => g.id == line.game)!,
					results: [
						new ResultModel(users.find(p => p.id == line.userId)!, line.score, line.tiebreak)
					]
				}
			}
			else
			{
				records[line.id]!.results.push(new ResultModel(users.find(p => p.id == line.userId)!, line.score, line.tiebreak));
			}
		});

		return records.filter(Boolean); // The stupid foreach above creates undefined elements 
	}

	override async connectedCallback() {
        super.connectedCallback();

		const [users, games] = await Promise.all([
			this.fetchUsers(),
			this.fetchGames(),
		]);

		const gameRecords = await this.fetchRecords(users, games);

        InitializeGameData(gameRecords, users, games); // needs to finish process before rendering children

		/*this.playerData = users;
		this.games = games;
		this.gameRecords =  gameRecords; */
		

		games.forEach(g => {
			const filteredRecords = gameRecords.filter(l => l.game.name === g.name);
			var bestScore = 0;
			var bestScoreNames:string[] = [];
			filteredRecords.forEach(r => {
				g.avgWinningScore += r.results[0]!.score;

				if (r.results[0]!.score > bestScore){
					bestScore = r.results[0]!.score;
					bestScoreNames = [r.results[0]!.player.username];
				}
				else if (r.results[0]!.score === bestScore){
					bestScoreNames.push(r.results[0]!.player.username);
				}

			});

			g.avgWinningScore = Math.round(g.avgWinningScore / filteredRecords.length);

			Recalculate(filteredRecords, users);
			users.forEach(player => {
				// this.filteredPlayerData.push(player);
				player.scorepercent = Math.round(100 * player.scorepercent / player.games) / 100;
				player.winpercent = Math.round(100 * 100 * player.winpercent / player.games) / 100;
			});
			const bestEloPlayer = users.sort((a,b) => b.elo - a.elo || this.gamesCountSort(a,b,g.name))[0];
			g.bestEloPlayer = bestEloPlayer!.elo + " (" + bestEloPlayer!.username + ")";
			const bestRatedPlayer = users.sort((a,b) => b.rating - a.rating || this.gamesCountSort(a,b,g.name))[0];
			g.bestRatingPlayer = bestRatedPlayer!.rating + " (" + bestRatedPlayer!.username + ")";
			g.bestWinningScore = bestScore + " (" + bestScoreNames.join(', ') + ")";
		});

		/*Recalculate(gameRecords, users);

        // this.gameRecords.forEach(CalculateChanges);
        users.forEach(player => {
			this.filteredPlayerData.push(player);
            player.scorepercent = Math.round(100 * player.scorepercent / player.games) / 100;
            player.winpercent = Math.round(100 * 100 * player.winpercent / player.games) / 100;
        });
		this.filteredPlayerData.sort((a,b) => b.rating - a.rating);*/

		this.playerData = users;
		this.games = games;
		this.gameRecords =  gameRecords;
		this.applyFilter();
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

	private applyFilter(){
		const filtered:PlayerModel[] = [];
		Recalculate(this.gameRecords, this.playerData);
		this.playerData.forEach(player => {
			if (player.games > 0){
				PostProcess(player);
				filtered.push(player)
			}
		});
		this.filteredPlayerData = filtered;
		this.filteredPlayerData.sort((a,b) => b.rating - a.rating);
	}

	updateUsername(e:CustomEvent) {
		this.username = e.detail.newname;
	  }

	override render() {
		return html`
		<lem-navheader .username=${this.username} @name-changed="${this.updateUsername}"></lem-navheader>
		<es-tab-group>
			<es-tab slot="nav" panel="leaderboard">Leaderboard</es-tab>
			<es-tab slot="nav" panel="filterbuilder">Filter Builder</es-tab>
			<es-tab slot="nav" panel="history">Game History</es-tab>
			<es-tab slot="nav" panel="recordgame">Record Game</es-tab>
			<es-tab slot="nav" panel="addplayer">Add Player</es-tab>
			<es-tab slot="nav" panel="addgame">Add Game</es-tab>
			<es-tab slot="nav" panel="profiles">Profiles</es-tab>

			<es-tab-panel name="leaderboard">
				<lem-allplayers .playerData=${this.filteredPlayerData} @myClick=${this.applyFilter}></lem-allplayers>
			</es-tab-panel>
			<es-tab-panel name="history">
				<lem-allgames .gameRecords=${this.gameRecords}></lem-allgames>
			</es-tab-panel>
			<es-tab-panel name="recordgame">
				<section>
					<article>
						<lem-recordgame .games=${this.games} .players=${this.playerData}></lem-recordgame>
					</article>
				</section>
			</es-tab-panel>
			<es-tab-panel name="addplayer">
				<section>
					<article>
						<lem-addplayer></lem-addplayer>
					</article>
				</section>
			</es-tab-panel>
			<es-tab-panel name="addgame">
				<section>
					<article>
						<lem-addgame></lem-addgame>
					</article>
				</section>
			</es-tab-panel>
			<es-tab-panel name="filterbuilder">
				<lem-filterbuilder .games=${this.games} @myClick=${this.applyFilter}></lem-filterbuilder>
			</es-tab-panel>
			<es-tab-panel name="profiles">
				<section>
					<article>
						${repeat(
							this.playerData,
							(player) => html`<lem-playercard .playerModel=${player}></lem-playercard>`
						)}
					</article>
				</section>
			</es-tab-panel>
		</es-tab-group>
		`;
	}

	static override styles = css`
		:host {
			display: grid;
			overflow: hidden;
			grid-template-rows: max-content 1fr;
		}
		es-tab-group {
			display: grid;
			overflow: hidden;
		}
		es-tab-group::part(base),
		es-tab-group::part(body) {
			overflow: hidden;
		}
		es-tab-panel::part(base) {
			display: grid;
		}
		es-tab-panel > *  {
			display: contents;
		}
		article {
			overflow-y: auto;
		}

		/*body {
			margin: 0;
			background: #222;
			font-family: 'Work Sans', sans-serif;
			font-weight: 800;
		}*/

		es-legend::part(input-base) {
			background: blanchedalmond;
		}

		.container {
			width: 80%;
			margin: 0 auto;
		}

		header {
			background: #55d6aa;
			// background: var(--esd-surface5);
		}

		header::after {
		content: '';
		display: table;
		clear: both;
		}

		.logo {
		float: left;
		padding: 10px 0;
		}

		nav {
		float: right;
		}

		nav ul {
		margin: 0;
		padding: 0;
		list-style: none;
		}

		nav li {
		display: inline-block;
		margin-left: 70px;
		padding-top: 23px;

		position: relative;
		}

		nav a {
		color: #444;
		text-decoration: none;
		text-transform: uppercase;
		font-size: 14px;
		}

		nav a:hover {
		color: #000;
		}

		nav a::before {
		content: '';
		display: block;
		height: 5px;
		background-color: #444;

		position: absolute;
		top: 0;
		width: 0%;

		transition: all ease-in-out 250ms;
		}

		nav a:hover::before {
		width: 100%;
		}
	`
}
/*
@customElement( 'malde-es-grid' )
export class MaldeGridCmp extends EsGridCmp {

}
*/