const Card = require('../../Card.js');

class LibraryVigil extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.draw((context) => ({ amount: 2, target: context.player })),
        });
    }
}

LibraryVigil.id = 'libraryvigil';

module.exports = LibraryVigil;
