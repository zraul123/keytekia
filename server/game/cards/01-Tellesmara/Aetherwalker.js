const Card = require('../../Card.js');

class Aetherwalker extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.draw({ amount: 1 }),
                ability.actions.chosenDiscard({ amount: 1, controller: 'self'})
            ]
        })
    }
}

Aetherwalker.id = 'aetherwalker';

module.exports = Aetherwalker;
