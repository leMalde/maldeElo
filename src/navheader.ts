import type { EsAlertCmp, EsInputCmp } from "@eye-share/web-components/components";
import { LitElement, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { when } from "lit/directives/when.js";

@customElement( 'lem-navheader' )
export class NavHeaderComponent extends LitElement {

	@property() public username:string = '';
    
    @query("#username") protected UsernameEl:EsInputCmp 
    @query("#password") protected PasswordEl:EsInputCmp
	@query("es-alert") protected esAlertEl:EsAlertCmp
    
    @state() protected showAlert = false;
    @state() protected alertVariant:EsAlertCmp['variant'] = 'error';
    @state() protected alertMessage:string = '';

    async login(){
        var nameRegex = /^[\w]{3,15}$/i;
        if (!this.PasswordEl.value || !nameRegex.test(this.PasswordEl.value)) {
            this.showAlert = true;
            this.alertMessage = "That is Espen's password";
            return;
        }

        var usernameRegex = /^[a-zA-Z]{3,15}$/;
        if (!this.UsernameEl.value || !usernameRegex.test(this.UsernameEl.value)) {
            this.showAlert = true;
            this.alertMessage = "Invalid username: " + usernameRegex;
            return;
        }

        const response = await fetch('/elosystem/login.php', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
                'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                "password": this.PasswordEl.value,
                "username": this.UsernameEl.value
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

            const options = {
                detail: {newname: this.UsernameEl.value},
                bubbles: true,
                composed: true
              };
            this.dispatchEvent(new CustomEvent('name-changed', options));
        }
    }

	handleAfterHide = (ev: Event) => {
        const alert = ev.target as EsAlertCmp;
        this.showAlert = false;
    };
    
    override render() {
		return html`
		<header>
			<div class="container">
			<h1 class="logo"></h1>
			<nav>
				<ul>
				
					${when(this.username != '', () => html`
						<li>
							Hello, ${this.username}!
						</li>	
					`)}

					${when(this.showAlert,  ()  => html`
						<li>
						<es-alert
							class="alert-closable"
							variant=${this.alertVariant}
							open
							closable
							@es-after-hide=${ this.handleAfterHide }
						>
						${this.alertMessage}
						</es-alert>
						</li>
					`)}
					
					${when(this.username == '', () => html`
						<li>
							<es-input id="username" type="text" minlength=10 maxlength=50 clearable placeholder="username"></es-input>
						</li>
						<li>
							<es-input id="password" type="password" minlength=10 maxlength=50 clearable toggle-password placeholder="password"></es-input>
						</li>
						<li>
							<es-button variant="neutral" @click=${ () => this.login() }>
								Log in
							</es-button>
						</li>
					`)}
				</ul>
			</nav>
			</div>
		</header>
		`;
	}

    static override styles = css`
		es-legend::part(input-base) {
			background: blanchedalmond;
		}

		.container {
			width: 80%;
			margin: 0 auto;
		}

		header {
			background: #318f6f;
			// background: var(--esd-surface5);
		}

		header::after {
		content: '';
		display: table;
		clear: both;
		}

		.logo {
		float: left;
		padding: 10px 0;
		}

		nav {
		float: right;
		}

		nav ul {
		margin: 0;
		padding: 0;
		list-style: none;
		}

		nav li {
		display: inline-block;
		margin-left: 70px;
		padding-top: 23px;

		position: relative;
		}

		nav a {
		color: #444;
		text-decoration: none;
		text-transform: uppercase;
		font-size: 14px;
		}

		nav a:hover {
		color: #000;
		}

		nav a::before {
		content: '';
		display: block;
		height: 5px;
		background-color: #444;

		position: absolute;
		top: 0;
		width: 0%;

		transition: all ease-in-out 250ms;
		}

		nav a:hover::before {
		width: 100%;
		}

		es-input::part(legend-base){
			background-color: black;
		}
	`
}