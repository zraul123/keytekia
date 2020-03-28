const PlayerAction = require('./PlayerAction');

class GainManaAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 5;
        this.refill = false;
    }

    setup() {
        super.setup();
        this.name = 'modifyMana';
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        context.game.addMessage('{0} refills {1} mana.', player, this.amount);

        let params = {
            player: player,
            amount: this.amount,
            context: context
        };
        return super.createEvent('onModifyMana', params, event => {
            if(this.refill) {
                player.mana = 5;
            } else {
                player.mana = player.mana + event.amount;
            }
        });
    }

}

module.exports = GainManaAction;
