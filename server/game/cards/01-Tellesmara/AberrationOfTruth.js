const Card = require('../../Card.js');

class AberrationOfTruth extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: [
                ability.actions.draw({ amount: 1 })
            ]
        });
    }
}

AberrationOfTruth.id = 'aberrationoftruth';

module.exports = AberrationOfTruth;
