const PlayerAction = require('./PlayerAction');

class DrawAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.refill = false;
    }

    setup() {
        super.setup();
        this.name = 'draw';
        this.effectMsg = 'draw ' + this.amount + ' cards';
    }

    canAffect(player, context) {
        return (this.amount !== 0 || this.refill) && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        let amount = 0;
        if(this.refill) {
            if(player.maxHandSize > player.hand.length) {
                amount = player.maxHandSize - player.hand.length;
            }

            if(amount > 0) {
                context.game.addMessage('{0} draws {1} cards up to their maximum hand size of {2}', player, amount, player.maxHandSize);
            }
        } else {
            amount = this.amount;
        }

        return super.createEvent('onDrawCards', {
            player: player,
            amount: amount,
            context: context
        }, event => {
            if(event.amount > 0) {
                event.player.drawCardsToHand(amount);
            }
        });
    }
}

module.exports = DrawAction;
