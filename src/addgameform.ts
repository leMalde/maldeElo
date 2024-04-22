import { LitElement, css, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { configureFields, fieldCatalogToFormFields } from '@eyeshare/web-components/concepts';
import { LocalizeController } from '@eyeshare/web-components/controllers';
import type { Use } from "@eyeshare/shared";
import { repeat } from "lit/directives/repeat.js";
import type { EsAlertCmp } from "@eyeshare/web-components/components";
import { when } from "lit/directives/when.js";
import { GameMode, GameType, type ScoringType } from "./models/GameModel";

class NewPlayer {
    name: string;
    bigGame: boolean;
    gameType: GameType;
    gameMode: GameMode;
    scoringType: ScoringType;
}

const configure = configureFields<NewPlayer, {testing: boolean}>();

@customElement( 'lem-addgame' )
export class AllGamesPageComponent extends LitElement {
    
    @query("es-alert") protected esAlertEl:EsAlertCmp

    protected context = { testing: true };
    
    @state() protected showAlert = false;
    @state() protected alertVariant:EsAlertCmp['variant'] = 'error';
    @state() protected alertMessage:string = '';

    protected readonly localize = new LocalizeController({ host: this });

    protected newPlayerForm: NewPlayer = new NewPlayer;

    protected fieldCat = {		
        Name: configure.text('name', {
            label: 'Full name',
            placeholder: "I'm a loser",
            minlength: 3,
            maxlength: 45,

		}),
        BigGame: configure.switch('bigGame', {
            label: 'Big game',
		}),
        GameType: configure.text('gameType', {
            label: 'Game type'
        }),
        GameMode: configure.text('gameMode', {
            label: 'Game mode'
        }),
        ScoringType: configure.radiogroup('scoringType', {
            options: [],
            helpText: "HELP",
            label: "LABEL"
        }),
	} as const;

    protected fieldUse: Use<typeof this.fieldCat> = {
        Name: 100,
        BigGame: 110,
        GameType: 120,
        GameMode: 130,
        ScoringType: false,
	};

    protected formFields = fieldCatalogToFormFields(this.fieldCat, this.fieldUse);

    override async connectedCallback() {
        super.connectedCallback();

        await this.updateComplete;
    }

    async addGame(){
        var nameRegex = /^[\wæøå -]{3,45}$/i;
        if (!this.newPlayerForm.name || !nameRegex.test(this.newPlayerForm.name)) {
            this.showAlert = true;
            this.alertMessage = "Invalid full name";
            return;
        }

        var usernameRegex = /^[a-zA-Z]{3,15}$/;
        if (!this.newPlayerForm.username || !usernameRegex.test(this.newPlayerForm.username)) {
            this.showAlert = true;
            this.alertMessage = "Invalid username";
            return;
        }
        console.log("Submit new player!");
        console.log(this.newPlayerForm);

        const response = await fetch('/elosystem/addGame.php', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
                'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                "name": this.newPlayerForm.name,
                "username": this.newPlayerForm.username
            }),
		});

        console.log(response);

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
                            model:    this.newPlayerForm,
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
            <es-button @click=${ () => this.addGame() } type="tonal">Add player</es-button>
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