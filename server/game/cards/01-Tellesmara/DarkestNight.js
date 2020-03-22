const Card = require('../../Card.js');

class DarkestNight extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'unit',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            },
            gameAction: [
                ability.actions.draw((context) => ({ amount: 1, target: context.player.opponent })),
                ability.actions.draw((context) => ({ amount: 1, target: context.player })),
            ]
        })
    }
}

DarkestNight.id = 'darkestnight';

module.exports = DarkestNight;
