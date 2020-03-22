const Card = require('../../Card.js');

class Consideration extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.draw({ amount: 1 }),
                ability.actions.chosenDiscard({ amount: 1, controller: 'self'})
            ]
        })
    }
}

Consideration.id = 'consideration';

module.exports = Consideration;
