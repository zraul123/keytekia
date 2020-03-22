const Card = require('../../Card.js');

class ExplosiveHomunculus extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: [
                ability.actions.dealDamage(context => ({
                    amount: 2,
                    target: context.player.opponent.creaturesInPlay
                })),
                ability.actions.dealDamage(context => ({
                    amount: 2,
                    target: context.player.creaturesInPlay
                }))
            ]
        });
    }
}

ExplosiveHomunculus.id = 'explosivehomunculus';

module.exports = ExplosiveHomunculus;
