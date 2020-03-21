const CardGameAction = require('./CardGameAction');

class AttackGameAction extends CardGameAction {
    setup() {
        this.name = 'attack';
        this.targetType = ['unit', 'player'];
        this.effectMsg = 'attack with {0}';
    }

    canAffect(card, context) {
        let attackAction = card.getAttackAction();
        let newContext = attackAction.createContext(context.player);
        if(!attackAction || attackAction.meetsRequirements(newContext)) {
            return false;
        }

        return card.checkRestrictions('use', context) && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onInitiateAttack', { card, context }, () => {
            let newContext;
            let attackAction = card.getAttackAction();
            newContext = attackAction.createContext(context.player);

            newContext.canCancel = false;
            context.game.resolveAbility(newContext);
            context.game.raiseEvent('onUseCard', { card: card, context: context });
        });
    }
}

module.exports = AttackGameAction;
