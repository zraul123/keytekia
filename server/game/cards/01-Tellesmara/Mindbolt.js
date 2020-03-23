const Card = require('../../Card.js');

class Mindbolt extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamageToPlayer(context => ({
                    amount: context.player.hand.length,
                    target: context.player.opponent
                }))
        });
    }
}

Mindbolt.id = 'mindbolt';

module.exports = Mindbolt;
