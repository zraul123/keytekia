const Card = require('../../Card.js');

class AntiqueHoarder extends Card {
    setupCardAbilities(ability) {
        this.attack({
            target: {
                activePromptTitle: 'Chose a unit to deal 1 damage.',
                cardType: 'unit',
                gameAction: [
                    ability.actions.dealDamage({ amount: 1 })
                ]
            }
        });
    }
}

AntiqueHoarder.id = 'antiquehoarder';

module.exports = AntiqueHoarder;
