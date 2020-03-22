const Card = require('../../Card.js');

class SteelResolve extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'unit',
                controller: 'self',
                gameAction: ability.actions.heal({ fully: true })
            }
        })
    }
}

SteelResolve.id = 'steelresolve';

module.exports = SteelResolve;
