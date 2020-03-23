const Card = require('../../Card.js');

class HerosRecall extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'unit',
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

HerosRecall.id = 'herosrecall';

module.exports = HerosRecall;
