const Card = require('../../Card.js');

class WarboundAcolyte extends Card {
    setupCardAbilities(ability) {
        this.beforeAttack({
            gameAction: ability.actions.draw({ amount: 2 }),
            then: {
                gameAction: ability.actions.chosenDiscard({
                    controller: 'self',
                    amount: 3
                })
            }
        });
    }
}

WarboundAcolyte.id = 'warboundacolyte';

module.exports = WarboundAcolyte;
