const Card = require('../../Card.js');

class WarboundAcolyte extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                // todo: onAttack() => {}
            },
            gameAction: [
                ability.actions.draw({ amount: 2 }),
                ability.actions.discard(context => ({
                    target: context.player.hand,
                    amount: 3
                }))
            ]
        });
    }
}

WarboundAcolyte.id = 'warboundacolyte';

module.exports = WarboundAcolyte;
