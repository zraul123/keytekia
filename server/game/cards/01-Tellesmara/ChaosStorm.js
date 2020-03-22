const Card = require('../../Card.js');

class ChaosStorm extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.returnToDeck(context => ({target: context.player.opponent.hand})),
                ability.actions.returnToDeck(context => ({target: context.player.hand})),
                ability.actions.draw((context) => ({ amount: 3, target: context.player.opponent })),
                ability.actions.draw((context) => ({ amount: 3, target: context.player }))
            ]
        });
    }
}

ChaosStorm.id = 'chaosstorm';

module.exports = ChaosStorm;
