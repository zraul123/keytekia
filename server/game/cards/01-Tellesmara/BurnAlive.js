const Card = require('../../Card.js');

class BurnAlive extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'unit',
                gameAction: ability.actions.dealDamage({ amount: 5 })
            }
        })
    }
}

BurnAlive.id = 'burnalive';

module.exports = BurnAlive;

