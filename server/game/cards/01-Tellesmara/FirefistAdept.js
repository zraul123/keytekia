const Card = require('../../Card.js');

class FirefistAdept extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: [
                ability.actions.dealDamageToPlayer(context => ({
                    amount: 1,
                    target: context.player.opponent
                })),
                ability.actions.dealDamageToPlayer(context => ({
                    amount: 1,
                    target: context.player
                }))
            ]
        })
    }
}

FirefistAdept.id = 'firefistadept';

module.exports = FirefistAdept;
