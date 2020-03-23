const Card = require('../../Card.js');

class AcolyteOfAggression extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            effect: 'get +1 power this turn',
            when: {
                onPhaseStarted: event => event.phase === 'main'
            },
            gameAction: ability.actions.forRemainderOfTurn(context => ({
                when: {
                    onCardPlayed: event => event.card.type === 'spell' && context.player === event.player
                },
                effect: ability.effects.modifyPower(1)
            }))
        });
    }
}

AcolyteOfAggression.id = 'acolyteofaggression';

module.exports = AcolyteOfAggression;
