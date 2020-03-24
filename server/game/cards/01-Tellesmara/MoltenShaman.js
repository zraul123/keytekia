const Card = require('../../Card.js');

class MoltenShaman extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.card.type === 'spell'
            },
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                match: context.source === this,
                effect: ability.effects.modifyPower(1)
            })),
            effect: 'get +1 power this turn.'
        });
    }
}

MoltenShaman.id = 'moltenshaman';

module.exports = MoltenShaman;
