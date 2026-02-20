import { LitElement, css, html, type PropertyValueMap } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { PlayerModel } from "./models/PlayerModel";
import { EsNumberCmp, EsTypeaheadCmp } from "@eye-share/web-components/components";
import { EsLookup, type TypeaheadField } from "@eye-share/web-components/concepts";
import type { EventOf } from "@eye-share/shared";
import type { RecordScore } from "./models/GameRecord";

@customElement( 'lem-playerscore' )
export class PlayerScoreComponent extends LitElement {
   
    @query('es-typeahead') protected typeaheadEl:EsTypeaheadCmp<PlayerModel>

    @property({type:Array}) public players:PlayerModel[] = [];
    @property({type:Object}) public recordScore:RecordScore;

    private _config: TypeaheadField<PlayerModel> = {
        type: 'typeahead',
        name: 'players',
        label: 'Players',
        placeholder: 'Select a player',
        rendering: EsLookup.objectRendering<PlayerModel>([ 'username' ]),
        datasource: {
            list: this.players,
        },
        transform: EsLookup.identityTransform<PlayerModel>()
    }

    override async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
        if (this.typeaheadEl && this.recordScore && this.recordScore.player)
            this.typeaheadEl.value = this.recordScore.player!;
    }

    protected override willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        this._config.datasource = {
            list: this.players,
        }

        if (this.typeaheadEl && this.recordScore && this.recordScore.player)
            this.typeaheadEl.value = this.recordScore.player!;
    }

    override render() {
        return html`
            <div class="flex-container">
                <es-typeahead
                    id                     ="popout"
                    mode                   ="default"
                    .name                  =${ this._config.name }
                    .placeholder           =${ this._config.placeholder }
                    .helpText              =${ this._config.helpText }
                    .datasource            =${ this._config.datasource as any }
                    .transform             =${ this._config.transform as any }
                    .rendering             =${ this._config.rendering as any }
                    no-click-close
                    @change=${ (ev: EventOf<EsTypeaheadCmp<PlayerModel>>) => this.recordScore.player = ev.target.value }
                >
                </es-typeahead>
                <es-number @change=${(ev:EventOf<EsNumberCmp>) => this.recordScore.score = ev.target.value} placeholder = 'Score' maximum-fraction-digits = 0 minimum-fraction-digits = 0 maximum-rendered-fraction-digits = 0>
                </es-number>
                <es-number @change=${(ev:EventOf<EsNumberCmp>) => this.recordScore.tiebreak = ev.target.value} placeholder = 'Tiebreak' min = 0 max = 50 maximum-fraction-digits = 0 minimum-fraction-digits = 0 maximum-rendered-fraction-digits = 0>
                </es-number>
            </div>
        `
    }

    static override styles = css`
        .flex-container {
            display: flex;
            margin: 5px 0;
        }

        .flex-container > es-typeahead {
            flex: 2;
            margin: 0 8px;
        }

        .flex-container > es-number {
            flex: 1;
            margin: 0 8px;
        }

		es-number {
            display: inline-flex;
        }
	`
}