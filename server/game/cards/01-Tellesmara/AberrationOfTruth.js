const Card = require('../../Card.js');

class AberrationOfTruth extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.draw((context) => ({ amount: 1, target: context.player }))
        })
    }
}

AberrationOfTruth.id = 'aberrationoftruth';

module.exports = AberrationOfTruth;
