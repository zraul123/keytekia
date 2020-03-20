const Card = require('../../Card.js');

class Reveal extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'draw 2 cards',
            gameAction: ability.actions.draw({ amount: 2 })
        });
    }
}

Reveal.id = 'reveal';

module.exports = Reveal;
