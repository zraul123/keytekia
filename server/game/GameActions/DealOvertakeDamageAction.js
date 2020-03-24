const CardGameAction = require('./CardGameAction');

class DealOvertakeDamageAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = null;
        this.amountForCard = (card, context) => 0;
        this.attackEvent = null;
        this.damageSource = null;
        this.damageType = 'card effect';
    }

    setup() {
        this.targetType = ['unit'];
        this.name = 'damage';
        this.effectMsg = 'deal ' + this.amount + 'damage to {0}';
    }

    canAffect(card, context) {
        if(this.amount === 0 || !this.amount && this.amountForCard(card, context) === 0) {
            return false;
        }

        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEventArray(context) {
        return super.getEventArray(context);
    }

    getEvent(card, context, amount = this.amount || this.amountForCard(card, context)) {
        const params = {
            card: card,
            context: context,
            amount: amount,
            damageSource: this.damageSource,
            damageType: this.damageType,
            destroyed: false,
            attackEvent: this.attackEvent
        };


        return super.createEvent('onDamageDealt', params, event => {
            let amount = event.amount;

            if(!amount) {
                return;
            }

            if(event.context.source && event.context.source.keywords.includes('Overtake')) {
                let remainingHealth = event.card.health - event.card.getToken('damage');
                let damageOverflow = amount - remainingHealth;
                if(damageOverflow > 0) {
                    event.card.owner.health -= damageOverflow;
                }
            }

            event.card.addToken('damage', amount);
        });
    }
}

module.exports = DealOvertakeDamageAction;
