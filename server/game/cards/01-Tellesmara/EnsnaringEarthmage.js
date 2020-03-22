const Card = require('../../Card.js');

class BurnAlive extends Card {
    setupCardAbilities(ability) {
        this.fight({
            target: {
                cardType: 'unit',
                gameAction: ability.actions.exhaust()
            }
        })
    }
}

BurnAlive.id = 'burnalive';

module.exports = BurnAlive;

