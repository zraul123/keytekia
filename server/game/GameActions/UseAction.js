const CardGameAction = require('./CardGameAction');

class UseAction extends CardGameAction {
    setDefaultProperties() {
        this.ignoreHouse = true;
    }

    setup() {
        this.name = 'use';
        this.targetType = ['unit', 'relic'];
        this.effectMsg = 'use {0}';
    }

    canAffect(card, context) {
        return card !== context.source && card.location === 'play area' &&
            super.canAffect(card, context);
    }


    getEvent(card, context) {
        return super.createEvent('onUseCard', { card: card, context: context }, event =>
            card.use(context.player));
    }
}

module.exports = UseAction;
