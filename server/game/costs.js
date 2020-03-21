const Costs = {
    exhaust: () => ({
        canPay: context => !context.source.exhausted,
        payEvent: context => context.game.actions.exhaust().getEvent(context.source, context)
    }),
    use: () => ({
        canPay: context => {
            if(context.game.cardsUsed.concat(context.game.cardsPlayed).filter(card => card.name === context.source.name).length >= 6) {
                return false;
            } else if(context.player.getEffects('canUse').some(match => match(context))) {
                return true;
            }

            return true;
        },
        payEvent: context => context.game.getEvent('unnamedEvent', {}, () => {
            context.game.cardsUsed.push(context.source);
            return context.player.getEffects('canUse').some(match => match(context));
        })
    }),
    play: () => ({
        canPay: context => {
            if(context.source.getKeywordValue('alpha') > 0 && !context.game.firstThingThisTurn()) {
                return false;
            } else if(context.game.cardsUsed.concat(context.game.cardsPlayed).filter(card => card.name === context.source.name).length >= 6) {
                return false;
            }

            return true;
        },
        payEvent: context => context.game.getEvent('unnamedEvent', {}, () => {
            context.game.cardsPlayed.push(context.source);
            return context.player.getEffects('canPlay').some(match => match(context.source, context));
        })
    })
};

module.exports = Costs;
