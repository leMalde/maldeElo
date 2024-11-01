import type { EsGridCmp } from '@eye-share/web-components/components/310.Grid/grid/grid.cmp.js';
import type { EsGrid } from '@eye-share/web-components/components/310.Grid/grid/grid.types.js';
import { css, html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ResultModel, type GameRecord } from './models/GameRecord';
import { map } from 'lit/directives/map.js';
import { configureFields } from '@eye-share/web-components/concepts';
// import { MongoClient, ServerApiVersion } from 'mongodb'
// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://lemalde:ZlXwNcxQUBJGJfAw@lemalde.fbr6b6x.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri);

/*const clientOld = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});*/

const configure = configureFields<GameRecord>();

@customElement( 'lem-allgames' )
export class AllGamesPageComponent extends LitElement {

    @property({type:Array}) public gameRecords:GameRecord[] = [];

    @query('es-grid') protected gameGridEl:EsGridCmp
    
    protected gameGridConfig:EsGrid.Configuration<GameRecord> = {
        setup: {
            columns: [
                configure.date("date", {label:"Dato"}), 
                // {path:"date", label:"Date", pinned:false, pinnable: true},
                {path:"game.name", label:"Game", minWidth: 160},
                {path:"winner.username", label:"Winner", minWidth: 140},
                {path:"game.gameType", label:"GameType"},
                {path:"game.gameMode", label:"GameMode"},
            ],
            defaults: {
                editable: false,
                menu: false,
                sortable: true,
                pinnable: false,
                minWidth: 140,
                moveable: true
            },
            headerActionField: {
                checkbox: false,
                menu: false,
                width: 80,
            },
            rowActionField: {
                checkbox: false
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
										${ result.player.username }
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
        datasource: this.gameRecords,
    }

    override async connectedCallback() {
        super.connectedCallback();

        await this.updateComplete;

        this.gameGridConfig.datasource = this.gameRecords;
        // this.gameRecords.forEach(CalculateChanges);

        this.gameGridEl.configure(this.gameGridConfig);
    }

    protected override willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        this.gameGridConfig.datasource = this.gameRecords;
        this.gameGridEl?.configure(this.gameGridConfig);
        // this.playerGridEl?.api.forceRender();
    }

    /*protected saveGameRecords = () => {
        try {
            // Connect the client to the server	(optional starting in v4.7)
            client.connect();
            // Send a ping to confirm a successful connection
            client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
          } finally {
            // Ensures that the client will close when you finish/error
            client.close();
          }
    }*/

	override render() {
		return html`
        <!--<es-button @click=${ this.saveGameRecords } type="tonal">Save data</es-button>-->
		<es-grid></es-grid>
		`;
	}

    static override styles = css`
		:host {
			display: contents;
		}
	`
}