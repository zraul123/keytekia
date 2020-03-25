const Card = require('../../Card.js');

class FarseerWarlock extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onDrawCards: (event, context) => event.player === context.player
            },
            gameAction: ability.actions.addTemporaryToken({type: 'power', amount: 1, turns: 1})
        });
    }
}

FarseerWarlock.id = 'farseerwarlock';

module.exports = FarseerWarlock;
