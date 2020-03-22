const Card = require('../../Card.js');

class FormOfTheMirage extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'unit',
                controller: 'self',
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

FormOfTheMirage.id = 'formofthemirage';

module.exports = FormOfTheMirage;
