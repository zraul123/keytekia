const Card = require('../../Card.js');

class LibraryVigil extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            effect: 'draw 2 cards',
            gameAction: ability.actions.draw({
                amount: 2
            })
        });
    }
}

LibraryVigil.id = 'libraryvigil';

module.exports = LibraryVigil;
