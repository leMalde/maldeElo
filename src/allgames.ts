import type { EsGridCmp, EsGrid } from '@eye-share/web-components/components';
import { GridDatasource } from '@eye-share/web-components/components';
import { css, html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ResultModel, type GameRecord } from './models/GameRecord';
import { map } from 'lit/directives/map.js';
import { configureFields, fieldToColumn } from '@eye-share/web-components/concepts';

const configure = configureFields<GameRecord>();

@customElement( 'lem-allgames' )
export class AllGamesPageComponent extends LitElement {

    @property({type:Array}) public gameRecords:GameRecord[] = [];

    @query('es-grid') protected gameGridEl:EsGridCmp
    
    protected gameGridConfig:EsGrid.Configuration<GameRecord> = {
        rowContext: () => ({}),
        setup: {
            columns: [
                configure.date(m => m.date)({label:"Date"}), 
                configure.text(m => m.game.name)({label:"Game"}, {minWidth: 160}),
                configure.text(m => m.winner?.username)({label:"Winner"}, {minWidth: 140}),
                configure.text(m => m.game.gameType)({label:"GameType"}),
                configure.text(m => m.game.gameMode)({label:"GameMode"}),
            ].map(cfg => fieldToColumn(cfg)),
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
        datasource: new GridDatasource<GameRecord>(this.gameRecords),
    }

    override async connectedCallback() {
        super.connectedCallback();

        await this.updateComplete;

        this.gameGridConfig.datasource = new GridDatasource<GameRecord>(this.gameRecords);
        // this.gameRecords.forEach(CalculateChanges);

        this.gameGridEl.configure(this.gameGridConfig);
    }

    protected override willUpdate(_changedProperties: Map<PropertyKey, unknown>): void {
        this.gameGridConfig.datasource = new GridDatasource<GameRecord>(this.gameRecords);
        this.gameGridEl?.configure(this.gameGridConfig);
        // this.playerGridEl?.api.forceRender();
    }

	override render() {
		return html`
		<es-grid></es-grid>
		`;
	}

    static override styles = css`
		:host {
			display: contents;
		}
	`
}