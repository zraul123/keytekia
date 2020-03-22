const Card = require('../../Card.js');

class PyromancersJoy extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.discard(context => ({target: context.player.hand})),
                ability.actions.draw({ amount: 3 })
            ],
            target: {
                cardType: 'unit',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            }
        })

    }
}

PyromancersJoy.id = 'pyromancersjoy';

module.exports = PyromancersJoy;
