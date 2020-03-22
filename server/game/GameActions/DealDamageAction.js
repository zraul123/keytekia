const CardGameAction = require('./CardGameAction');

class DealDamageAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = null;
        this.amountForCard = () => 1;
        this.attackEvent = null;
        this.damageSource = null;
        this.damageType = 'card effect';
        this.splash = 0;
        this.purge = false;
    }

    setup() {
        this.targetType = ['unit'];
        this.name = 'damage';
        this.effectMsg = 'deal ' + (this.amount ? this.amount + ' ' : '') + 'damage to {0}' + (this.splash ? ' and ' + this.splash + ' to their neighbors' : '');
    }

    canAffect(card, context) {
        if(this.amount === 0 || !this.amount && this.amountForCard(card, context) === 0) {
            return false;
        }

        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEventArray(context) {
        if(this.splash) {
            return this.target.filter(card => this.canAffect(card, context)).reduce((array, card) => (
                array.concat(this.getEvent(card, context), card.neighbors.map(neighbor => this.getEvent(neighbor, context, this.splash)))
            ), []);
        }

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

            if(amount === 0) {
                return;
            }

            if (event.damageSource && typeof event.damageSource.hasKeyword === 'function') {
                if (event.damageSource.hasKeyword('Overtake')) {
                    let remainingHealth = event.card.health - event.card.getToken('damage');
                    let damageOverflow = amount - remainingHealth;
                    if (damageOverflow > 0) {
                        event.card.owner.health -= damageOverflow;
                    }
                }
            }

            event.card.addToken('damage', amount);
        });
    }
}

module.exports = DealDamageAction;
