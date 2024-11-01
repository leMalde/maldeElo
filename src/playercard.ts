import type { EventOf, Use } from '@eye-share/shared';
import { html, LitElement, type PropertyValueMap } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { PlayerModel } from './models/PlayerModel';
import { repeat } from 'lit/directives/repeat.js';
import { configureFields, fieldCatalogToFormFields } from '@eye-share/web-components/concepts';
// import { LocalizeController } from '@eye-share/web-components/controllers';

class Doc {
    FullName: string;
    FavOpp: string;
    WorstOpp: string;
    TotalGames: number;
    Elo: number;
    Rating: number;
    FavGame: string;
}

const configure = configureFields<Doc, {testing: boolean}>();

@customElement( 'lem-playercard' )
export class PlayerCardComponent extends LitElement {

    @property({type:Object}) public playerModel:PlayerModel;

    protected context = { testing: true };

    // protected readonly localize = new LocalizeController({ host: this });

    protected playerForm: Doc = new Doc;

    protected fieldCat = {
		FullName: configure.text('FullName', {
            readonly: true,
            label: 'Full name',
            placeholder: "I'm a loser"
		}),
        FavOpp: configure.text('FavOpp', {
            readonly: true,
            label: 'Favorite opponent',
            placeholder: "I'm a loser"
		}),
		WorstOpp: configure.text('WorstOpp', {
			readonly: true,
            label: 'Worst opponent',
            placeholder: "I'm a winner"
		}),
		TotalGames: configure.text('TotalGames', {
			label:    'Total games',
			helpText: 'I am here to help',
            readonly: true
		}),
		Elo: configure.text('Elo', {
			label:    'Elo',
			helpText: 'I am here to help',
            readonly: true
		}),        
		Rating: configure.text('Rating', {
			label:    'Rating',
			helpText: 'I am here to help',
            readonly: true
		}),
        FavGame: configure.text('FavGame', {
            label: 'Favorite game',
            readonly: true
		}),
	} as const;
    
    protected fieldUse: Use<keyof typeof this.fieldCat> = {
        FullName: 100,
        Rating: 110,
        Elo: 120,
        TotalGames: 130,
        FavGame: 140,
        FavOpp: 150,
        WorstOpp: 160,
	};

    protected formFields = fieldCatalogToFormFields(this.fieldCat, this.fieldUse);

    override async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
        /*this.playerForm.Elo = this.playerModel.elo;
        this.playerForm.Rating = this.playerModel.rating;
        this.playerForm.TotalGames = this.playerModel.games;

        var maxKey = Object.keys(this.playerModel.gamescount).reduce((a, b) => this.playerModel.gamescount[a]! > this.playerModel.gamescount[b]! ? a : b);
        this.playerForm.FavGame = maxKey + " (" +  this.playerModel.gamescount[maxKey]! + ")";

        if (Object.keys(this.playerModel.opponentswins).length){
            maxKey = Object.keys(this.playerModel.opponentswins).reduce((a, b) => this.playerModel.opponentswins[a]! > this.playerModel.opponentswins[b]! ? a : b);
            this.playerForm.FavOpp = maxKey + " (" +  this.playerModel.opponentswins[maxKey]! + ")";
        }

        if (Object.keys(this.playerModel.opponentslosses).length){
            maxKey = Object.keys(this.playerModel.opponentslosses).reduce((a, b) => this.playerModel.opponentslosses[a]! > this.playerModel.opponentslosses[b]! ? a : b);
            this.playerForm.WorstOpp = maxKey + " (" +  this.playerModel.opponentslosses[maxKey]! + ")";
        }*/
    }

    protected override willUpdate(props: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        if(props.has("playerModel"))
            this.updatePlayerForm();
    }

    updatePlayerForm(){
        this.playerForm.FullName = this.playerModel.name;
        this.playerForm.Elo = this.playerModel.elo;
        this.playerForm.Rating = this.playerModel.rating;
        this.playerForm.TotalGames = this.playerModel.games;

        if (!Object.keys(this.playerModel.gamescount).length)
            return;

        var maxKey = Object.keys(this.playerModel.gamescount).reduce((a, b) => this.playerModel.gamescount[a]! > this.playerModel.gamescount[b]! ? a : b);
        this.playerForm.FavGame = maxKey + " (" +  this.playerModel.gamescount[maxKey]! + ")";

        if (Object.keys(this.playerModel.opponentswins).length){
            maxKey = Object.keys(this.playerModel.opponentswins).reduce((a, b) => this.playerModel.opponentswins[a]! > this.playerModel.opponentswins[b]! ? a : b);
            this.playerForm.FavOpp = maxKey + " (" +  this.playerModel.opponentswins[maxKey]! + ")";
        }

        if (Object.keys(this.playerModel.opponentslosses).length){
            maxKey = Object.keys(this.playerModel.opponentslosses).reduce((a, b) => this.playerModel.opponentslosses[a]! > this.playerModel.opponentslosses[b]! ? a : b);
            this.playerForm.WorstOpp = maxKey + " (" +  this.playerModel.opponentslosses[maxKey]! + ")";
        }
    }


    override render() {
		return html`
        <es-card class="card-overview">
            <!--<img
                slot="image"
                src=${ 'https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80' }
                alt="A kitten sits patiently between a terracotta pot and decorative grasses."
            />-->

            <strong>${this.playerModel.username}</strong>
            <es-form>
            ${ repeat(
					this.formFields,
					({ name }) => name,
					({ render }) => render.editor({
						context:  () => this.context,
						model:    this.playerForm,
						settings: {
							mode:                 'form',
							bare:                 'always',
							justify:              'end',
							suppressHelpText:     true,
							suppressErrorMessage: true,
						},
					}),
				) }
            </es-form>
        </es-card>
        
		`;
	}
}