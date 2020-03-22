const CardGameAction = require('./CardGameAction');

class ResolveAttackAction extends CardGameAction {
    setup() {
        this.targetType = ['unit', 'player'];
        this.effectMsg = '{1} attacks {0}';
        this.effectArgs = this.attacker;
        this.manaCost = 0;
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || !this.attacker) {
            return false;
        } else if(!this.attacker.checkRestrictions('attack') || card.controller === this.attacker.controller) {
            return false;
        } else if(!card.checkRestrictions('attackDueToTaunt') && !this.attacker.ignores('taunt') && context.stage !== 'effect') {
            return false;
        }

        return card.checkRestrictions(this.name, context) && super.canAffect(card, context);
    }

    getEvent(card, context) {
        let params = {
            card: card,
            context: context,
            condition: event => event.attacker.location === 'play area' && event.card.location === 'play area',
            attacker: this.attacker,
            attackerTarget: card,
            defenderTarget: this.attacker,
            destroyed: []
        };
        return super.createEvent('onAttack', params, event => {
            let damageEvents = [];
            let defenderAmount = event.card.power;
            if(event.card.anyEffect('limitAttackDamage')) {
                defenderAmount = Math.min(defenderAmount, ...event.card.getEffects('limitAttackDamage'));
            }

            let defenderParams = {
                amount: defenderAmount,
                attackEvent: event,
                damageSource: event.card
            };
            let attackerAmount = event.attacker.power + event.attacker.getBonusDamage(event.attackerTarget);
            if(event.attacker.anyEffect('limitAttackDamage')) {
                attackerAmount = Math.min(attackerAmount, ...event.attacker.getEffects('limitAttackDamage'));
            }

            let attackerParams = {
                amount: attackerAmount,
                attackEvent: event,
                damageSource: event.attacker
            };

            if(event.card.type === 'player') {
                event.card.owner.health -= attackerParams.amount;
            }

            if(event.attackerTarget !== event.card && event.attacker.checkRestrictions('dealAttackDamage')) {
                damageEvents.push(context.game.actions.dealDamage(attackerParams).getEvent(event.attackerTarget, context));
            }

            damageEvents.push(context.game.getEvent('unnamedEvent', {}, () => {
                event.card.isFighting = false;
                event.attacker.isFighting = false;
            }));
            event.card.isFighting = true;
            event.attacker.isFighting = true;
            context.game.checkGameState(true);
            event.addSubEvent(damageEvents);
            event.card.elusiveUsed = true;
            context.player.creatureFought = true;
            event.attacker.exhaust();
        });
    }
}

module.exports = ResolveAttackAction;
