const Card = require('../../Card.js');

class ChaosStorm extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'make both players return their hands into their decks, shuffle the cards and draw 3 cards',
            gameAction: [
                ability.actions.returnToDeck(context => ({
                    shuffle: true,
                    target: context.player.opponent.hand,
                    addMessage: false
                })),
                ability.actions.returnToDeck(context => ({
                    shuffle: true,
                    target: context.player.hand,
                    addMessage: false
                })),
                ability.actions.draw((context) => ({ amount: 3, target: context.player.opponent })),
                ability.actions.draw((context) => ({ amount: 3, target: context.player }))
            ]
        });
    }
}

ChaosStorm.id = 'chaosstorm';

module.exports = ChaosStorm;
