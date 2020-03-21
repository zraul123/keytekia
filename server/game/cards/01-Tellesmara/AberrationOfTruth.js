const Card = require('../../Card.js');

class AberrationOfTruth extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            effect: 'Destroyed: draw 2 cards.',
            gameAction: ability.actions.draw({ amount: 2 })
        });
    }
}

AberrationOfTruth.id = 'aberrationoftruth';

module.exports = AberrationOfTruth;
