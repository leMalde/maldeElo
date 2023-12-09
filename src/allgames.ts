import type { EsGridCmp } from '@eyeshare/web-components/components/310.Grid/grid/grid.cmp.js';
import type { EsGrid } from '@eyeshare/web-components/components/310.Grid/grid/grid.types.js';
import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { GameModel } from './models/GameModel';
import { ResultModel, type GameRecord } from './models/GameRecord';
import { CalculateChanges, SetRanks } from './utilities/eloService';
import { map } from 'lit/directives/map.js';
import type { PlayerModel } from './models/PlayerModel';


/*interface PlayerModel {
    Name: string,
    Score: number,
}*/

@customElement( 'lem-allgames' )
export class AllGamesPageComponent extends LitElement {

    @property({type:Array}) public playerData:PlayerModel[] = [];

    @query('es-grid') protected gameGridEl:EsGridCmp

    protected playerGridConfig:EsGrid.Configuration<PlayerModel> = {
        setup: {
            columns: [ 
                {path:"name", label:"Name", pinned:true, pinnable: true},
                {path:"elo", label:"Elo rating"},
                {path:"games", label:"#"},
            ],
            defaults: {
                editable: false,
                menu: false,
                sortable: true,
                pinnable: false,
            },
            headerActionField: {
                checkbox: false,
                menu: true,
                width: 80,
            },
            rowActionField: {
                checkbox: true,
            }
        },        
        datasource: this.playerData,
    }

    protected gameData:GameRecord[] = [];
    
    protected gameGridConfig:EsGrid.Configuration<GameRecord> = {
        setup: {
            columns: [ 
                {path:"date", label:"Date", pinned:true, pinnable: true},
                {path:"game.name", label:"Game", minWidth: 160},
                {path:"game.gameType", label:"GameType"},
                {path:"game.gameMode", label:"GameMode"},
            ],
            defaults: {
                editable: false,
                menu: false,
                sortable: true,
                pinnable: false,
                minWidth: 140
            },
            headerActionField: {
                checkbox: false,
                menu: true,
                width: 80,
            },
            rowActionField: {
                checkbox: true,
            },
            subGrid: {
                show: (_row, _context) => true,
                template: (row) => {
                    const keys =  ["Rank", "Name", "Score", "%", "Δ elo", "Elo", "Δ rating", "Rating" ];

                    return html`
							<style>
								.header {
								}
								.header, .row {
									display: grid;
									grid-auto-flow: column;
									grid-auto-columns: max-content;
								}
								.body {
									display: grid;
									grid-auto-flow: row;
									grid-auto-rows: max-content;
								}
								.header .field {
									border-bottom: 1px solid var(--esd-surface-variant);
								}
								.field {
									width: 150px;
								}

							</style>
							<div class="header">
								${ map(keys, key => html`
								<div class="field">
									${ key }
								</div>
								`) }
							</div>
							<div class="body">
                                ${ map(row.results, result => html`
                                <div class="row">
									<div class="field">
										${ result.rank }
									</div>
                                    <div class="field">
										${ result.player.name }
									</div>
                                    <div class="field">
										${ result.score }
									</div>
                                    <div class="field">
                                        ${ result.percent }
									</div>
                                    <div class="field">
										${ result.elochange }
									</div>
                                    <div class="field">
                                        ${ result.playerelo }
									</div>
                                    <div class="field">
                                        ${ result.ratingchange }
									</div>
                                    <div class="field">
                                        ${ result.playerrating }
									</div>
                                </div>
                                `) }


								
								
							</div>
							`;
                }

            }
        },        
        datasource: this.gameData,
    }

    override async connectedCallback() {
        super.connectedCallback();

        await this.updateComplete;

        console.log(this.gameGridEl);
        this.initializeGameData();
        this.gameGridConfig.datasource = this.gameData;
        this.gameData.forEach(CalculateChanges);
        this.playerData.forEach(player => {
            player.scorepercent = Math.round(100 * player.scorepercent / player.games) / 100;
            player.winpercent = Math.round(100 * 100 * player.winpercent / player.games) / 100;
        });
        // this.dispatchEvent(new CustomEvent("change"));

        this.gameGridEl.configure(this.gameGridConfig);
    }

