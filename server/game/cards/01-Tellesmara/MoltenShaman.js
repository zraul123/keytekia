const Card = require('../../Card.js');

class MoltenShaman extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            gameAction: [
                ability.actions.forRemainderOfTurn(() => ({
                    when: {
                        onCardPlayed: event => event.card.type === 'spell'
                    },
                    effect: ability.effects.modifyPower(1)
                }))
            ]
        });
    }
}

MoltenShaman.id = 'moltenshaman';

module.exports = MoltenShaman;
