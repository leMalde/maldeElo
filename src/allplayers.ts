import type { EsGridCmp } from '@eyeshare/web-components/components/310.Grid/grid/grid.cmp.js';
import type { EsGrid } from '@eyeshare/web-components/components/310.Grid/grid/grid.types.js';
import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { GameModel } from './models/GameModel';
import type { GameRecord } from './models/GameRecord';
import { CalculateChanges } from './utilities/eloService';


/*interface PlayerModel {
    Name: string,
    Score: number,
}*/

@customElement( 'lem-allplayers' )
export class AllPlayersPageComponent extends LitElement {

    @property({type:Array}) public playerData:PlayerModel[] = [];

    @query('es-grid') protected playerGridEl:EsGridCmp    

    protected playerGridConfig:EsGrid.Configuration<PlayerModel> = {
        setup: {
            columns: [ 
                {path:"name", label:"Name", pinned:true, pinnable: true},
                {path:"elo", label:"Elo rating", width: 130},
                {path:"games", label:"#Games"},
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

    override async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
        this.playerGridConfig.datasource = this.playerData;
        console.log(this.playerGridEl);
        this.playerGridEl.configure(this.playerGridConfig);
    }

	override render() {
		return html`
        <es-button type="tonal">KULT</es-button>
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