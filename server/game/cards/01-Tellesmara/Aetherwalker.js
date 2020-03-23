const Card = require('../../Card.js');

class Aetherwalker extends Card {
    setupCardAbilities(ability) {
        this.beforeAttack({
            gameAction: [
                ability.actions.draw((context) => ({ amount: 1, target: context.player })),
                ability.actions.chosenDiscard({ amount: 1, controller: 'self' })
            ]
        });
    }
}

Aetherwalker.id = 'aetherwalker';

module.exports = Aetherwalker;
