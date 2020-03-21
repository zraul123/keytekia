const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');

class SupplyPhase extends Phase {
    constructor(game) {
        super(game, 'supply');
        this.initialise([
            new SimpleStep(game, () => this.drawCards()),
            new SimpleStep(game, () => this.refillMana()),
            new SimpleStep(game, () => this.readyUnits())

        ]);
    }

    refillMana() {
        this.game.actions.gainMana().resolve(this.game.activePlayer, this.game.getFrameworkContext());
    }

    drawCards() {
        this.game.actions.draw().resolve(this.game.activePlayer, this.game.getFrameworkContext());
    }

    readyUnits() {
        this.game.actions.ready().resolve(this.game.activePlayer.cardsInPlay, this.game.getFrameworkContext());
    }
}

module.exports = SupplyPhase;