    private initializeGameData(){
        this.gameData = [
            {
                date: new Date(2022, 10, 11),
                game: new GameModel("Beyond the sun"),
                results: [
                    new ResultModel(this.playerData[0]!, 51), // Espen
                    new ResultModel(this.playerData[1]!, 51, 1), // Roen
                    // new ResultModel(this.playerData[2]!, 51), // Magga
                    new ResultModel(this.playerData[3]!, 44), // leMalde
                ]
            },
            {
                date: new Date(2022, 10, 12),
                game: new GameModel("Beyond the sun"),
                results: [
                    new ResultModel(this.playerData[0]!, 59), // Espen
                    new ResultModel(this.playerData[1]!, 50), // Roen
                    new ResultModel(this.playerData[2]!, 30), // Magga
                    new ResultModel(this.playerData[3]!, 54), // leMalde
                ]
            },
            {
                date: new Date(2022, 10, 13),
                game: new GameModel("Beyond the sun"),
                results: [
                    new ResultModel(this.playerData[0]!, 48), // Espen
                    new ResultModel(this.playerData[1]!, 27), // Roen
                    // new ResultModel(this.playerData[2]!, 51), // Magga
                    new ResultModel(this.playerData[3]!, 37), // leMalde
                ]
            },
            {
                date: new Date(2022, 10, 14),
                game: new GameModel("Beyond the sun"),
                results: [
                    new ResultModel(this.playerData[0]!, 51), // Espen
                    new ResultModel(this.playerData[1]!, 52), // Roen
                    new ResultModel(this.playerData[2]!, 46), // Magga
                    new ResultModel(this.playerData[3]!, 68), // leMalde
                ]
            },


            {
                date: new Date(2023, 3, 28),
                game: new GameModel("Dune"),
                results: [
                    new ResultModel(this.playerData[0]!, 9), // Espen
                    new ResultModel(this.playerData[1]!, 10), // Roen
                    new ResultModel(this.playerData[2]!, 6), // Magga
                    new ResultModel(this.playerData[3]!, 8), // leMalde
                ]
            },
            {
                date: new Date(2023, 4, 18),
                game: new GameModel("Dune"),
                results: [
                    new ResultModel(this.playerData[0]!, 9), // Espen
                    new ResultModel(this.playerData[1]!, 9), // Roen
                    new ResultModel(this.playerData[2]!, 11), // Magga
                    new ResultModel(this.playerData[3]!, 5), // leMalde
                ]
            },

            {
                date: new Date(2023, 4, 19),
                game: new GameModel("Beyond the sun"),
                results: [
                    new ResultModel(this.playerData[0]!, 59), // Espen
                    new ResultModel(this.playerData[1]!, 46), // Roen
                    new ResultModel(this.playerData[2]!, 44), // Magga
                    new ResultModel(this.playerData[3]!, 32), // leMalde
                ]
            },

            {
                date: new Date(2023, 7, 8),
                game: new GameModel("Brass: Birmingham"),
                results: [
                    new ResultModel(this.playerData[0]!, 129), // Espen
                    new ResultModel(this.playerData[1]!, 136), // Roen
                    new ResultModel(this.playerData[2]!, 134), // Magga
                    new ResultModel(this.playerData[3]!, 119), // leMalde
                ]
            },
            {
                date: new Date(2023, 7, 13),
                game: new GameModel("Brass: Birmingham"),
                results: [
                    new ResultModel(this.playerData[0]!, 114), // Espen
                    new ResultModel(this.playerData[1]!, 141), // Roen
                    new ResultModel(this.playerData[2]!, 140), // Magga
                    new ResultModel(this.playerData[3]!, 142), // leMalde
                ]
            },
            {
                date: new Date(2023, 7, 18),
                game: new GameModel("Brass: Birmingham"),
                results: [
                    new ResultModel(this.playerData[0]!, 101), // Espen
                    new ResultModel(this.playerData[1]!, 128), // Roen
                    new ResultModel(this.playerData[2]!, 109), // Magga
                    new ResultModel(this.playerData[3]!, 138), // leMalde
                ]
            },
            {
                date: new Date(2023, 7, 19),
                game: new GameModel("Puerto Rico"),
                results: [
                    new ResultModel(this.playerData[0]!, 57), // Espen
                    new ResultModel(this.playerData[1]!, 52), // Roen
                    new ResultModel(this.playerData[2]!, 51), // Magga
                    new ResultModel(this.playerData[3]!, 43), // leMalde
                ]
            },
            {
                date: new Date(2023, 7, 19),
                game: new GameModel("Dune"),
                results: [
                    new ResultModel(this.playerData[0]!, 7), // Espen
                    new ResultModel(this.playerData[1]!, 10), // Roen
                    new ResultModel(this.playerData[2]!, 8), // Magga
                    new ResultModel(this.playerData[3]!, 10, 1), // leMalde
                ]
            },
            {
                date: new Date(2023, 7, 19),
                game: new GameModel("Brass: Birmingham"),
                results: [
                    new ResultModel(this.playerData[0]!, 133), // Espen
                    new ResultModel(this.playerData[1]!, 148), // Roen
                    new ResultModel(this.playerData[2]!, 131), // Magga
                    new ResultModel(this.playerData[3]!, 150), // leMalde
                ]
            },
            {
                date: new Date(2023, 7, 20),
                game: new GameModel("FrisbeeGolf", "Sport"),
                results: [
                    new ResultModel(this.playerData[0]!, 56, 1), // Espen
                    new ResultModel(this.playerData[1]!, 44), // Roen
                    new ResultModel(this.playerData[2]!, 56), // Magga
                    new ResultModel(this.playerData[3]!, 50), // leMalde
                ]
            },

            {
                date: new Date(2023, 8, 9),
                game: new GameModel("Everdell"),
                results: [
                    new ResultModel(this.playerData[0]!, 67, 1), // Espen
                    new ResultModel(this.playerData[1]!, 60), // Roen
                    new ResultModel(this.playerData[2]!, 70), // Magga
                    new ResultModel(this.playerData[3]!, 67), // leMalde
                ]
            },
            {
                date: new Date(2023, 9, 1),
                game: new GameModel("Brass: Birmingham"),
                results: [
                    new ResultModel(this.playerData[0]!, 117), // Espen
                    new ResultModel(this.playerData[1]!, 105), // Roen
                    new ResultModel(this.playerData[2]!, 123), // Magga
                    new ResultModel(this.playerData[3]!, 119), // leMalde
                ]
            },
            {
                date: new Date(2023, 9, 1),
                game: new GameModel("Everdell"),
                results: [
                    new ResultModel(this.playerData[0]!, 83), // Espen
                    new ResultModel(this.playerData[1]!, 56), // Roen
                    new ResultModel(this.playerData[2]!, 75), // Magga
                    new ResultModel(this.playerData[3]!, 50), // leMalde
                ]
            },
            {
                date: new Date(2023, 9, 11),
                game: new GameModel("Dune"),
                results: [
                    new ResultModel(this.playerData[0]!, 5), // Espen
                    new ResultModel(this.playerData[1]!, 6), // Roen
                    new ResultModel(this.playerData[2]!, 7), // Magga
                    new ResultModel(this.playerData[3]!, 10), // leMalde
                ]
            },
            {
                date: new Date(2023, 9, 11),
                game: new GameModel("Brass: Birmingham"),
                results: [
                    new ResultModel(this.playerData[0]!, 152), // Espen
                    new ResultModel(this.playerData[1]!, 131), // Roen
                    new ResultModel(this.playerData[2]!, 127), // Magga
                    new ResultModel(this.playerData[3]!, 108), // leMalde
                ]
            },
            {
                date: new Date(2023, 9, 14),
                game: new GameModel("Brass: Birmingham"),
                results: [
                    new ResultModel(this.playerData[0]!, 130), // Espen
                    new ResultModel(this.playerData[4]!, 116), // Gaute
                    new ResultModel(this.playerData[2]!, 150), // Magga
                    new ResultModel(this.playerData[3]!, 112), // leMalde
                ]
            },
            {
                date: new Date(2023, 10, 10),
                game: new GameModel("Dune"),
                results: [
                    new ResultModel(this.playerData[0]!, 10), // Espen
                    // new ResultModel(this.playerData[1]!, 6), // Roen
                    new ResultModel(this.playerData[2]!, 9), // Magga
                    new ResultModel(this.playerData[3]!, 12), // leMalde
                ]
            },
            {
                date: new Date(2023, 10, 10),
                game: new GameModel("Brass: Birmingham"),
                results: [
                    new ResultModel(this.playerData[0]!, 136), // Espen
                    // new ResultModel(this.playerData[1]!, 6), // Roen
                    new ResultModel(this.playerData[2]!, 167), // Magga
                    new ResultModel(this.playerData[3]!, 170), // leMalde
                ]
            },
            {
                date: new Date(2023, 10, 11),
                game: new GameModel("Brass: Birmingham"),
                results: [
                    new ResultModel(this.playerData[0]!, 143), // Espen
                    // new ResultModel(this.playerData[1]!, 6), // Roen
                    new ResultModel(this.playerData[2]!, 156), // Magga
                    new ResultModel(this.playerData[3]!, 141), // leMalde
                ]
            },

            {
                date: new Date(2023, 10, 11),
                game: new GameModel("Dune"),
                results: [
                    new ResultModel(this.playerData[0]!, 14), // Espen
                    new ResultModel(this.playerData[1]!, 10), // Roen
                    new ResultModel(this.playerData[2]!, 8), // Magga
                    new ResultModel(this.playerData[3]!, 9), // leMalde
                ]
            },            
            {
                date: new Date(2023, 10, 11),
                game: new GameModel("Brass: Birmingham"),
                results: [
                    new ResultModel(this.playerData[0]!, 121), // Espen
                    new ResultModel(this.playerData[1]!, 132), // Roen
                    new ResultModel(this.playerData[2]!, 132, 1), // Magga
                    new ResultModel(this.playerData[3]!, 136), // leMalde
                ]
            },
            {
                date: new Date(2023, 10, 11),
                game: new GameModel("It's a wonderful world"),
                results: [
                    new ResultModel(this.playerData[0]!, 62), // Espen
                    new ResultModel(this.playerData[1]!, 30), // Roen
                    new ResultModel(this.playerData[2]!, 37), // Magga
                    new ResultModel(this.playerData[3]!, 57), // leMalde
                ]
            },
            {
                date: new Date(2023, 10, 12),
                game: new GameModel("It's a wonderful world"),
                results: [
                    new ResultModel(this.playerData[0]!, 39), // Espen
                    new ResultModel(this.playerData[1]!, 59), // Roen
                    new ResultModel(this.playerData[2]!, 33), // Magga
                    new ResultModel(this.playerData[3]!, 57), // leMalde
                ]
            },
            {
                date: new Date(2023, 11, 5),
                game: new GameModel("Terraforming Mars"),
                results: [
                    new ResultModel(this.playerData[0]!, 62), // Espen
                    new ResultModel(this.playerData[1]!, 48), // Roen
                    new ResultModel(this.playerData[2]!, 53), // Magga
                    new ResultModel(this.playerData[3]!, 59), // leMalde
                ]
            },
            {
                date: new Date(2023, 11, 5),
                game: new GameModel("Dominion"),
                results: [
                    new ResultModel(this.playerData[0]!, 16), // Espen
                    new ResultModel(this.playerData[1]!, 17), // Roen
                    new ResultModel(this.playerData[2]!, 23), // Magga
                    new ResultModel(this.playerData[3]!, 25), // leMalde
                ]
            },
            {
                date: new Date(2023, 11, 5),
                game: new GameModel("Dominion"),
                results: [
                    new ResultModel(this.playerData[0]!, 16), // Espen
                    new ResultModel(this.playerData[1]!, 6), // Roen
                    new ResultModel(this.playerData[2]!, 24), // Magga
                    new ResultModel(this.playerData[3]!, 22), // leMalde
                ]
            },
            {
                date: new Date(2023, 11, 8),
                game: new GameModel("Dominion"),
                results: [
                    new ResultModel(this.playerData[0]!, 30), // Espen
                    // new ResultModel(this.playerData[1]!, 6), // Roen
                    new ResultModel(this.playerData[2]!, 37), // Magga
                    new ResultModel(this.playerData[3]!, 56), // leMalde
                ]
            },
            {
                date: new Date(2023, 11, 8),
                game: new GameModel("Terraforming Mars"),
                results: [
                    new ResultModel(this.playerData[0]!, 65), // Espen
                    // new ResultModel(this.playerData[1]!, 6), // Roen
                    new ResultModel(this.playerData[2]!, 62), // Magga
                    new ResultModel(this.playerData[3]!, 94), // leMalde
                ]
            },

        ]

        this.gameData.forEach(SetRanks);
    }

	override render() {
		return html`
        <es-button type="tonal">UKULT</es-button>
		<es-grid></es-grid>
        <!--
        <es-card class="card-overview">
            <img
                slot="image"
                src=${ 'https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80' }
                alt="A kitten sits patiently between a terracotta pot and decorative grasses."
            />

            <strong>Mittens</strong>
            <br />
            This kitten is as cute as he is playful. Bring him home today!
            <br />
            <small>6 weeks old</small>

            <div slot="footer">
                <es-button variant="primary">More Info</es-button>
                <es-rating></es-rating>
                <es-rating label="Rating" class="rating-hearts" style="--symbol-color-active: #ff4136;" .getSymbol=${()=>'<es-icon name="heart-fill"></es-icon>'}></es-rating>
            </div>
        </es-card>
        -->
		`;
	}
}