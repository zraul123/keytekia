const Card = require('../../Card.js');

class FarseerWarlock extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onDrawCards: (event, context) => event.player === context.player
            },
            gameAction: ability.effects.modifyPower(1),
            effect: 'get +1 power this turn'
        });
    }
}

FarseerWarlock.id = 'farseerwarlock';

module.exports = FarseerWarlock;
