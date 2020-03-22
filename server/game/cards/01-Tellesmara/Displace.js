const Card = require('../../Card.js');

class Displace extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'unit',
                controller: 'self',
                gameAction: ability.actions.returnToHand()
            },
            gameAction: ability.actions.draw({ amount: 1 })
        })
    }
}

Displace.id = 'displace';

module.exports = Displace;
