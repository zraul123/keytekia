const Card = require('../../Card.js');

class BurnAlive extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Chose a unit to deal 5 damage.',
                cardType: 'unit',
                gameAction: ability.actions.dealDamage({ amount: 5 })
            }
        });
    }
}

BurnAlive.id = 'burnalive';

module.exports = BurnAlive;

