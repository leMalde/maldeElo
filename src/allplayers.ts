import type { EsGridCmp } from '@eyeshare/web-components/components/310.Grid/grid/grid.cmp.js';
import type { EsGrid } from '@eyeshare/web-components/components/310.Grid/grid/grid.types.js';
import { html, LitElement, type PropertyValueMap } from 'lit';
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

    protected override willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        this.playerGridConfig.datasource = this.playerData;
        this.playerGridEl?.configure(this.playerGridConfig);
    }

    protected playerGridConfig:EsGrid.Configuration<PlayerModel> = {
        setup: {
            columns: [ 
                {path:"name", label:"Name", pinned:true, pinnable: true},
                {path:"rating", label:"Rating", width: 130},                
                {path:"bestrating", label:"Best Rating", width: 130},                
                {path:"worstrating", label:"Worst Rating", width: 130},
                {path:"games", label:"#Games"},
                {path:"winpercent", label:"Win %"},
                {path:"elo", label:"Elo rating", width: 130},
                {path:"bestelo", label:"Best Elo", width: 130},
                {path:"worstelo", label:"Worst Elo", width: 130},                
                {path:"scorepercent", label: "Avg Score %", width: 130}
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

    override updated(changed:any) {
        super.updated(changed);
        console.log(this.playerData);
    }

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