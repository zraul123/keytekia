const _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const CardAction = require('./cardaction.js');
const EffectSource = require('./EffectSource.js');
const TriggeredAbility = require('./triggeredability');

const DiscardAction = require('./BaseActions/DiscardAction');
const PlaySpell = require('./BaseActions/PlaySpell');
const PlayCreatureAction = require('./BaseActions/PlayCreatureAction');
const PlayRelicAction = require('./BaseActions/PlayRelicAction');
const ResolveFightAction = require('./GameActions/ResolveFightAction');
const ResolveAttackAction = require('./GameActions/ResolveAttackAction');
const ResolveReapAction = require('./GameActions/ResolveReapAction');
const RemoveStun = require('./BaseActions/RemoveStun');

const locationActions = {
    'unit': PlayCreatureAction,
    'relic': PlayRelicAction,
    'spell': PlaySpell
}

const actionTypes = {
    'playcard': 'PLAY',
    'usecard' : 'USE',
    'default' : 'NONE'
}

class Card extends EffectSource {
    constructor(owner, cardData) {
        super(owner.game);
        this.owner = owner;
        this.cardData = cardData;

        this.id = cardData.id;
        this.printedName = cardData.name;
        this.mana = cardData.mana;
        this.image = cardData.image;
        this.setDefaultController(owner);

        this.printedType = cardData.type;

        this.tokens = {};

        this.abilities = {
            actions: [],
            reactions: [],
            persistentEffects: [],
            keywordReactions: [],
            keywordPersistentEffects: []
        };
        this.traits = cardData.traits || [];
        this.printedKeywords = {};
        for(let keyword of cardData.keywords || []) {
            let split = keyword.split(':');
            let value = 1;
            if(split.length > 1) {
                value = parseInt(split[1]);
            }

            this.printedKeywords[split[0]] = value;
            this.persistentEffect({
                location: 'any',
                match: this,
                effect: AbilityDsl.effects.addKeyword({ [split[0]]: value })
            });
        }

        this.printedFaction = cardData.faction;
        this.mana = cardData.mana;

        this.parent = null;
        this.childCards = [];

        this.printedPower = cardData.power;
        this.printedArmor = cardData.armor;
        this.armorUsed = 0;
        this.exhausted = false;
        this.stunned = false;
        this.isAttacking = false;
        this.resting = true;

        this.locale = cardData.locale;

        this.menu = [
            { command: 'attack', text: 'Exhaust/Ready' },
            { command: 'stun', text: 'Stun/Remove Stun' },
            { command: 'control', text: 'Give control' }
        ];

        this.endRound();
    }

    get name() {
        const copyEffect = this.mostRecentEffect('copyCard');
        return copyEffect ? copyEffect.printedName : this.printedName;
    }

    get type() {
        return this.mostRecentEffect('changeType') || this.printedType;
    }

    get actions() {
        if(this.isBlank()) {
            return [];
        }

        let actions = this.abilities.actions;
        if(this.anyEffect('copyCard')) {
            let mostRecentEffect = _.last(this.effects.filter(effect => effect.type === 'copyCard'));
            actions = mostRecentEffect.value.getActions(this);
        }

        let effectActions = this.getEffects('gainAbility').filter(ability => ability.abilityType === 'action');
        return actions.concat(effectActions);
    }

    get reactions() {
        if(this.isBlank()) {
            return this.abilities.keywordReactions;
        }

        const TriggeredAbilityTypes = ['interrupt', 'reaction', 'constant'];
        let reactions = this.abilities.reactions;
        if(this.anyEffect('copyCard')) {
            let mostRecentEffect = _.last(this.effects.filter(effect => effect.type === 'copyCard'));
            reactions = mostRecentEffect.value.getReactions(this);
        }

        let effectReactions = this.getEffects('gainAbility').filter(ability => TriggeredAbilityTypes.includes(ability.abilityType));
        return reactions.concat(this.abilities.keywordReactions, effectReactions);
    }

