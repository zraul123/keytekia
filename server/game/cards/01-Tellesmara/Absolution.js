const Card = require('../../Card.js');

class Absolution extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.dealDamage(context => ({
                amount: 3,
                target: context.player.opponent.creaturesInPlay
            })),
                ability.actions.dealDamage(context => ({
                amount: 3,
                target: context.player.creaturesInPlay
            }))]
        });
    }
}

Absolution.id = 'absolution';

module.exports = Absolution;
