$.extend($.validator.prototype, {
    elements: function () {
        var validator = this,
            rulesCache = {},
            ruleCountCache = {};

        // select all valid inputs inside the form (no submit or reset buttons)
        var retVal = $(this.currentForm)
        .find("input, select, textarea")
        .not(":submit, :reset, :image, [disabled], [data-val=false]")
        .not(this.settings.ignore)
        .filter(function () {
            if (!this.name && validator.settings.debug && window.console) {
                console.error("%o has no name assigned", this);
            }

            if ($(validator.currentForm).data('disable-custom-rule-caching')) {
                // select only the first element for each name, and only those with rules specified
                if (this.name in rulesCache || !validator.objectLength($(this).rules()))
                    return false;

                rulesCache[this.name] = true;
                return true;
            }

            var ruleName = this.name.replace(/\[\d*\]/g, '');
            ruleName = $.trim(ruleName);
            // select only the first element for each name, and only those with rules specified
            if (this.name in rulesCache) return false;
            if (ruleName in ruleCountCache) {
                return !ruleCountCache[ruleName];
            }
            var excludeElement = !validator.objectLength($(this).rules());
            ruleCountCache[ruleName] = excludeElement;
            if (excludeElement) {
                return false;
            }

            rulesCache[ruleName] = true;
            return true;
        });
        SunGard.Common.ConsoleLog('Elements: ' + retVal.length);
        return retVal;
    }
});

// Override the maxlength validation to handle line feeds as C# will.
if ($.validator && $.validator.methods && $.validator.methods.maxlength) {

    $.validator.methods.maxlength = function (value, element, param) {
        if (typeof value === 'string') {
            value = value.replace(/\r?\n/g, "\r\n");
        }

        var length = $.isArray(value) ? value.length : $.validator.prototype.getLength($.trim(value), element);
        return $.validator.prototype.optional(element) || length <= param;
    };
}