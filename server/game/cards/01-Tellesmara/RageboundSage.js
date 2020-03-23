const Card = require('../../Card.js');

class RageboundSage extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onDrawCards: (event, context) => event.player === context.player
            },
            gameAction: [
                ability.actions.dealDamageToPlayer(context => ({
                    amount: 1,
                    target: context.player.opponent
                }))]
        });
    }
}

RageboundSage.id = 'rageboundsage';

module.exports = RageboundSage;
