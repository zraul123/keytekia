const Card = require('../../Card.js');

class SeekerOfForbiddenTruth extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => event.card.type === 'spell' && event.player === context.player
            },
            gameAction: ability.actions.ready()
        });
    }
}

SeekerOfForbiddenTruth.id = 'seekerofforbiddentruth';

module.exports = SeekerOfForbiddenTruth;
