const Card = require('../../Card.js');

class CollectThoughts extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.draw((context) => ({ amount: 2, target: context.player.opponent })),
                ability.actions.draw((context) => ({ amount: 2, target: context.player })),
            ]
        })
    }
}

CollectThoughts.id = 'collectthoughts';

module.exports = CollectThoughts;
