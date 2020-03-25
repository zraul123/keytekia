const CardGameAction = require('./CardGameAction');

class AddTemporaryTokenAction extends CardGameAction {
    setDefaultProperties() {
        this.location = 'play area';
        this.amount = 0;
        this.type = '';
        this.turns = 1;
    }

    setup() {
        super.setup();
        this.name = 'addTemporaryToken';
        this.effectMsg = `adds ${this.amount} ${this.type} for ${this.turns}`;
    }

    canAffect(card, context) {
        return true;
        if(card.location !== this.location || this.amount === 0 || this.type === '') {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent("onReceiveToken", { 
            card: card,
            player: card.owner,
            context: context,
            amount: this.amount,
            type: this.type,
            turns: this.turns
        }, event => {
            
            event.card.addTemporaryToken(event.type, event.amount, event.turns)
        })
    }
}

module.exports = AddTemporaryTokenAction;
