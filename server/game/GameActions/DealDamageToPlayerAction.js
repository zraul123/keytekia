const PlayerAction = require('./PlayerAction');

class DealDamageToPlayerAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'loseHealth';
        this.effectMsg = 'make {0} lose ' + this.amount + ' health';
    }

    canAffect(player, context) {
        return this.amount && player.health && super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('onLoseHealth', {
            player: player,
            amount: this.amount,
            context: context
        }, event => event.player.dealDamage(event.amount)
        );
    }
}

module.exports = DealDamageToPlayerAction;