    get persistentEffects() {
        if(this.isBlank()) {
            return this.abilities.keywordPersistentEffects;
        }

        let persistentEffects = this.abilities.persistentEffects;
        if(this.anyEffect('copyCard')) {
            let mostRecentEffect = _.last(this.effects.filter(effect => effect.type === 'copyCard'));
            persistentEffects = mostRecentEffect.value.getPersistentEffects(this);
        }

        let gainedPersistentEffects = this.getEffects('gainAbility').filter(ability => ability.abilityType === 'persistentEffect');
        return persistentEffects.concat(this.abilities.keywordPersistentEffects, gainedPersistentEffects);
    }

    setupAbilities() {
        this.setupKeywordAbilities(AbilityDsl);
        this.setupCardAbilities(AbilityDsl);
    }

    /**
     * Create card abilities by calling subsequent methods with appropriate properties
     * @param ability - object containing limits, costs, effects, and game actions
     */
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
    }

    setupKeywordAbilities(ability) {
        // Taunt
        this.abilities.keywordPersistentEffects.push(this.persistentEffect({
            condition: () => !!this.getKeywordValue('taunt') && this.type === 'creature',
            printedAbility: false,
            effect: ability.effects.cardCannot('attackDueToTaunt')
        }));

        // Invulnerable
        this.abilities.keywordPersistentEffects.push(this.persistentEffect({
            condition: () => !!this.getKeywordValue('invulnerable'),
            printedAbility: false,
            match: this,
            effect: [
                ability.effects.cardCannot('damage'),
                ability.effects.cardCannot('destroy')
            ]
        }));
    }

    play(properties) {
        if(this.type === 'spell') {
            properties.location = properties.location || 'being played';
        }

        return this.reaction(Object.assign({ play: true, name: 'Play' }, properties));
    }

    attack(properties) {
        return this.reaction(Object.assign({ attack: true, name: 'Attack' }, properties));
    }

    fight(properties) {
        return this.reaction(Object.assign({ fight: true, name: 'Fight' }, properties));
    }

    reap(properties) {
        return this.reaction(Object.assign({ reap: true, name: 'Reap' }, properties));
    }

    destroyed(properties) {
        return this.interrupt(Object.assign({ when: { onCardDestroyed: (event, context) => event.card === context.source } }, properties));
    }

    leavesPlay(properties) {
        return this.interrupt(Object.assign({ when: { onCardLeavesPlay: (event, context) => event.card === context.source } }, properties));
    }

    action(properties) {
        const action = new CardAction(this.game, this, properties);
        if(action.printedAbility) {
            this.abilities.actions.push(action);
        }

        return action;
    }


    beforeFight(properties) {
        return this.interrupt(Object.assign({ when: { onFight: (event, context) => event.attacker === context.source } }, properties));
    }

    triggeredAbility(abilityType, properties) {
        const ability = new TriggeredAbility(this.game, this, abilityType, properties);
        if(ability.printedAbility) {
            this.abilities.reactions.push(ability);
        }

        return ability;
    }

    constantReaction(properties) {
        return this.triggeredAbility('constant', properties);
    }

    reaction(properties) {
        if(properties.play || properties.fight || properties.reap) {
            properties.when = {
                onCardPlayed: (event, context) => event.card === context.source,
                onFight: (event, context) => event.attacker === context.source,
                onReap: (event, context) => event.card === context.source
            };
        }

        return this.triggeredAbility('reaction', properties);
    }

    interrupt(properties) {
        return this.triggeredAbility('interrupt', properties);
    }

    /**
     * Applies an effect that continues as long as the card providing the effect
     * is both in play and not blank.
     */
    persistentEffect(properties) {
        const allowedLocations = ['any', 'play area'];
        let location = properties.location || 'play area';
        if(!allowedLocations.includes(location)) {
            throw new Error(`'${location}' is not a supported effect location.`);
        }

        let ability = _.extend({ abilityType: 'persistentEffect', duration: 'persistentEffect', location: location, printedAbility: true }, properties);
        if(ability.printedAbility) {
            this.abilities.persistentEffects.push(ability);
        }

        return ability;
    }

    hasTrait(trait) {
        if(!trait) {
            return false;
        }

        trait = trait.toLowerCase();
        return this.getTraits().includes(trait);
    }

    getTraits() {
        let copyEffect = this.mostRecentEffect('copyCard');
        let traits = copyEffect ? copyEffect.traits : this.traits;
        return _.uniq(traits.concat(this.getEffects('addTrait')));
    }

    applyAnyLocationPersistentEffects() {
        _.each(this.persistentEffects, effect => {
            if(effect.location === 'any') {
                effect.ref = this.addEffectToEngine(effect);
            }
        });
    }

    onLeavesPlay() {
        if(this.type === 'unit' && this.hasToken('amber') && this.controller.opponent) {
            this.game.actions.gainAmber({ amount: this.tokens.amber }).resolve(this.controller.opponent, this.game.getFrameworkContext());
        }

        this.exhausted = false;
        this.stunned = false;
        this.moribund = false;
        this.new = false;
        this.tokens = {};
        this.setDefaultController(this.owner);
        this.endRound();
    }

    endRound() {
        this.armorUsed = 0;
        this.elusiveUsed = false;
    }

    updateAbilityEvents(from, to) {
        _.each(this.reactions, reaction => {
            if(reaction.location.includes(to) && !reaction.location.includes(from)) {
                reaction.registerEvents();
            } else if(!reaction.location.includes(to) && reaction.location.includes(from)) {
                reaction.unregisterEvents();
            }
        });
    }

    updateEffects(from = '', to = '') {
        if(from === 'play area' || from === 'being played') {
            this.removeLastingEffects();
        }

        _.each(this.persistentEffects, effect => {
            if(effect.location !== 'any') {
                if(to === 'play area' && from !== 'play area') {
                    effect.ref = this.addEffectToEngine(effect);
                } else if(to !== 'play area' && from === 'play area') {
                    this.removeEffectFromEngine(effect.ref);
                    effect.ref = [];
                }
            }
        });
    }

    updateEffectContexts() {
        for(const effect of this.persistentEffects) {
            if(effect.ref) {
                for(let e of effect.ref) {
                    e.refreshContext();
                }
            }
        }
    }

    moveTo(targetLocation) {
        let originalLocation = this.location;

        this.location = targetLocation;

        if(['play area', 'discard', 'hand'].includes(targetLocation)) {
            this.facedown = false;
        }

        if(originalLocation !== targetLocation && this.type !== 'player') {
            this.updateAbilityEvents(originalLocation, targetLocation);
            this.updateEffects(originalLocation, targetLocation);
            this.game.emitEvent('onCardMoved', { card: this, originalLocation: originalLocation, newLocation: targetLocation });
        }
    }

    getMenu() {
        var menu = [];

        if(!this.menu.length || !this.game.manualMode || this.location !== 'play area') {
            return undefined;
        }

        if(this.facedown) {
            return [{ command: 'reveal', text: 'Reveal' }];
        }

        menu.push({ command: 'click', text: 'Select Card' });
        if(this.location === 'play area') {
            menu = menu.concat(this.menu);
        }

        return menu;
    }

    checkRestrictions(actionType, context = null) {
        return super.checkRestrictions(actionType, context) &&
                (!context ||
                !context.player ||
                context.player.checkRestrictions(actionType, context)
                );
    }


    addToken(type, number = 1) {
        if(!number || !Number.isInteger(number)) {
            return;
        }

        if(_.isUndefined(this.tokens[type])) {
            this.tokens[type] = 0;
        }

        this.tokens[type] += number;
    }

    hasToken(type) {
        return !!this.tokens[type];
    }

    removeToken(type, number = this.tokens[type]) {
        if(!this.tokens[type]) {
            return;
        }

        this.tokens[type] -= number;

        if(this.tokens[type] < 0) {
            this.tokens[type] = 0;
        }

        if(this.tokens[type] === 0) {
            delete this.tokens[type];
        }
    }

    clearToken(type) {
        if(this.tokens[type]) {
            delete this.tokens[type];
        }
    }

    isBlank() {
        return this.anyEffect('blank');
    }

    hasKeyword(keyword) {
        return !!this.getKeywordValue(keyword);
    }

    getKeywordValue(keyword) {
        keyword = keyword.toLowerCase();
        if(this.getEffects('removeKeyword').includes(keyword)) {
            return 0;
        }

        return this.getEffects('addKeyword').reduce((total, keywords) => total + (keywords[keyword] ? keywords[keyword] : 0), 0);
    }

    createSnapshot() {
        let clone = new Card(this.owner, this.cardData);
        clone.effects = _.clone(this.effects);
        clone.tokens = _.clone(this.tokens);
        clone.controller = this.controller;
        clone.exhausted = this.exhausted;
        clone.location = this.location;
        clone.parent = this.parent;
        clone.traits = this.getTraits();
        return clone;
    }

    get power() {
        return this.getPower();
    }

    getPower(printed = false) {
        if(printed) {
            return this.printedPower;
        }

        const copyEffect = this.mostRecentEffect('copyCard');
        const printedPower = copyEffect ? copyEffect.printedPower : this.printedPower;
        return printedPower + this.sumEffects('modifyPower') + (this.hasToken('power') ? this.tokens.power : 0);
    }

    getBonusDamage(target) {
        let effects = this.getEffects('bonusDamage');
        return effects.reduce((total, match) => total + match(target), 0);
    }

    get armor() {
        return this.getArmor();
    }

    getArmor(printed = false) {
        if(printed) {
            return this.printedArmor;
        }

        const copyEffect = this.mostRecentEffect('copyCard');
        return this.sumEffects('modifyArmor') + (copyEffect ? copyEffect.printedArmor : this.printedArmor);
    }

    exhaust() {
        this.exhausted = true;
    }

    ready() {
        this.exhausted = false;
    }

    removeAttachment(card) {
        this.upgrades = this.upgrades.filter(c => c !== card);
    }

    /**
     * Applies an effect with the specified properties while the current card is
     * attached to another card. By default the effect will target the parent
     * card, but you can provide a match function to narrow down whether the
     * effect is applied (for cases where the effect only applies to specific
     * characters).
     */
    whileAttached(properties) {
        this.persistentEffect({
            condition: properties.condition || (() => true),
            match: (card, context) => card === this.parent && (!properties.match || properties.match(card, context)),
            targetController: 'any',
            effect: properties.effect
        });
    }

    /**
     * Checks whether the passed card meets the upgrade restrictions (e.g.
     * Opponent cards only, specific factions, etc) for this card.
     */
    canAttach(card, context) { // eslint-disable-line no-unused-vars
        return card && card.getType() === 'unit';
    }

    use(player) {
        let legalActions = this.getLegalActions(player);

        if(legalActions.length === 0) {
            return false;
        } else if(legalActions.length === 1) {
            let action = legalActions[0];
            if(!this.game.activePlayer.optionSettings.confirmOneClick) {
                let context = action.createContext(player);
                this.game.resolveAbility(context);
                return true;
            }
        }

        let choices = legalActions.map(action => action.title);
        let handlers = legalActions.map(action => () => {
            let context = action.createContext(player);
            this.game.resolveAbility(context);
        });
        this.game.promptWithHandlerMenu(player, {
            activePromptTitle: (this.location === 'play area' ? 'Choose an ability:' :
                { text: 'Play {{card}}:', values: { card: this.name } }),
            source: this,
            choices: choices,
            handlers: handlers
        });

        return true;
    }

    getLegalActions(player) {
        let actions = this.getActions();
        actions = actions.filter(action => {
            let context = action.createContext(player);
            return !action.meetsRequirements(context) && this.controller.hasEnoughMana(action.manaCost);
        });
        let canFight = actions.findIndex(action => action.title === 'Fight with this unit') >= 0;
        if(this.getEffects('mustFightIfAble').length > 0 && canFight) {
            actions = actions.filter(action => action.title === 'Fight with this unit');
        }

        return actions;
    }

    getAttackAction() {
        return this.action({
            title: 'Attack with this unit',
            condition: context => this.checkRestrictions('attack', context) && this.type === 'unit',
            printedAbility: false,
            target: {
                activePromptTitle: 'Choose a unit to attack',
                cardType: ['unit', 'player'],
                controller: 'opponent',
                gameAction: new ResolveAttackAction({ attacker: this })
            }
        });
    }

    getFightAction() {
        return this.action({
            title: 'Fight with this unit',
            condition: context => this.checkRestrictions('fight', context) && this.type === 'unit',
            printedAbility: false,
            target: {
                activePromptTitle: 'Choose a unit to attack',
                cardType: ['unit', 'player'],
                controller: 'opponent',
                gameAction: new ResolveFightAction({ attacker: this })
            }
        });
    }

    getReapAction() {
        return this.action({
            title: 'Reap with this unit',
            condition: context => this.checkRestrictions('reap', context) && this.type === 'unit',
            printedAbility: false,
            gameAction: new ResolveReapAction()
        });
    }

    getRemoveStunAction() {
        return new RemoveStun(this);
    }

    getActions(location = this.location) {
        let actions = [];
        if(location === 'hand') {
            if(this.type === 'unit') {
                actions.push(new PlayCreatureAction(this));
            } else if(this.type === 'relic') {
                actions.push(new PlayRelicAction(this));
            } else if(this.type === 'spell') {
                actions.push(new PlaySpell(this));
            }

            actions.push(new DiscardAction(this));
        } else if(location === 'play area' && this.type === 'unit') {
            actions.push(this.getFightAction());
            actions.push(this.getReapAction());
            actions.push(this.getRemoveStunAction());
        }

        return actions.concat(this.actions.slice());
    }

    convertActionType(type, action, manaRequired = 0) {
        if(!type || !action) {
            type = actionTypes['default'];
            action = {};
        }

        return {
            type: type,
            action: action,
            mana: manaRequired
        };
    }

    setDefaultController(player) {
        this.defaultController = player;
        this.controller = player;
    }

    getModifiedController() {
        if(this.location === 'play area') {
            return this.mostRecentEffect('takeControl') || this.defaultController;
        }

        return this.owner;
    }

    ignores(trait) {
        return this.getEffects('ignores').includes(trait);
    }

    getShortSummary() {
        let result = super.getShortSummary();

        // Include card specific information useful for UI rendering
        result.mana = this.mana;
        result.locale = this.locale;
        return result;
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let isController = activePlayer === this.controller;
        let selectionState = activePlayer.getCardSelectionState(this);

        if(!this.game.isCardVisible(this, activePlayer)) {
            return {
                cardback: './img/cards/cardback.png',
                controller: this.controller.name,
                location: this.location,
                facedown: true,
                uuid: this.uuid,
                tokens: this.tokens,
                ...selectionState
            };
        }

        let state = {
            id: this.cardData.id,
            image: this.cardData.image,
            canPlay: (activePlayer === this.game.activePlayer) && isController &&
                (this.getLegalActions(activePlayer).length > 0),
            cardback: './img/cards/cardback.png',
            childCards: this.childCards.map(card => {
                return card.getSummary(activePlayer, hideWhenFaceup);
            }),
            controlled: this.owner !== this.controller,
            exhausted: this.exhausted,
            facedown: this.facedown,
            location: this.location,
            menu: this.getMenu(),
            name: this.cardData.name,
            new: this.new,
            printedFaction: this.printedFaction,
            mana: this.mana,
            stunned: this.stunned,
            guardian: !!this.getKeywordValue('guardian'),
            tokens: this.tokens,
            type: this.getType(),
            uuid: this.uuid
        };

        return Object.assign(state, selectionState);
    }
}

module.exports = Card;
