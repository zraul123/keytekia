const Card = require('../../Card.js');

class Prepare extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.chosenDiscard({ amount: 2, controller: 'self'}),
                ability.actions.gainMana({amount: 3})
            ]
        });
    }
}

Prepare.id = 'prepare';

module.exports = Prepare;
