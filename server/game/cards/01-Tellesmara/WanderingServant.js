const Card = require('../../Card.js');

class WanderingServant extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'unit',
                controller: 'self',
                gameAction: ability.actions.ready()
            }
        });
    }
}

WanderingServant.id = 'wanderingservant';

module.exports = WanderingServant;
