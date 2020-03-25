const Card = require('../../Card.js');

class AcolyteOfAggression extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.card.type === 'spell'
            },
            gameAction: ability.actions.addTemporaryToken({type: 'power', amount: 1, turns: 1})
        });
    }
}

AcolyteOfAggression.id = 'acolyteofaggression';

module.exports = AcolyteOfAggression;
