const Card = require('../../Card.js');

class TideTyrant extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'unit',
                gameAction: ability.actions.returnToHand()
            }
        })
    }
}

TideTyrant.id = 'tidetyrant';

module.exports = TideTyrant;
