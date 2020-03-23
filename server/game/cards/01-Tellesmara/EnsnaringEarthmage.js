const Card = require('../../Card.js');

class EnsnaringEarthmage extends Card {
    setupCardAbilities(ability) {
        this.beforeAttack({
            target: {
                activePromptTitle: 'Chose a unit to exhaust.',
                cardType: 'unit',
                gameAction: [
                    ability.actions.exhaust()
                ]
            }
        });
    }
}

EnsnaringEarthmage.id = 'ensnaringearthmage';

module.exports = EnsnaringEarthmage;

