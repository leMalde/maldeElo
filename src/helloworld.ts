import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement( 'malde-helloworld' )
export class HelloWorldComponent extends LitElement {

	protected playerData:PlayerModel[] = [
        {
            name: "Espen",
            elo: 1000,
            games: 0
        },
        {
            name: "Roen",
            elo: 1000,
            games: 0
        },
        {
            name: "Magga",
            elo: 1000,
            games: 0
        },
        {
            name: "leMalde",
            elo: 1000,
            games: 0
        },
        {
            name: "Gaute",
            elo: 1000,
            games: 0
        }
    ]

	override render() {
		return html`
		<div>HALLO Lars Erik</div>
		<lem-allplayers .playerData=${this.playerData}></lem-allplayers>
		<lem-allgames .playerData=${this.playerData} @change=${() => this.requestUpdate()}></lem-allgames>
		`;
	}
}
/*
@customElement( 'malde-es-grid' )
export class MaldeGridCmp extends EsGridCmp {

}
*/