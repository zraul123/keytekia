const Card = require('../../Card.js');

class Amplification extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.draw({ amount: 2 }),
                ability.actions.chosenDiscard({ amount: 2, controller: 'self' })
            ]
        });
    }
}

Amplification.id = 'amplification';

module.exports = Amplification;
