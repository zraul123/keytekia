const Card = require('../../Card.js');

class Transmute extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'unit',
                controller: 'opponent',
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

Transmute.id = 'transmute';

module.exports = Transmute;
