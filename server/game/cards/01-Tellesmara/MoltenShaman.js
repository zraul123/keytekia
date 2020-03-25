const Card = require('../../Card.js');

class MoltenShaman extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.card.type === 'spell'
            },
            gameAction: ability.actions.addTemporaryToken({type: 'power', amount: 1, turns: 1})
        });
    }
}

MoltenShaman.id = 'moltenshaman';

module.exports = MoltenShaman;
