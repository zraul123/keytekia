const CardGameAction = require('./CardGameAction');

class PutIntoPlayAction extends CardGameAction {
    setDefaultProperties() {
        this.left = false;
        this.deployIndex = undefined;
        this.myControl = false;
    }

    setup() {
        this.name = 'putIntoPlay';
        this.targetType = ['unit', 'relic'];
        this.effectMsg = 'put {0} into play';
    }

    canAffect(card, context) {
        if(!context || !super.canAffect(card, context)) {
            return false;
        } else if(!context.player) {
            return false;
        } else if(card.location === 'play area') {
            return false;
        }

        return true;
    }

    preEventHandler(context) {
        super.preEventHandler(context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardEntersPlay', { card: card, context: context }, () => {
            let player;
            let control;
            if(card.anyEffect('entersPlayUnderOpponentsControl') && card.owner.opponent) {
                player = card.owner.opponent;
                control = true;
            } else {
                player = this.myControl ? context.player : card.controller;
                control = this.myControl;
            }

            player.moveCard(card, 'play area', { left: this.left, deployIndex: this.deployIndex, myControl: control });
        });
    }
}

module.exports = PutIntoPlayAction;
