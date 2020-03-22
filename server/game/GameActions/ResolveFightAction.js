const CardGameAction = require('./CardGameAction');

class ResolveFightAction extends CardGameAction {
    setup() {
        this.targetType = ['unit', 'player'];
        this.effectMsg = 'make {1} fight {0}';
        this.effectArgs = this.attacker;
        this.manaCost = 0;
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || !this.attacker) {
            return false;
        } else if(!this.attacker.checkRestrictions('fight') || card.controller === this.attacker.controller) {
            return false;
        } else if(card.controller.guardians.length > 0 && !card.controller.guardians.includes(card)) {
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
        return super.createEvent('onFight', params, event => {
            let damageEvents = [];

            let defenderAmount = event.card.power;
            let defenderParams = {
                amount: defenderAmount,
                attackEvent: event,
                damageSource: event.card
            };

            let attackerAmount = event.attacker.power;
            let attackerParams = {
                amount: attackerAmount,
                attackEvent: event,
                damageSource: event.attacker
            };

            if (event.card.type === 'player') {
                event.card.owner.health -= attackerParams.amount;
                return;
            }

            damageEvents.push(context.game.actions.dealDamage(defenderParams).getEvent(event.defenderTarget, context));
            damageEvents.push(context.game.actions.dealDamage(attackerParams).getEvent(event.attackerTarget, context));

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

module.exports = ResolveFightAction;
