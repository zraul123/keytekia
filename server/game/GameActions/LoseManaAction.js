const PlayerAction = require('./PlayerAction');

class LoseManaAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'loseMana';
        this.effectMsg = 'make {0} lose ' + this.amount + ' mana';
    }

    canAffect(player, context) {
        return this.amount && player.mana && super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('onModifyMana', { player: player, amount: this.amount, context: context }, event => event.player.modifyMana(-event.amount));
    }
}

module.exports = LoseManaAction;
