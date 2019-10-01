// Taken from https://github.com/select2/select2/wiki/Knockout.js-Integration
// Modified to meed SunGard eSchoolPLUS needs
// Do not initialize the select2.  The Helpers have already set everything that was needed and the element is initialized.

if (window['ko']) {
    ko.bindingHandlers.select2 = {
        init: function (el, valueAccessor, allBindingsAccessor, viewModel) {
            ko.utils.domNodeDisposal.addDisposeCallback(el, function () {
                $(el).select2('destroy');
            });

            var allBindings = allBindingsAccessor(),
                select2 = ko.utils.unwrapObservable(allBindings.select2);
        },
        update: function (el, valueAccessor, allBindingsAccessor, viewModel) {
            var allBindings = allBindingsAccessor();

            if ("value" in allBindings) {
                // This line allows us to use this binding with knockout-es5
                var value = typeof allBindings.value === "function" ? allBindings.value() : allBindings.value;
                var $el = $(el);

                // don't automatically track changes when knockout updates the value for a select that hasn't
                // bee initailized yet.  Because this happens on initial load as well as update.
                var disableTracking = $el.hasClass('sg-select-box-init');
                var trackChanges = $el.hasClass("sg-track-changes");
                if (disableTracking && trackChanges) $el.removeClass("sg-track-changes");

                if ((allBindings.select2.multiple || el.multiple) && value.constructor != Array) {
                    $el.val(value.split(',')).trigger('change');
                }
                else {
                    $el.val(value).trigger('change');
                }

                // readd change tracking.
                if (disableTracking && trackChanges) $el.addClass("sg-track-changes");

            } else if ("selectedOptions" in allBindings) {
                var converted = [];
                var textAccessor = function (value) { return value; };
                if ("optionsText" in allBindings) {
                    textAccessor = function (value) {
                        var valueAccessor = function (item) { return item; }
                        if ("optionsValue" in allBindings) {
                            valueAccessor = function (item) { return item[allBindings.optionsValue]; }
                        }
                        var items = $.grep(allBindings.options(), function (e) { return valueAccessor(e) == value });
                        if (items.length == 0 || items.length > 1) {
                            return "UNKNOWN";
                        }
                        return items[0][allBindings.optionsText];
                    }
                }
                $.each(allBindings.selectedOptions(), function (key, value) {
                    converted.push({ id: value, text: textAccessor(value) });
                });
                $(el).select2("data", converted);
            }
        }
    };
}