const Card = require('../../Card.js');

class MendingShaman extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => event.card.type === 'spell' && event.player === context.player
            },
            gameAction: ability.actions.heal()
        });
    }
}

MendingShaman.id = 'mendingshaman';

module.exports = MendingShaman;
