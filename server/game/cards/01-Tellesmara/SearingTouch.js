const Card = require('../../Card.js');

class SearingTouch extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'unit',
                gameAction: ability.actions.dealDamage({ amount: 1})
            }
        })
    }
}

SearingTouch.id = 'searingtouch';

module.exports = SearingTouch;
