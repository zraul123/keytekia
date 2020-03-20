const Card = require('../../Card.js');

class FranticSolution extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'Draw 3 cards, then discard 2 cards.',
            gameAction: ability.actions.draw({ amount: 3 }),
            then: {
                target: {
                    controller: 'self',
                    location: 'hand',
                    gameAction: ability.actions.discard()
                }
            }
        });
    }
}

FranticSolution.id = 'franticsolution';

module.exports = FranticSolution;
