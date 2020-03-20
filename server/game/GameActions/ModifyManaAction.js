const PlayerAction = require('./PlayerAction');

class ModifyManaAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = this.amount >= 0 ? 'gainMana' : 'spendMana';
        this.effectMsg = (this.amount >= 0 ? 'gain ' : 'lose ') + this.amount.toString() + ' mana';
    }

    canAffect(player, context) {
        return this.amount !== 0 && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent('onModifyMana', { player: player, amount: this.amount, context: context }, () => {
            if(player.anyEffect('redirectMana')) {
                player.mostRecentEffect('redirectMana').addToken('mana', this.amount);
            } else {
                player.modifyAmber(this.amount);
            }
        });
    }
}

module.exports = ModifyManaAction;
