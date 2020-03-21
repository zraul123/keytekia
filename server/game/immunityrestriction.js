class ImmunityRestriction {
    constructor(condition) {
        this.condition = condition;
    }

    isMatch(type, abilityContext) {
        return (
            abilityContext &&
            this.condition(abilityContext)
        );
    }
}

module.exports = ImmunityRestriction;
