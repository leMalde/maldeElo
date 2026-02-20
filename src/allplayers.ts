import type { EsGridCmp, EsGrid } from '@eye-share/web-components/components';
import { GridDatasource } from '@eye-share/web-components/components';
import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import type { PlayerModel } from './models/PlayerModel';


/*interface PlayerModel {
    Name: string,
    Score: number,
}*/

@customElement( 'lem-allplayers' )
export class AllPlayersPageComponent extends LitElement {

    @property({type:Array}) public playerData:PlayerModel[] = [];

    @query('es-grid') protected playerGridEl:EsGridCmp;

    protected override willUpdate(_changedProperties: Map<PropertyKey, unknown>): void {
        this.playerGridConfig.datasource = new GridDatasource<PlayerModel>(this.playerData);
        this.playerGridEl?.configure(this.playerGridConfig);
        // this.playerGridEl?.api.forceRender();
    }

    protected playerGridConfig:EsGrid.Configuration<PlayerModel> = {
        rowContext: () => ({}),
        setup: {
            columns: [ 
                {get: m => m.username, label:"Name", pinned:true, pinnable: true},
                {get: m => m.rating, label:"Rating", width: 130},                
                {get: m => m.bestrating, label:"Best Rating", width: 130},                
                {get: m => m.worstrating, label:"Worst Rating", width: 130},
                {get: m => m.games, label:"#Games"},
                {get: m => m.winpercent, label:"Win %"},
                {get: m => m.elo, label:"Elo rating", width: 130},
                {get: m => m.bestelo, label:"Best Elo", width: 130},
                {get: m => m.worstelo, label:"Worst Elo", width: 130},                
                {get: m => m.scorepercent, label: "Avg Score %", width: 130}
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
        //datasource: this.playerData,
        datasource: new GridDatasource<PlayerModel>(this.playerData),
    }

    override async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
        this.playerGridConfig.datasource = new GridDatasource<PlayerModel>(this.playerData);
        this.playerGridEl.configure(this.playerGridConfig);
    }

    /*override updated(changed:any) {
        super.updated(changed);
        console.log(this.playerData);
        this.playerGridConfig.datasource = this.playerData;
        this.playerGridEl?.configure(this.playerGridConfig);
        this.playerGridEl?.api.forceRender();
    }*/

	override render() {
		return html`
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