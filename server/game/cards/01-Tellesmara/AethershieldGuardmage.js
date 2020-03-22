const Card = require('../../Card.js');

class AethershieldGuardmage extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => event.card.type === 'spell' && event.player === context.player
            },
            gameAction: ability.actions.dealDamageToPlayer(context => ({
                amount: 1,
                target: context.player.opponent
            }))
        });
    }
}

AethershieldGuardmage.id = 'aethershieldguardmage';

module.exports = AethershieldGuardmage;
