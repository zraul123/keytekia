const Card = require('../../Card.js');

class MoltenShaman extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            effect: 'Molten shaman gets +1 power this turn!',
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

MoltenShaman.id = 'moltenshaman';

module.exports = MoltenShaman;
