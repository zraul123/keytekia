const Card = require('../../Card.js');

class Combust extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Chose a unit to deal 2 damage.',
                cardType: 'unit',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

Combust.id = 'combust';

module.exports = Combust;
