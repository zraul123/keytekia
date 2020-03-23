const Card = require('../../Card.js');

class HeadmastersScorn extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'unit',
                gameAction: ability.actions.destroy()
            }
        });
    }
}

HeadmastersScorn.id = 'headmastersscorn';

module.exports = HeadmastersScorn;
