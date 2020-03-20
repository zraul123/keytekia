const Card = require('../../Card.js');

class Combust extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'unit',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

Combust.id = 'combust';

module.exports = Combust;
