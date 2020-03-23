const Card = require('../../Card.js');
const _ = require('underscore');

class SageOfThorns extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.dealDamage(context =>
                ({
                    condition: context.player.opponent.creaturesInPlay.length >= 1,
                    amount: 2,
                    target: context.player.opponent.creaturesInPlay[Math.floor(Math.random() * context.player.opponent.creaturesInPlay.length)]
                })
            )
        });
    }
}

SageOfThorns.id = 'sageofthorns';

module.exports = SageOfThorns;
