import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PlayerModel } from './models/PlayerModel';

@customElement( 'malde-helloworld' )
export class HelloWorldComponent extends LitElement {

	protected playerData:PlayerModel[] = [
        new PlayerModel("Espen"),
        new PlayerModel("Roen"),
        new PlayerModel("Magga"),
        new PlayerModel("leMalde"),
        new PlayerModel("Gaute"),
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