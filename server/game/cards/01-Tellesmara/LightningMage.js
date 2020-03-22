const Card = require('../../Card.js');

class LightningMage extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => event.card.type === 'spell' && event.player === context.player
            },
            gameAction: [
                ability.actions.dealDamageToPlayer(context => ({
                    amount: 1,
                    target: context.player.opponent
                })),
                ability.actions.dealDamageToPlayer(context => ({
                    amount: 1,
                    target: context.player
                }))]
        });
    }
}

LightningMage.id = 'lightningmage';

module.exports = LightningMage;
