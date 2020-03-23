const Card = require('../../Card.js');

class FranticSolution extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'Draw 3 cards, then discard 2 cards.',
            gameAction: [
                ability.actions.draw((context) => ({ amount: 3, target: context.player })),
                ability.actions.chosenDiscard({ amount: 2, controller: 'self' }),
            ]
        });
    }
}

FranticSolution.id = 'franticsolution';

module.exports = FranticSolution;
