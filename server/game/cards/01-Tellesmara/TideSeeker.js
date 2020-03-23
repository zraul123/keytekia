const Card = require('../../Card.js');

class TideSeeker extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: 'unit',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.exhaust(),
                    ability.actions.draw((context) => ({ amount: 1, target: context.player }))
                ])
            },
            effect: 'exhaust {0}. Draw a card.'
        });
    }
}

TideSeeker.id = 'tideseeker';

module.exports = TideSeeker;
