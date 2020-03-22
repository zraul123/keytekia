const Card = require('../../Card.js');

class SoullessSorcerer extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.gainMana({amount: 2})
        });
    }
}

SoullessSorcerer.id = 'soullesssorcerer';

module.exports = SoullessSorcerer;
