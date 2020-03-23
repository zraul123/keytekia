const Card = require('../../Card.js');

class SurgeOfBrilliance extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.discard(context => ({target: context.player.hand})),
                ability.actions.dealDamageToPlayer(context => ({
                    amount: 7,
                    target: context.player.opponent
                }))
            ]
        });
    }
}

SurgeOfBrilliance.id = 'surgeofbrilliance';

module.exports = SurgeOfBrilliance;
