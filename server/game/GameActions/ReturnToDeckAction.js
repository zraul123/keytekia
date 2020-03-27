const CardGameAction = require('./CardGameAction');

class ReturnToDeckAction extends CardGameAction {
    setDefaultProperties() {
        this.bottom = false;
        this.shuffle = false;
        this.addMessage = true;
    }

    setup() {
        super.setup();
        this.name = 'returnToDeck';
        if(this.shuffle) {
            this.effectMsg = 'return {0} to their deck';
        } else {
            this.effectMsg = 'return {0} to the ' + (this.bottom ? 'bottom' : 'top') + ' of their deck';
        }
    }

    getEvent(card, context) {
        let eventName = (card.location === 'play area') ? 'onCardLeavesPlay' : 'onMoveCard';

        return super.createEvent(eventName, { card: card, context: context }, () => {
            card.owner.moveCard(card, 'deck', { bottom: this.bottom });
            if(this.shuffle) {
                card.owner.shuffleDeck(this.addMessage);
            }
        });
    }
}

module.exports = ReturnToDeckAction;
