const _ = require('underscore');
const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');
const MulliganPrompt = require('./mulliganprompt.js');
const GameStartPrompt = require('./GameStartPrompt');

class SetupPhase extends Phase {
    constructor(game) {
        super(game, 'setup');
        this.initialise([
            new SimpleStep(game, () => this.setupBegin()),
            new GameStartPrompt(game),
            new SimpleStep(game, () => this.drawStartingHands()),
            new MulliganPrompt(game),
            new SimpleStep(game, () => this.startGame())
        ]);
    }

    startPhase() {
        // Don't raise any events without a determined first player
        this.game.currentPhase = this.name;
        for(let step of this.steps) {
            this.game.queueStep(step);
        }
    }

    setupBegin() {
        let allPlayersShuffled = _.shuffle(this.game.getPlayers());
        this.game.activePlayer = allPlayersShuffled.shift();
        for(let card of this.game.allCards) {
            card.applyAnyLocationPersistentEffects();
        }
    }

    drawStartingHands() {
        _.each(this.game.getPlayers(), player => {
            this.game.actions.draw({ refill: true }).resolve(player, this.game.getFrameworkContext());
        });
    }

    startGame() {
        _.each(this.game.getPlayers(), player => {
            player.readyToStart = true;
        });
        this.game.raiseEvent('onGameStarted');
    }
}

module.exports = SetupPhase;
