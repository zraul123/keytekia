import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Panel from '../Components/Site/Panel';
import CardEntry from '../Components/Site/CardEntry';
import CardImage from '../Components/GameBoard/CardImage';

import * as actions from '../actions';

export class Deckbuilder extends React.Component {
    constructor(props) {
        super(props);
        this.cards = [];
        this.displayCards = [];
        this.selectedCards = [];
        this.selectedDeck = [];
        this.selectedDisplayCards = [];
        this.forcedUpdate = false;
        this.total = 0;

        this.state = {
            deckName: '',
            loadedCards: false
        };
    }

    componentDidMount() {
        if(this.props.id) {
            this.props.getSavedDeck(this.props.id, (res) => {
                if(res.success) {
                    this.selectedDeck = res.deck;
                    this.total = this.selectedDeck.total;
                    this.selectedCards = this.selectedDeck.cards;
                    this.setState({ deckName: this.selectedDeck.name });
                }
            });
        }

        this.props.loadCards().then(() => {
            this.state.loadedCards = true;
            this.forceUpdate();
        });
        this.props.createDeckBuilder();

        this.selectFunction = this.selectFunction.bind(this);
        this.saveButtonClicked = this.saveButtonClicked.bind(this);
        this.updateButtonClicked = this.updateButtonClicked.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps() {
        if(this.props.cards) {
            this.cards = Object.values(this.props.cards);
            this.state.loadedCards = true;
            this.forceUpdate();
        }
    }

    getCards() {
        if(this.cards.length !== this.displayCards.length) {
            this.displayCards = [];
            for(var i = 0; i < this.cards.length; i++) {
                this.displayCards.push(
                    <CardImage isDeckbuilder={ true } img={ this.cards[i].image } key={ i }
                               selectFunction={ this.selectFunction } id={ this.cards[i].id }/>
                );
            }
        }

        return <div>{ this.displayCards }</div>;
    }

    render() {
        if(this.props.id) {
            return (
                <Panel title={ 'Deck Editor' }>
                    <Panel title={ 'Available Cards' } className='deckbuilder-container available-cards-panel'>
                        { this.state.loadedCards ? this.getCards() : 'Loading' }
                    </Panel>
                    <Panel title={ 'Selected Cards (' + this.total + ')' } className='deckbuilder-container selected-cards-panel'>
                        { this.getSelectedCards() }
                    </Panel>
                    <div className='deck-builder-settings'>
                        Deck name:&nbsp; <input type='text' value={ this.state.value } onChange={ this.handleChange } />
                        <button disabled={ this.total < 35 || this.total > 45 } onClick={ this.updateButtonClicked } className='saveButton'>Update</button>
                    </div>
                </Panel>
            );
        }

        return (
            <Panel title={'Deckbuilder'}>
                <Panel title={'Available Cards'} className='deckbuilder-container available-cards-panel'>
                    {this.state.loadedCards ? this.getCards() : 'Loading'}
                </Panel>
                <Panel title={'Selected Cards (' + this.total + ')' } className='deckbuilder-container selected-cards-panel'>
                    {this.getSelectedCards()}
                </Panel>
                <div className="deck-builder-settings">
                    Deck name:&nbsp; <input type="text" value={this.state.value} onChange={this.handleChange} />
                    <button disabled={ this.total < 35 || this.total > 45 } onClick={this.saveButtonClicked} className="saveButton">Save</button>
                </div>
            </Panel>
        );
    }

    /**
     * Creating a new deck
     */

    handleChange(event) {
        this.setState({ deckName: event.target.value });
    }

    saveButtonClicked() {
        this.props.getBuilderDeck(() => {
            this.props.saveBuilderDeck(this.state.deckName, (res) => {
                if(res.success) {
                    this.props.navigate('/decks');
                }
            });
        });
    }


    /**
     * Updating an existing deck.
     */

    updateButtonClicked() {
        this.selectedDeck.name = this.state.deckName;
        this.selectedDeck.cards = this.selectedCards;
        this.selectedDeck.total = this.total;

        this.props.updateDeck(this.selectedDeck, (res) => {
            if(res.success) {
                this.props.navigate('/decks');
            }
        });
    }


    /**
     * Updating Either/Or
     */

    selectFunction(id) {
        if(this.props.id) {
            if(this.total >= 45) {
                return;
            }

            let found = false;
            this.selectedCards.find((card) => {
                if(card.id === id && card.count < 3) {
                    card.count++;
                    this.total++;
                    found = true;
                }
            });

            if(!found) {
                this.cards.find((newCard) => {
                    if(newCard.id === id) {
                        this.selectedDeck.cards.push({
                            id: newCard.id,
                            count: 1
                        });
                        this.total++;
                    }
                });
            }

            this.forceUpdate();
            this.forcedUpdate = true;
        } else {
            this.props.addCardToBuilder(id,
                (response) => {
                    if(response.success) {
                        this.selectedCards = response.buildingDeck.cards;
                        this.total = response.buildingDeck.total;
                        this.forceUpdate();
                        this.forcedUpdate = true;
                    }
                });
        }

    }

    getSelectedCards() {
        if(this.selectedCards.length !== this.selectedDisplayCards.length || this.forcedUpdate) {
            this.selectedDisplayCards = [];
            this.selectedCards.forEach((selectedCard, i) => {
                let card = this.cards.find(card => card.id === selectedCard.id);

                if(card && selectedCard.count) {
                    this.selectedDisplayCards.push(
                        <CardEntry
                            key={ i }
                            cardName={ card.name }
                            count={ selectedCard.count }
                            id={card.id}
                            handleMinus={this.handleMinus.bind(this, card.id)}
                            handleRemove={this.handleRemove.bind(this, card.id)}
                        />
                    );
                }
            });
        }

        return <div>{ this.selectedDisplayCards }</div>;
    }

    handleMinus(cardId) {
        if(this.props.id) {
            this.selectedCards.find((card) => {
                if(card.id === cardId) {
                    card.count--;
                    this.total--;
                    this.forceUpdate();
                    this.forcedUpdate = true;
                }
            });
        } else {
            this.removeSelectedCard(cardId, 1);
        }
    }

    handleRemove(cardId) {
        this.removeSelectedCard(cardId, 45);
    }

    removeSelectedCard(cardId, count) {
        if(this.props.id) {
            this.selectedCards.find((card) => {
                if(card.id === cardId) {
                    const cardNum = card.count;

                    this.total = this.total - cardNum;
                    card.count = 0;
                    this.forceUpdate();
                    this.forcedUpdate = true;
                }
            });
        } else {
            this.props.removeCardFromBuilder(cardId, count,
                (response) => {
                    if(response.success) {
                        this.selectedCards = response.buildingDeck.cards;
                        this.total = response.buildingDeck.total;
                        this.forceUpdate();
                        this.forcedUpdate = true;
                    }
                });
        }
    }
}

Deckbuilder.displayName = 'Deckbuilder';
Deckbuilder.propTypes = {
    addCardToBuilder: PropTypes.func.isRequired,
    cards: PropTypes.object,
    createDeckBuilder: PropTypes.func.isRequired,
    getBuilderDeck: PropTypes.func.isRequired,
    getSavedDeck: PropTypes.func,
    id: PropTypes.string,
    loadCards: PropTypes.func.isRequired,
    message: PropTypes.string,
    removeCardFromBuilder: PropTypes.func.isRequired,
    saveDeck: PropTypes.func.isRequired,
    selectedCards: PropTypes.array,
    updateDeck: PropTypes.func
};

function mapStateToProps(state) {
    return {
        cards: state.cards.cards,
        selectedCards: state.deckbuilder.selectedCards,
        selectedDeck: state.deckbuilder.deck
    };
}

export default connect(mapStateToProps, actions)(Deckbuilder);
