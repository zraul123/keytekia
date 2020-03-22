const Card = require('../../Card.js');

class FarseerWarlock extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            effect: 'Farseer Warlock gets +1 power this turn!',
            when: {
                onPhaseStarted: event => event.phase === 'main'
            },
            gameAction: ability.actions.forRemainderOfTurn(context => ({
                when: {
                    onDrawCards: (event, context) => event.player === context.player
                },
                effect: ability.effects.modifyPower(1)
            }))
        });
    }
}

FarseerWarlock.id = 'farseerwarlock';

module.exports = FarseerWarlock;
