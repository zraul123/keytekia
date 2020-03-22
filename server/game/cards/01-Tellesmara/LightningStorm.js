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
                })),
                ability.actions.dealDamage(context => ({
                    amount: 1,
                    target: context.player.creaturesInPlay
                })),
                ability.actions.dealDamageToPlayer(context => ({
                    amount: 1,
                    target: context.player
                }))
            ]
        })
    }
}

LightningStorm.id = 'lightningstorm';

module.exports = LightningStorm;

