import type { EsGridCmp, EsGrid } from '@eye-share/web-components/components';
import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { GameModel } from "./models/GameModel";
import { GridDatasource } from '@eye-share/web-components/components';
import { configureFields, fieldToColumn } from '@eye-share/web-components/concepts';

type Context = {testing: boolean, defSupplier: string};
const configure = configureFields<GameModel, Context>();
@customElement( 'lem-filterbuilder' )
export class FilterBuilderPageComponent extends LitElement {

    @property({type:Array}) public games:GameModel[] = [];

    @query('es-grid') protected gamesGridEl:EsGridCmp;

    protected gamesGridConfig:EsGrid.Configuration<GameModel, Context> = {
        rowContext: () => ({testing: true, defSupplier: "leMalde"}),
        setup: {
            columns: [
                {get: m => m.name, label:"Name", minWidth: 180},
                {get: m => m.gamesCount, label:"#Games"},
                fieldToColumn(configure.switch(m => m.include)({ label: 'Include'})),
                {get: m => m.bestEloPlayer, label: "Best elo", minWidth: 180},
                {get: m => m.bestRatingPlayer, label: "Best rating", minWidth: 180},
                {get: m => m.avgWinningScore, label: "Avg winning score", minWidth: 180},
                {get: m => m.bestWinningScore, label: "Highest score", minWidth: 180}
                // configure.switch('name', { label: 'Enabled', name: "NotLabel" }),
                /*configure.switch('include', { label: 'Enabled', name: "NotLabel" }),
                
                configure2.switch({name: "Include", label: "Label", readonly: false}),
                 {path:"include", label:"Include", minWidth: 80},
                {path:"name", label:"Name"},
                {path:"gameMode", label:"Game mode", minWidth: 100},
                {path:"gameType", label:"Game type"},
                {path:"gamesCount", label:"# played", minWidth: 100},*/
            ],
            defaults: {
                editable: false,
                menu: false,
                sortable: true,
                pinnable: false,
                minWidth: 120
            },
            headerActionField: {
                checkbox: false,
                menu: false,
                width: 180,
            },
            rowActionField: {
                checkbox: false,

            }
        },        
        datasource: new GridDatasource<GameModel>(this.games)
    }

    protected override willUpdate(_changedProperties: Map<PropertyKey, unknown>): void {
        this.gamesGridConfig.datasource = new GridDatasource<GameModel>(this.games);
        this.gamesGridEl?.configure(this.gamesGridConfig);
        // this.gamesGridEl?.api.forceRender();
    }

    override async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
        this.gamesGridConfig.datasource = new GridDatasource<GameModel>(this.games);
        this.gamesGridEl.configure(this.gamesGridConfig);
    }

    applyFilter(){
        this.dispatchEvent(new Event("myClick"));
    }

    toggleAll(){
        var first = !this.games[0]!.include;
        this.games.forEach(g => {
            g.include = first;
        });
        this.updateGridValues();
    }

    toggleBigGamesFilter(update:boolean = true){
        this.games.forEach(g => {
            g.include = g.bigGame;
        });

        if (update)
            this.updateGridValues();
    }

    toggleBigGamesBTSFilter(){
        this.toggleBigGamesFilter(false);
        this.games[0]!.include = false;
        this.updateGridValues();
    }

    toggleSmallGamesFilter(){
        this.games.forEach(g => {
            if (["FrisbeeGolf", "Diamant", "Railroad Ink"].includes(g.name))
                g.include = false;
            else
                g.include = !g.bigGame;
        });
        
        
        this.updateGridValues();
    }

    updateGridValues(){
        this.gamesGridEl.api.forceRender();
        /*this.gamesGridConfig.datasource = this.games;
        this.gamesGridEl?.configure(this.gamesGridConfig);*/
    }

    override render() {
		return html`
        <section>
            <h1>Filter Builder</h1>
            <article>
                <es-button @click=${ () => this.applyFilter() } type="tonal">Apply</es-button>
                <es-button @click=${ () => this.toggleBigGamesFilter() } type="tonal">Big games</es-button>
                <es-button @click=${ () => this.toggleBigGamesBTSFilter() } type="tonal">Big games minus Beyond the Sun</es-button>
                <es-button @click=${ () => this.toggleSmallGamesFilter() } type="tonal">Small games</es-button>
                <es-button @click=${ () => this.toggleAll() } type="tonal">Toogle all</es-button>
            </article>
            <es-grid></es-grid>
            
            <es-form>
                <!-- Various 'Input' elements -->
            </es-form>
        </section>
		`;
	}

    static override styles = css`
        section {
            display: grid;
            grid-template-rows: max-content max-content 1fr;
            overflow: hidden;
        }   
    `

    /*private handleClick(e: MouseEvent) {
        console.log("MyButton, click", e);
        // this.dispatchEvent(new Event("myClick"));
        const event = new CustomEvent<MyButtonEvent>("myClick", {
            detail: {
            label: this.label,
            date: new Date().toISOString()
            }
        });
        this.dispatchEvent(event);
    }*/
}