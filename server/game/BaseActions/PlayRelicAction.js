const BasePlayAction = require('./BasePlayAction');

class PlayRelic extends BasePlayAction {
    constructor(card) {
        super(card);
        this.title = 'Play this relic';
        this.manaCost = card.mana;
    }

    executeHandler(context) {
        if (context.player.playIfEnoughMana(this.manaCost)) {
            let cardPlayedEvent = context.game.getEvent('onCardPlayed', {
                player: context.player,
                card: context.source,
                originalLocation: context.source.location
            });
            context.game.openEventWindow([context.game.actions.putIntoPlay({ myControl: true }).getEvent(context.source, context), cardPlayedEvent]);
        }
    }
}

module.exports = PlayRelic;

