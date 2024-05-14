import { LitElement, css, html, type PropertyValueMap } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { configureFields, fieldCatalogToFormFields, type Code, type TypeaheadField } from '@eyeshare/web-components/concepts';
import { LocalizeController } from '@eyeshare/web-components/controllers';
import { queryEventPath, type CustomEventOf, type EventOf, type Use } from "@eyeshare/shared";
import { repeat } from "lit/directives/repeat.js";
import { EsFormCmp, EsNumberCmp, EsTypeahead, EsTypeaheadCmp, type EsAlertCmp } from "@eyeshare/web-components/components";
import { when } from "lit/directives/when.js";
import { GameMode, GameModel, GameType, ScoringType } from "./models/GameModel";
import { PlayerModel } from "./models/PlayerModel";
import type { RecordScore } from "./models/GameRecord";

class RecordGame {
    game?: GameModel;
    date: string;
    numberofplayers: number;
}

const configure = configureFields<RecordGame, {testing: boolean}>();

@customElement( 'lem-recordgame' )
export class RecordGamePageComponent extends LitElement {
    
    @property({type:Array}) public games:GameModel[] = [];
    @property({type:Array}) public players:PlayerModel[] = [];

    @query("es-alert") protected esAlertEl:EsAlertCmp
    @query("es-form") protected esFormEl:EsFormCmp

    protected context = { testing: true };
    
    @state() protected showAlert = false;
    @state() protected alertVariant:EsAlertCmp['variant'] = 'error';
    @state() protected alertMessage:string = '';
    @state() protected scoreRecords:RecordScore[] = [
        {},
        {},
        {},
        {}
    ]

    protected readonly localize = new LocalizeController({ host: this });

    protected recordGameForm: RecordGame = {
        date: new Date(Date.now()).toISOString(),
        numberofplayers: 4,
    };

    protected fieldCat = {		
        Game: configure.typeaheadPick('game', {
            label: 'Game',
            props: ["name"],
            datasource: {
                list: this.games
            }

		}),
        Date: configure.datetime('date', {
            label: 'Date'
		}),
        NumberOfPlayers: configure.number('numberofplayers', {
            label: "Number of players",
            min: 2,
            max: 25,
            step: 1,
            
        })
	};

    protected fieldUse: Use<typeof this.fieldCat> = {
        Date: 100,
        Game: 110,
        NumberOfPlayers: 120
	};

    protected formFields = fieldCatalogToFormFields(this.fieldCat, this.fieldUse);

