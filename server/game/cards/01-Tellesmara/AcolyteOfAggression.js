const Card = require('../../Card.js');

class AcolyteOfAggression extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            match: this,
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.card.type === 'spell'
            },
            gameAction: ability.actions.forRemainderOfTurn(() => ({
                effect: ability.effects.modifyPower(1)
            })),
            effect: 'get +1 power this turn.'
        });
    }
}

AcolyteOfAggression.id = 'acolyteofaggression';

module.exports = AcolyteOfAggression;
