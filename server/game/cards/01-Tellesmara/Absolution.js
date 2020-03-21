const Card = require('../../Card.js');

class Absolution extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 3 damage to all Units.',
            gameAction: ability.actions.dealDamage(context => ({
                amount: 3,
                target: context.game.creaturesInPlay
            }))
        });
    }
}

Absolution.id = 'absolution';

module.exports = Absolution;
