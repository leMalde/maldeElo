import { LitElement, css, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { configureFields, fieldCatalogToFormFields, type Code } from '@eyeshare/web-components/concepts';
import { LocalizeController } from '@eyeshare/web-components/controllers';
import type { Use } from "@eyeshare/shared";
import { repeat } from "lit/directives/repeat.js";
import type { EsAlertCmp } from "@eyeshare/web-components/components";
import { when } from "lit/directives/when.js";
import { GameMode, GameType, ScoringType } from "./models/GameModel";

class NewGame {
    name?: string;
    bigGame: boolean;
    gameType: Code;
    gameMode: Code;
    scoringType: Code;
}

const configure = configureFields<NewGame, {testing: boolean}>();

@customElement( 'lem-addgame' )
export class AddGamePageComponent extends LitElement {
    
    @query("es-alert") protected esAlertEl:EsAlertCmp

    protected context = { testing: true };
    
    @state() protected showAlert = false;
    @state() protected alertVariant:EsAlertCmp['variant'] = 'error';
    @state() protected alertMessage:string = '';

    protected readonly localize = new LocalizeController({ host: this });

    protected newGameForm: NewGame = {
        bigGame: true,
        gameType: {
            Key: GameType[0]!,
            Description: GameType[0]!.toString()
        },
        gameMode: {
            Key: GameMode[0]!,
            Description: GameMode[0]!.toString()
        },
        scoringType: {
            Key: ScoringType[0]!,
            Description: ScoringType[0]!.toString()
        }
    };

    protected fieldCat = {		
        Name: configure.text('name', {
            label: 'Full name',
            placeholder: "Name",
            minlength: 3,
            maxlength: 45,

		}),
        BigGame: configure.switch('bigGame', {
            label: 'Big game',
		}),
        GameType: configure.typeaheadPick('gameType', {
            label: 'Game type',
            props: [ "Key" ],
            datasource: {
                list: [
                    {
                        Key: GameType[0]!,
                        Description: GameType[0]!.toString()
                    },
                    {
                        Key: GameType[1]!,
                        Description: GameType[1]!.toString()
                    },
                    {
                        Key: GameType[2]!,
                        Description: GameType[2]!.toString()
                    },
                ]
            }
        }),
        GameMode: configure.typeaheadPick('gameMode', {
            label: 'Game mode',
            props: [ "Key" ],
            datasource: {
                list: [
                    {
                        Key: GameMode[0]!,
                        Description: GameMode[0]!.toString()
                    },
                    {
                        Key: GameMode[1]!,
                        Description: GameMode[1]!.toString()
                    },
                ]
            }
        }),
        ScoringType: configure.typeaheadPick('scoringType', {
            label: 'Scoring type',
            props: [ "Key" ],
            datasource: {
                list: [
                    {
                        Key: ScoringType[0]!,
                        Description: ScoringType[0]!.toString()
                    },
                    {
                        Key: ScoringType[1]!,
                        Description: ScoringType[1]!.toString()
                    },
                ]
            }
        }),
	} as const;

    protected fieldUse: Use<typeof this.fieldCat> = {
        Name: 100,
        BigGame: 110,
        GameType: 120,
        GameMode: 130,
        ScoringType: 140,
	};

    protected formFields = fieldCatalogToFormFields(this.fieldCat, this.fieldUse);

    override async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
    }

    async addGame(){
        var nameRegex = /^[\wæøå -():!?]{3,45}$/i;
        if (!this.newGameForm.name || !nameRegex.test(this.newGameForm.name)) {
            this.showAlert = true;
            this.alertMessage = "Invalid name";
            return;
        }

        console.log("Submit new game!");

        const response = await fetch('/elosystem/addGame.php', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
                'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                "name": this.newGameForm.name,
                "bigGame": this.newGameForm.bigGame,
                "gameType": GameType[this.newGameForm.gameType.Key as keyof typeof GameType],
                "gameMode": GameMode[this.newGameForm.gameMode.Key as keyof typeof GameMode],
                "scoringType": ScoringType[this.newGameForm.scoringType.Key as keyof typeof ScoringType],
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


    override render() {
		return html`
        <es-card class="card-overview">
            <strong>Add new game</strong>
            <es-form disableFormStyling>
                ${ repeat(
                        this.formFields,
                        ({ name }) => name,
                        ({ render }) => render.editor({
                            context:  () => this.context,
                            model:    this.newGameForm,
                            localize: this.localize,
                            settings: {
                                mode:                 'form',
                                bare:                 'always',
                                justify:              'start',
                                suppressHelpText:     true,
                                suppressErrorMessage: false,
                            },
                        }),
                    ) }
            </es-form>
            <es-button @click=${ () => this.addGame() } type="tonal">Add game</es-button>
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