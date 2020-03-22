const Card = require('../../Card.js');

class LightningStorm extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.dealDamage(context => ({
                    amount: 1,
                    target: context.player.opponent.creaturesInPlay
                })),
                ability.actions.dealDamageToPlayer(context => ({
                    amount: 1,
                    target: context.player.opponent
                }))
            ]
        })
    }
}

LightningStorm.id = 'lightningstorm';

module.exports = LightningStorm;

