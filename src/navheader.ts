import type { EsInputCmp } from "@eyeshare/web-components/components";
import { LitElement, css, html } from "lit";
import { customElement, query } from "lit/decorators.js";

@customElement( 'lem-navheader' )
export class NavHeaderComponent extends LitElement {
    
    @query("#username") protected UsernameEl:EsInputCmp 
    @query("#password") protected PasswordEl:EsInputCmp

    async login(){
        console.log(this.UsernameEl.value);
        console.log(this.PasswordEl.value);
        var nameRegex = /^[\w]{3,15}$/i;
        if (!this.PasswordEl.value || !nameRegex.test(this.PasswordEl.value)) {
            // this.showAlert = true;
            // this.alertMessage = "Invalid full name";
            return;
        }

        var usernameRegex = /^[a-zA-Z]{3,15}$/;
        if (!this.UsernameEl.value || !usernameRegex.test(this.UsernameEl.value)) {
            // this.showAlert = true;
            // this.alertMessage = "Invalid username";
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

        console.log(response);
    }
    
    override render() {
		return html`
		<header>
			<div class="container">
			<h1 class="logo"></h1>
			<nav>
				<ul>
					<li>
						<es-input id="username" type="text" minlength=10 maxlength=50 clearable placeholder="username"></es-input>
					</li>
					<li>
						<es-input id="password" type="password" minlength=10 maxlength=50 clearable toggle-password placeholder="password"></es-input>
					</li>
                    <li>
                        <es-button @click=${ () => this.login() }>
                            Log in
                        </es-button>
                    </li>
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
			background: #55d6aa;
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
	`
}