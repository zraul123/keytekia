const Card = require('../../Card.js');

class Absolution extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamage(context => ({
                amount: 3,
                target: context.player.opponent.creaturesInPlay // TODO: Add own creatures too
            }))
        });
    }
}

Absolution.id = 'absolution';

module.exports = Absolution;
