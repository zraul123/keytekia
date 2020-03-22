const Card = require('../../Card.js');

class SageOfThorns extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            target: {
                cardType: 'unit',
                gameAction: ability.actions.dealDamage({ amoung: 2 })
            }
        })
    }
}

SageOfThorns.id = 'sageofthorns';

module.exports = SageOfThorns;