    override async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
    }

    protected override willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        
        if(_changedProperties.has("games")){
            this.fieldCat.Game = configure.typeaheadPick('game', {
                label: 'Game',
                props: ["name"],
                placeholder: 'Select a game',
                datasource: {
                    list: this.games
                }    
            });
            this.formFields = fieldCatalogToFormFields(this.fieldCat, this.fieldUse);

        }

    }

    async addGame(){
        var nameRegex = /^[\wæøå -():!?]{3,45}$/i;
        this.showAlert = false;
        /*if (!this.newGameForm.name || !nameRegex.test(this.newGameForm.name)) {
            this.showAlert = true;
            this.alertMessage = "Invalid name";
            return;
        }*/
        var ids:number[] = [];

        // Validate scoreRecords
        for (let record of this.scoreRecords){
            if (!record.player || !record.player!.id){
                this.showAlert = true;
                this.alertVariant = 'error';
                this.alertMessage = 'Invalid player entry somewhere.';
                break;
            }

            if (record.score == undefined){
                this.showAlert = true;
                this.alertVariant = 'error';
                this.alertMessage = record.player!.username + ' needs a score.';
                break;
            }

            if (ids.includes(record.player!.id)){
                this.showAlert = true;
                this.alertVariant = 'error';
                this.alertMessage = record.player!.username + ' cannot be added twice.';
                break;
            }

            ids.push(record.player!.id);
        }

        if (this.showAlert == true){
            return;
        }

        interface score {
            userId: number,
            username: string,
            score: number,
            tiebreak?: number,
        };

        console.log("Submit new game record!");
        const scores:score[] = this.scoreRecords.map(s => (
           {
                userId: s.player!.id,
                username: s.player!.username,
                score: s.score!,
                tiebreak: s.tiebreak,
           })
        );

        const response = await fetch('/elosystem/addGameRecord.php', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
                'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                "gameId": this.recordGameForm.game?.id,
                "date": this.recordGameForm.date,
                "scoreRecords": scores,
            }),
		});

        if (!response.ok){
            this.showAlert = true;
            this.alertVariant = 'error';
            this.alertMessage = await response.text();
            // if (response.body !== null)
                // this.alertMessage = new TextDecoder("utf-8").decode(response.body);
        }else{
            this.showAlert = true;
            this.alertVariant = 'success';
            this.alertMessage = await response.text();
            // this.alertMessage = new TextDecoder("utf-8").decode(response.body);
        }
    }

    handleAfterHide = (ev: Event) => {
        const alert = ev.target as EsAlertCmp;
        // alert.open = false;
        // this.esAlertEl.style.display = 'none';
        // alert.variant = "error";
        this.showAlert = false;
        // setTimeout(() => (alert && (this.showAlert = false)),0);
    };
    
    autoFill(){
        this.recordGameForm.numberofplayers = 4;
        this.esFormEl.requestUpdate();

        this.scoreRecords = [
            { player : this.players.find(p => p.username == 'Espen') },
            { player : this.players.find(p => p.username == 'Roen') },
            { player : this.players.find(p => p.username == 'Magga') },
            { player : this.players.find(p => p.username == 'leMalde') },
        ];
    }

    protected handleFormChange(){
        if (this.recordGameForm.numberofplayers === this.scoreRecords.length || this.recordGameForm.numberofplayers < 2 || this.recordGameForm.numberofplayers > 25)
            return;

        while(this.scoreRecords.length < this.recordGameForm.numberofplayers){
            this.scoreRecords.push({});
        }

        while(this.scoreRecords.length > this.recordGameForm.numberofplayers){
            this.scoreRecords.pop();
        }
        this.requestUpdate("scoreRecords");

    }

    override render() {
		return html`
        <es-card class="card-overview">
            <h2>Record new game result</h2>
            <es-form @change=${this.handleFormChange}>
                ${ repeat(
                        this.formFields,
                        ({ name }) => name,
                        ({ render }) => render.editor({
                            context:  () => this.context,
                            model:    this.recordGameForm,
                            localize: this.localize,
                            settings: {
                                mode:                 'form',
                                bare:                 'always',
                                justify:              'end',
                                suppressHelpText:     true,
                                suppressErrorMessage: false,
                            },
                        }),
                    ) }
            </es-form>
            <!--
            <es-number 
                size                             = "small"
                value                            = "4"
                label                            = "Number of players"
                maximum-fraction-digits          = 0
                minimum-fraction-digits          = 0
                maximum-rendered-fraction-digits = 0
                max                              = 25
                min                              = 2>
                <span slot="help-text">Integers</span>
                <es-button slot="start" @click=${ this.decrement } tabindex="-1">
                    <es-icon iconId="esd:arrow_20-down"></es-icon>
                </es-button>
                <es-button slot="end" @click=${ this.increment } tabindex="-1">
                    <es-icon iconId="esd:arrow_20-up"></es-icon>
                </es-button>
            </es-number>
            -->
            ${ repeat(this.scoreRecords, (scoreRecord, index) => html`
                            <lem-playerscore .players=${this.players} .recordScore=${scoreRecord}></lem-playerscore>
                            ` ) }
            <es-button @click=${ () => this.autoFill() } type="tonal">Geeks</es-button>
            <es-button @click=${ () => this.addGame() } type="tonal">Record game result</es-button>

            ${when(this.showAlert,  ()  => html`
                <es-alert
                    class="alert-closable"
                    variant=${this.alertVariant}
                    open
                    closable
                    @es-after-hide=${ this.handleAfterHide }
                >
                ${this.alertMessage}
                </es-alert>
            `)}
            
        </es-card>
		`;
	}

    static override styles = css`
		es-button, es-alert {
			margin-top: 10px;
		}
	`
}