const Card = require('../../Card.js');

class Electrify extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'unit',
                gameAction: [
                    ability.actions.dealDamage({ amount: 1 }),
                    ability.actions.dealDamageToPlayer(context => ({
                        amount: 1,
                        target: context.player.opponent
                    }))]
            }
        });
    }
}

Electrify.id = 'electrify';

module.exports = Electrify;
