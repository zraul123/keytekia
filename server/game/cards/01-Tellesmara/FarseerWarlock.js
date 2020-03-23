const Card = require('../../Card.js');

class FarseerWarlock extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            match: this,
            gameAction: ability.actions.forRemainderOfTurn(() => ({
                when: {
                    onDrawCards: (event, context) => event.player === context.player
                },
                message: '{1} gains +1 power.',
                gameAction: ability.effects.modifyPower(1)
            }))
        });
    }
}

FarseerWarlock.id = 'farseerwarlock';

module.exports = FarseerWarlock;
