const Card = require('../../Card.js');

class WallOfAether extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => event.card.type === 'spell' && event.player === context.player
            },
            gameAction: () => ability.actions.heal({ fully: true })
        });
    }
}

WallOfAether.id = 'wallofaether';

module.exports = WallOfAether;
