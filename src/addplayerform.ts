import { LitElement, css, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { configureFields, fieldCatalogToFormFields } from '@eye-share/web-components/concepts';
// import { LocalizeController } from '@eye-share/web-components/controllers';
import type { Use } from "@eye-share/shared";
import { repeat } from "lit/directives/repeat.js";
import type { EsAlertCmp } from "@eye-share/web-components/components";
import { when } from "lit/directives/when.js";

class NewPlayer {
    name: string;
    username: string;
}

const configure = configureFields<NewPlayer, {testing: boolean}>();

@customElement( 'lem-addplayer' )
export class AddPlayerPageComponent extends LitElement {
    
    @query("es-alert") protected esAlertEl:EsAlertCmp

    protected context = { testing: true };
    
    @state() protected showAlert = false;
    @state() protected alertVariant:EsAlertCmp['variant'] = 'error';
    @state() protected alertMessage:string = '';

    // protected readonly localize = new LocalizeController({ host: this });

    protected newPlayerForm: NewPlayer = new NewPlayer;

    protected fieldCat = {		
        Name: configure.text('name', {
            label: 'Full name',
            placeholder: "Full name",
            minlength: 3,
            maxlength: 45,

		}),
        Username: configure.text('username', {
            label: 'Username',
            placeholder: "Username",
            minlength: 3,
            maxlength: 15
		}),
	} as const;

    protected fieldUse: Use<keyof typeof this.fieldCat> = {
        Username: 100,
        Name: 110,
	};

    protected formFields = fieldCatalogToFormFields(this.fieldCat, this.fieldUse);

    override async connectedCallback() {
        super.connectedCallback();

        await this.updateComplete;
    }

    async addPlayer(){
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

        const response = await fetch('/elosystem/addPlayer.php', {
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
        this.showAlert = false;
    };


    override render() {
		return html`
        <es-card class="card-overview">
            <strong>Add new player</strong>
            <es-form>
                ${ repeat(
                        this.formFields,
                        ({ name }) => name,
                        ({ render }) => render.editor({
                            context:  () => this.context,
                            model:    this.newPlayerForm,
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
            <es-button @click=${ () => this.addPlayer() } type="tonal">Add player</es-button>
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