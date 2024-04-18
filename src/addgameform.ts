import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";



@customElement( 'lem-addgame' )
export class AllGamesPageComponent extends LitElement {
    
    @query('es-grid') protected gameGridEl:EsFormCmp

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

    override render() {
		return html`
		<es-form>
            <!-- Various 'Input' elements -->
        </es-form>
		`;
	}
}