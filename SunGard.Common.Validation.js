/*
* ------------------------------------------------------------------------------------------------
* © Copyright 2013 SunGard K-12 Education, All Rights Reserved.
* This program is PROPRIETARY and CONFIDENTIAL information of SunGard K-12 Education, and may not
* be disclosed or used except as expressly authorized in a license agreement controlling such use
* and disclosure.  Unauthorized use of this program will result in legal proceedings, civil
* damages, and possible criminal prosecution.
* ------------------------------------------------------------------------------------------------
* System Name: eSchoolPLUS
* ------------------------------------------------------------------------------------------------
* File Name: SunGard.Common.Validation.js
* ------------------------------------------------------------------------------------------------
* File Description:
*   jQuery script file for common client validation functionality
* ------------------------------------------------------------------------------------------------
*/

var SunGard = $.extend({}, SunGard);
SunGard.Common = $.extend({}, SunGard, SunGard.Common);

SunGard.Common.Validation = function () {
    var _uniqueValidationId = 0,
        _uniqueErrorDialogIndex = 0,
        _bodyPaddingWhenDialogVisible = null,
        _disableValidationClasses = ":hidden,:disabled,[readonly='readonly'],.sg-disable-validation,.sg-text-readonly,.sg-disable-validation-newrow",

    init = function (formSelector) {

        var $form = $(formSelector);
        if ($form.length === 0) {
            return;
        }

        if ($form.length > 1) {
            throw "The formSelector argument should only evaluate to a single form";
        }

        // Create the error list dialog
        if (!$.hasData($form[0]) || $form.data().errorDialog === undefined) {
            var errorDialogId = "errorDialog" + _uniqueErrorDialogIndex;
            _uniqueErrorDialogIndex++;
            $form.data("errorDialog", errorDialogId);
            var $errorList = new SunGard.Common.Html.TagBuilder("div")
                .AddCssClass("sg-error-list-container")
                .SetInnerHtml(
                    new SunGard.Common.Html.TagBuilder("ul")
                        .MergeAttribute('id', 'error-list')
                        .AddCssClass('list-group sg-error-list')
                        .ToString()
                );
            var errorListButtons = [
                {
                    text: "OK",
                    tooltip: null,
                    name: errorDialogId + "-OK",
                    cssClass: "hidden",
                    dismissDialog: true,
                    htmlAttributes: null,
                    click: null
                }
            ];
            var errorListOptions = {
                cssClass: "modal-danger sg-error-dialog",
                removeCssClass: "modal-primary",
                modal: false,
                showBackdrop: false,
                trackChanges: SunGard.Bootstrap.Dialog.TrackChangesOption.None,
                onShown: function (e) {
                    if (!SunGard.Bootstrap.Dialog.IsDialogShown()) {
                        _bodyPaddingWhenDialogVisible = $("body").css("padding-right");
                        $("body").removeClass("modal-open").css("padding-right", "");
                    }
                },
                onHidden: function (e) {
                    if (SunGard.Bootstrap.Dialog.IsDialogShown()) {
                        $("body").addClass("modal-open").css("padding-right", _bodyPaddingWhenDialogVisible);
                    }
                }
            };
            SunGard.Bootstrap.Dialog.InitializeDialog(errorDialogId, "Error List", errorListButtons, errorListOptions, $errorList.ToString());
        }

        if ($('.sg-validation-popover').length === 0) {
            $('body').append(new SunGard.Common.Html.TagBuilder("div").AddCssClass("sg-validation-popover").ToString());
        }

        // Retrieve the validator for the form
        var validator = $form.data('validator');
        // Test if we have a validator, and if not, parse the form
        if (validator === undefined || validator === null) {
            $.validator.unobtrusive.parse($form);
            validator = $form.data('validator');
        }
        // Retreive the validator settings
        var settings = validator.settings;

        settings.focusInvalid = false;
        settings.ignore = _disableValidationClasses;
        settings.showErrors = function (errors) {
            var anyElementsNeedUpdate = false;
            for (var i = 0; i < this.errorList.length; i++) {
                var $element = $(this.errorList[i].element);
                if (!$element.hasClass(this.settings.errorClass)) {
                    anyElementsNeedUpdate = true;
                } else {
                    var $valMsg = $element.parent().find('span[data-valmsg-for="' + $element.attr('name') + '"]');
                    if ($valMsg) {
                        anyElementsNeedUpdate = true;
                    }
                }
                if (anyElementsNeedUpdate) {
                    i = this.errorList.length;
                }
            }
            if (!anyElementsNeedUpdate) {
                for (i = 0; i < this.successList.length; i++) {
                    if ($(this.successList[i]).hasClass(this.settings.errorClass)) {
                        anyElementsNeedUpdate = true;
                        i = this.successList.length;
                    }
                }
            }

            if (anyElementsNeedUpdate) {
                // show the usual errors (defaultShowErrors is part of the jQuery validator)
                this.defaultShowErrors();
            }
        };
        $('.field-validation-error, .field-validation-valid', $form).hide();

        $form.on("invalid-form.validate", function (event, validator) {

            //Show the error list
            var $form = $(event.target);
            SunGard.Bootstrap.Dialog.ShowDialog($form.data().errorDialog);
        });

        var baseErrorPlacementFunction = settings.errorPlacement;
        settings.errorPlacement = function (error, element) {
            var form = $form[0];
            var $errorDialog = $("#" + $(form).data().errorDialog);

            //Add the data-unique-id attribute if it does not exist
            if (!element.is('[data-unique-val-id]')) {
                element.attr('data-unique-val-id', ++_uniqueValidationId);
            }

            var uniqueValId = element.attr('data-unique-val-id');
            var $errorListItem = $('#error-list li[data-unique-val-id-link=' + uniqueValId + ']', $errorDialog);

            if ($.trim(error.text()) !== '') {
                if ($errorListItem.length === 0) {
                    $('<li>', {
                        'class': 'list-group-item sg-error-list-item',
                        'data-unique-val-id-link': uniqueValId,
                        text: error.text()
                    }).appendTo($('#error-list', $errorDialog));
                } else if ($errorListItem.text() !== error.text()) {
                    $errorListItem.text(error.text());
                    destroyPopover($(element));
                }
                createPopover(element, error.text(), 'focus');
            } else {
                removeErrorListItem(element);
            }

            baseErrorPlacementFunction.call(form, error, element);
        };

        $(document).off('click', '.sg-error-list-item');
        $(document).on('click', '.sg-error-list-item', function () {
            var errorDialogId = $(this).closest(".modal").attr("id");
            var $fieldForm = null;
            $("form").each(function (index, form) {
                var $form = $(form);
                if ($.hasData($form[0]) && $form.data().errorDialog !== undefined && $form.data().errorDialog === errorDialogId) {
                    $fieldForm = $form;
                    return false;
                }
            })
            if ($fieldForm === null) {
                return;
            }
            var uniqueValId = $(this).attr('data-unique-val-id-link');
            var $element = $('[data-unique-val-id=' + uniqueValId + ']', $fieldForm);
            if (!$element.hasClass('select2-offscreen')) {
                $element.focus();
            } else {
                $element.select2('focus');
            }
        });

        // Link all commonly validation items
        linkCommonValidation('body');

        $("[data-val='true'].sg-show-invalid-value-error", $form).removeClass("sg-show-invalid-value-error").each(function (index, element) {
            if (!$(element).is(_disableValidationClasses)) {
                $(element).valid();
            }
        });
    },

    removeErrorListItem = function ($element) {
        /// <summary>
        /// If an error exists for the element passed in, remove the error list item and destroy the popover.
        /// </summary>
        /// <param name="$element">The element to remote the validation error message for</param>

        if (!$element.is('[data-unique-val-id]')) {
            return;
        }

        var $form = $element.closest('form');
        var $errorDialog = $("#" + $form.data().errorDialog);
        if ($errorDialog.length > 0) {
            $('#error-list li[data-unique-val-id-link=' + $element.attr('data-unique-val-id') + ']', $errorDialog).remove();
            destroyPopover($element);
            if ($("#error-list li", $errorDialog).length === 0) {
                closeErrorListContainer($form);
            }
        }
    },

    closeErrorListContainer = function ($form) {
        SunGard.Bootstrap.Dialog.CloseDialog($form.data().errorDialog);
    },

    clearErrorList = function (formSelector) {
        var $form = $(formSelector);
        var $errorDialog = $("#" + $form.data().errorDialog);
        if ($errorDialog.length > 0) {
            $('#error-list li', $errorDialog).each(function () {
                var $element = $('[data-unique-val-id=' + $(this).attr('data-unique-val-id-link') + ']', $form);
                removeErrorListItem($element);
            });
        }
    },

    createPopover = function ($element, content, trigger) {
        /// <summary>
        /// Creates the validation popover message on the passed element
        /// </summary>
        /// <param name="$element">The element to create the validation popover message on</param>
        /// <param name="content">The content to place in the popover</param>
        /// <param name="trigger">The trigger to display the popover</param>
        destroyPopover($element);
        if (!$element.hasClass('select2-offscreen')) {
            $element.popover({
                trigger: trigger,
                content: content,
                placement: "auto top",
                container: ".sg-validation-popover"
            });
        }
    },

    destroyPopover = function ($element) {
        /// <summary>
        /// Destroys the popover on the selected element
        /// </summary>
        /// <param name="$element">The element to destroy the validation popover message on</param>
        if ($element.data('bs.popover') !== undefined) {
            $element.popover('destroy');
        }
    },

    /**
     * Parses dynamic content added to page after validators have already been applied.
     * @param {string} selector - The jQuery selector for the element to be parsed.  Send the form selector to re-parse the entire form.
     */
    parseDynamicContent = function (selector) {

        // make sure to remove any data-val attributes on divs.
        $('div[data-val="true"]').removeAttr('data-val');

        //use the normal unobstrusive.parse method
        $.validator.unobtrusive.parse(selector);

        //get the relevant form
        var form = $(selector).first().closest('form');

        //get the collections of unobstrusive validators, and jquery validators
        //and compare the two
        var unobtrusiveValidation = form.data('unobtrusiveValidation');
        if (unobtrusiveValidation === undefined) {
            return;
        }
        var validator = form.validate();

        $.each(unobtrusiveValidation.options.rules, function (elname, elrules) {
            if (elname === "undefined") {
                delete unobtrusiveValidation.options.rules[elname];
            } else if (validator.settings.rules[elname] === undefined) {
                var args = {};
                $.extend(args, elrules);
                args.messages = unobtrusiveValidation.options.messages[elname];
                //edit:use quoted strings for the name selector
                $("[name='" + elname + "']").rules("add", args);
            } else {
                $.each(elrules, function (rulename, data) {
                    if (validator.settings.rules[elname][rulename] === undefined) {
                        var args = {};
                        args[rulename] = data;
                        args.messages = unobtrusiveValidation.options.messages[elname][rulename];
                        //edit:use quoted strings for the name selector
                        $("[name='" + elname + "']").rules("add", args);
                    }
                });
            }
        });
    },

    disable = function ($element) {
        /// <summary>
        /// This method will disable validation for a specific field
        /// </summary>
        /// <param name="$element">The jQuery element representing the control to disable validation on</param>
        if (!($element instanceof jQuery)) {
            throw "The element parameter must be a jQuery object";
        }

        if (!$element.is('[data-val]')) {
            throw "The element must be a jQuery validated element";
        }

        $element.addClass('sg-disable-validation valid').removeClass('input-validation-error');

        var $valMsg = $element.parent().find('[data-valmsg-for=\'' + $element.attr('name') + '\']');
        if ($valMsg.length) {
            $valMsg.removeClass('field-validation-error').addClass('field-validation-valid');
        }

        if ($element.is('[data-unique-val-id]')) {
            removeErrorListItem($element);
        }
    },

    enable = function ($element) {
        /// <summary>
        /// This method will enable validation for a specific field
        /// </summary>
        /// <param name="$element">The jQuery element representing the control to enable validation on</param>
        if (!($element instanceof jQuery)) {
            throw "The element parameter must be a jQuery object";
        }

        if (!$element.is('[data-val]')) {
            throw "The element must be a jQuery validated element";
        }

        $element.removeClass('sg-disable-validation');
    },

    /** Put all common custom validation methods in this function */
    initializeCustomUnobtrusiveValidation = function () {

        // getMessageFromAttributeFunction
        //      Returns a custom function to return an data attribute value
        var getMessageFromAttributeFunction = function (dataAttribute) {
            return function (parameters, element) {
                return $(element).data(dataAttribute);
            };
        };

        //#region Phone number validation
        $.validator.addMethod("phonenumber", function (value, element, param) {
            return $.trim(value) === '' ? true : value.match(/^(((\(([0-9]{3})\))|([0-9]{3}))[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/);
        });

        $.validator.unobtrusive.adapters.add
        ("phonenumber", [], function (options) {

            options.rules.phonenumber = options.params;
            options.messages.phonenumber = options.message;
        });
        //#endregion

        //#region Time field validation
        $.validator.addMethod("timefield", function (value, element, param) {
            return $.trim(value) === '' ? true : SunGard.Common.GetTimeMoment(value).isValid();
        });

        $.validator.unobtrusive.adapters.add
        ("timefield", [], function (options) {

            options.rules.timefield = options.params;
            options.messages.timefield = options.message;
        });
        //#endregion

        $.validator.addMethod("timeis", function (value, element, param) {
            var isValid = false;
            var $src = $(element);

            var dependentProperty = $src.data('val-timeis-dependentproperty');
            var operator = $src.data('val-timeis-operator');
            var passOnNull = $src.data('val-timeis-passonnull');

            if ($.trim(dependentProperty) !== '') {
                var $dependentProperty = $('#' + foolproof.getId(element, dependentProperty));
                var chkValue = $.trim(value);
                var compValue = $.trim($dependentProperty.val());

                if (passOnNull && (chkValue === '' || compValue === '')) {
                    isValid = true;
                } else {
                    chkValue = moment(chkValue, 'hh:mm A');
                    compValue = moment(compValue, 'hh:mm A');

                    switch (operator) {
                        case "EqualTo": isValid = (chkValue == compValue); break;
                        case "NotEqualTo": isValid = (chkValue != compValue); break;
                        case "GreaterThan": isValid = (chkValue > compValue); break;
                        case "LessThan": isValid = (chkValue < compValue); break;
                        case "GreaterThanOrEqualTo": isValid = (chkValue >= compValue); break;
                        case "LessThanOrEqualTo": isValid = (chkValue <= compValue); break;
                        case "RegExMatch": isValid = (new RegExp(compValue)).test(chkValue); break;
                        case "NotRegExMatch": isValid = !(new RegExp(compValue)).test(chkValue); break;
                    }
                }
            }

            return isValid;
        });

        $.validator.unobtrusive.adapters.add("timeis", [], function (options) {
            options.rules.timeis = {
                dependentproperty: options.params.dependentproperty,
                operator: options.params.operator,
                passonnull: options.params.passonnull
            };
            options.messages.timeis = options.message;
        });

        //#region Unique list item
        $.validator.addMethod("uniquelistitem", function (value, element, param) {
            // If the element is marked for deletion, skip it
            if ($(element).is(".sg-delete-element")) {
                return true;
            }
            // Do not validate anything in a control row
            if ($(element).parents('#sg-control-row').length > 0) {
                return true;
            }
            // Determine the elements indexer value
            var index = parseInt($(element).attr('sg-indexer'), 10);
            // Determine the group 
            var group = $(element).attr('sg-unique-group');
            // Find all items in the group
            var items = $('*[sg-unique-group="' + group + '"]');
            var matches;
            var result = true;
            var validatorMessage = '';
            // Reset the validator message
            $.validator.messages.uniquelistitem = null;
            //case sensitivity
            var caseInsensitive = $(element).attr('sg-unique-case-insensitive');

            // Determine the matches based on the element type
            if (element.tagName === "SELECT") {
                matches = items.find('option[value="' + value + '"]:selected');
            } else {
                // for some reason, using .find('[value="' + value + '"]') doesn't get all of the values.
                matches = items.filter(function () {
                    if (caseInsensitive) {
                        return $.trim($(this).val().toUpperCase()) === $.trim(value).toUpperCase();
                    } else {
                        return $.trim($(this).val()) === $.trim(value);
                    }
                });
            }

            // If more than one match was found for this specific value
            if (matches.length > 1) {
                // Loop through the matches
                for (var idx = 0; idx < matches.length; idx++) {
                    // retrieve this specific match
                    var match = $(matches[idx]);
                    // If we matched a control row, skip it.
                    if (match.parents('#sg-control-row').length === 0) {
                        // Since the element may not be of this specific type,
                        // verify it's type, and search up the tree until we locate the specified type
                        while (match[0].tagName !== element.tagName) {
                            match = match.parent();
                        }

                        // If the match hasn't been marked for deletion
                        if (!match.is(".sg-delete-element")) {
                            // Determine the match indexer
                            var matchIndex = parseInt(match.attr('sg-indexer'), 10);
                            // If the match indexer is less then the current indexer
                            if (index > matchIndex || match.attr('type') === 'hidden') {
                                // Generate an validation message
                                result = false;
                                var message = $.validator.format(SunGard.Common.GetResourceString($(element).data("unique-error-id")), (matchIndex + 1), (index + 1));
                                validatorMessage += message;
                            }
                        }
                    }
                }

                // Store the message for this element
                $(element).data('val-uniquelistitem', message);
                // Set the validator message
                $.validator.messages.uniquelistitem = validatorMessage;
            }

            // Return the result
            return result;
        });

        // Add the uniquelistitem rule
        $.validator.unobtrusive.adapters.add("uniquelistitem", [], function (options) {
            options.rules.uniquelistitem = options.params;
            options.messages.uniquelistitem = getMessageFromAttributeFunction('val-uniquelistitem');
        });
        //#endregion

        //#region IsInList(Not) field validator
        $.validator.addMethod("isinlist", function (value, element, param) {
            // If the element is marked for deletion, skip it
            if ($(element).is(".sg-delete-element")) {
                return true;
            }
            // Do not validate anything in a control row
            if ($(element).parents('#sg-control-row').length > 0) {
                return true;
            }

            // Locate the list to be used for validation
            var dataMethod = $(element).data('isinlist-data');
            dataMethod = SunGard.Bootstrap.Plugins.GetValueFromDataAttribute(dataMethod);

            // Determine the property in the array to be used
            var dataProperty = $(element).data('isinlist-property');
            if (dataProperty === undefined || dataProperty === null) {
                dataProperty = '';
            }

            // Determine if we are inverting the search
            var notIn = $(element).data('isinlist-not');
            if (notIn === undefined || notIn === null) {
                notIn = false;
            }

            var matchCase = $(element).data('isinlist-matchcase');
            if (matchCase === undefined || matchCase === null) matchCase = true;

            // Reset the validator message
            $.validator.messages.uniquelistitem = null;

            if ($.isFunction(dataMethod)) {
                var data = dataMethod.call(element);
                var casedValue = $.trim(value);
                if (!matchCase) casedValue = casedValue.toUpperCase();
                var matches = data.filter(function (obj) {
                    var testValue = '';
                    if (dataProperty === '') {
                        // Compare the string representation of the values.
                        testValue = obj.toString();
                    } else {
                        testValue = obj[dataProperty].toString();
                    }
                    if (!matchCase) testValue = testValue.toUpperCase();
                    return $.trim(testValue) === casedValue;
                });

                var returnValue = (notIn) ? (matches.length === 0) : (matches.length !== 0);

                if (!returnValue) {
                    var message = $.validator.format($(element).data('isinlist-message'), value);
                    // Store the message for this element
                    $(element).data('val-isinlist', message);
                    // Set the validator message
                    $.validator.messages.isinlist = message;

                }
                return returnValue;
            } else {
                return false;
            }

        });

        $.validator.unobtrusive.adapters.add("isinlist", [], function (options) {
            options.rules.isinlist = options.params;
            options.messages.isinlist = getMessageFromAttributeFunction('val-isinlist');
        });
        //#endregion

        //#region DateRange field validation
        $.validator.addMethod("daterange", function (value, element, param) {

            if ($.trim(value) === '') {
                return true;
            }

            var date = SunGard.Common.GetDateMoment(value);

            if (!date.isValid()) {
                return false;
            }

            if ($.trim(param.minimumdate) !== '') {
                var minDate = SunGard.Common.GetDateMoment(param.minimumdate);
                if (minDate.isValid() && minDate.toDate().getTime() > date.toDate().getTime()) {
                    return false;
                }
            }

            if ($.trim(param.maximumdate) !== '') {
                var maxDate = SunGard.Common.GetDateMoment(param.maximumdate);
                if (maxDate.isValid() && maxDate.toDate().getTime() < date.toDate().getTime()) {
                    return false;
                }
            }

            return true;
        });

        $.validator.unobtrusive.adapters.add
        ("daterange", ['minimumdate', 'maximumdate'], function (options) {

            options.rules.daterange = options.params;
            options.messages.daterange = options.message;
        });

        $.validator.addMethod("dateinlist", function (value, element, param) {
            if ($.trim(value) === '') return true;

            var $this = $(element);
            var formattedDates = $this.val().split(',');
            var isValid = true;
            var testMethod = $this.data('beforeShowDay');
            // Reset the validator message
            $.validator.messages.dateinlist = null;

            if (testMethod !== undefined && testMethod !== null) {
                testMethod = SunGard.Bootstrap.Plugins.GetValueFromDataAttribute($this.data('beforeShowDay'));
                var errorMessage = '';
                for (ctr = 0; ctr < formattedDates.length; ctr++) {
                    var testData = formattedDates[ctr];
                    if (!testMethod(testData)) {
                        isValid = false;
                        ctr = formattedDates.length;
                    }
                }
            }

            return isValid;
        });

        $.validator.unobtrusive.adapters.add("dateinlist", [], function (options) {
            options.rules.dateinlist = options.params;
            options.messages.dateinlist = getMessageFromAttributeFunction('val-dateinlist');
        });
        //#endregion

        //#region Common Validator - Server message processing
        $.validator.addMethod("sgvalid", function (value, element, param) {
            // Force the validation message to null
            $.validator.messages.sgvalid = null;
            // Determine the IsValid value
            var isValid = $(element).data('sgvalid-isvalid');

            // If we have a value
            if (isValid !== undefined && isValid !== null) {
                // If the control isn't valid
                if (!isValid) {
                    // log it
                    SunGard.Common.ConsoleLog('sgvalid - Process ' + element.id + ' - ' + $(element).data('sgvalid-isvalid-message'));
                    // Add the specific validator message for this element
                    $.validator.messages.sgvalid = $(element).data('sgvalid-isvalid-message');
                }
            } else {
                // The isValid value couldn't be located, so set the result to true(no message).
                isValid = true;
            }

            // Return the result
            return isValid;
        });

        // Add the sgvalid validator
        $.validator.unobtrusive.adapters.add("sgvalid", [], function (options) {
            options.rules.sgvalid = options.params;
            options.messages.sgvalid = getMessageFromAttributeFunction('sgvalid-isvalid-message');
        });
        //#endregion

        //#region Invalid selected dropdown value

        $.validator.addMethod("sginvalidselections", function (value, element, param) {
            var $element = $(element);

            // If the element is marked for deletion, skip it
            if ($element.is(".sg-delete-element")) {
                return true;
            }
            // Do not validate anything in a control row
            if ($element.parents('#sg-control-row').length > 0) {
                return true;
            }

            // Get the list of invalid selections
            var invalidSelections = [];
            if (typeof $element.data("val-sginvalidselections-values") !== "undefined") {
                var values = $element.data("val-sginvalidselections-values");
                invalidSelections = $.isArray(values) ? values: $.parseJSON(values);
            }
            if (param.values !== null && param.values !== undefined) {
            }

            // No need to do any validation if there are no invalid selections
            if (!$.isArray(invalidSelections) || invalidSelections.length == 0) {
                return true;
            }

            // Make sure all of the invalid codes are trimmed
            for (var index in invalidSelections) {
                invalidSelections[index] = $.trim(invalidSelections[index]);
            }

            // Get the selected values
            var selectedValues = $element.val();
            if ($.trim(selectedValues) === "") {
                selectedValues = [];
            } else if (isNaN(selectedValues) && selectedValues.indexOf(",") >= 0) {
                selectedValues = selectedValues.split(",");
            } else {
                selectedValues = [selectedValues];
            }

            // Make sure the selected values are trimmed
            for (var index in selectedValues) {
                selectedValues[index] = $.trim(selectedValues[index]);
            }

            // Check if any of the selected values are in the list of invalid selections
            var stillInvalid = $(selectedValues).filter(function (index) {
                if (SunGard.Common.CaseInsensitiveInArray(this, invalidSelections) === -1) {
                    return false;
                } else {
                    return true;
                }
            });

            // If there still are invalid selections selected, flag it as an error
            if (stillInvalid.length === 0) {
                return true;
            } else {
                return false;
            }
        })

        $.validator.unobtrusive.adapters.add("sginvalidselections", ["values"], function (options) {
            options.rules.sginvalidselections = options.params;
            options.messages.sginvalidselections = options.message;
        });

        //#endregion
    },

    validationMessageFor = function (name) {

        var tagBuilder = SunGard.Common.Html.TagBuilder('span');
        return tagBuilder
            .AddCssClass("field-validation-valid")
            .MergeAttributes({ 'data-valmsg-for': name, 'data-valmsg-replace': true, 'for': SunGard.Common.Html.HtmlExtensionMethods.CreateSanitizedId(name) })
            .ToString();
    },

    addDataValAttribute = function (attributes) {
        attributes = attributes || {};
        attributes = $.extend({ 'data-val': true }, attributes);
    },

    addClientValidationSummaryMessage = function (message, id, dialogId) {
        /// <summary>
        /// Add a message to the validation summary area and display the container if it was previously hidden
        /// </summary>
        /// <param name="message">The message to display</param>
        /// <param name="id">A related id to use if this message can later be removed</param>
        /// <param name="dialogId">Optional dialogId for when the validation summary element is within a dialod</param>

        var $validationSummary = (dialogId !== null && typeof dialogId !== "undefined") ? $('div[data-valmsg-summary=true]', $("#" + dialogId)) : $('div[data-valmsg-summary=true]');
        if ($validationSummary.hasClass('validation-summary-valid')) {
            $validationSummary.addClass('validation-summary-errors').removeClass('validation-summary-valid');
        }

        var $validationSummaryList = $('ul', $validationSummary);

        var html = new SunGard.Common.Html.TagBuilder("li").AddCssClass("sg-client-validation-summary-error").SetInnerText(message);
        if ($.trim(id) !== '') {
            html.MergeAttribute('data-related-id', $.trim(id));
        }

        $validationSummaryList.append($(html.ToString()));
    },

    removeClientValidationSummaryMessage = function (id) {
        /// <summary>
        /// Remove a client validation summary message by id.  This will only remove messages added via AddValidationSummaryMessage where the same id was used to create the message
        /// </summary>
        /// <param name="id">The ID to use to look up the existing validation summary message</param>

        $('div[data-valmsg-summary=true] li.sg-client-validation-summary-error[data-related-id=' + $.trim(id) + ']').remove();
        if (!hasClientValidationSummaryMessages()) {
            clearClientValidationSummaryMessages();
        }
    },

    processClientValidationMessages = function (formId, validationInformation, dialogId, scrollGlobalMessagesIntoView, enableValidationOnElement) {
        /// <summary>
        /// Process common sgvalid validation data
        /// </summary>
        /// <param name="formId">The form ID to be processed for this validation</param>
        /// <param name="validationInformation">The validation information</param>
        /// <param name="dialogId">Optional dialogId for when the validation summary element is within a dialod</param>
        /// <param name="scrollGlobalMessagesIntoView" type="boolean" optional="true">Flag to indicate if global messages should be scrolled into view when added (default is true)</param>
        /// <param name="enableValidationOnElement" type="boolean" optional="true">Set this to true to perform a check to make sure the data-val attribute on the element is set to true (default is false)</param>

        // Make sure the scrollGlobalMessagesIntoView parameter is set
        if (scrollGlobalMessagesIntoView === null || scrollGlobalMessagesIntoView === undefined || scrollGlobalMessagesIntoView !== false) {
            scrollGlobalMessagesIntoView = true;
        }

        //If not passed, the default will be false
        enableValidationOnElement = enableValidationOnElement === true;
        var resetValidation = false;

        // Clear any summary messages that are server specific
        clearClientValidationSummaryMessages(dialogId);

        // Locate the error messages in the provided data
        var messages = validationInformation.ValidationErrorMessages;

        // Initialize flag to indicate if a global message was displayed
        var globalAdded = false;

        // Create an empty error array
        var errorArray = {};
        // If we have error messages
        if (messages !== undefined && messages !== null) {
            // Loop through the error messages
            for (var msgCtr = 0; msgCtr < messages.length; msgCtr++) {
                var addSummaryMessage = false;

                // determine the current message
                var currentMessage = messages[msgCtr];
                // If the current message is defined
                if (currentMessage !== undefined && currentMessage !== null) {
                    // Locate the linked field
                    var linkedField = currentMessage.LinkedFieldID;

                    // Localize the message if needed
                    currentMessage = localizeMessage(currentMessage);

                    if (linkedField.trim() === "") {
                        // If no linked field was provided, add a summary message.
                        addSummaryMessage = true;
                    } else {
                        // Add a field-specific message;
                        var $element = $('#' + linkedField);

                        if ($element.length == 0) {
                            // if the element can't be found, add a summary message.
                            addSummaryMessage = true;
                        } else {
                            // make sure the field is not in a collapsed panel
                            if (!$element.is(':visible')) {
                                var $panel = $element.parents('.panel-primary');
                                $panel.each(function () {
                                    var $panelCollapsible = $(this).find('> .panel-collapse');
                                    if (!$panelCollapsible.hasClass('in')) {
                                        $panelCollapsible.collapse('show');
                                    }
                                });
                            }

                            if (enableValidationOnElement && $element.attr('data-val') === 'false') {
                                $element.attr('data-val', 'true');
                                resetValidation = true;
                            }

                            $element.data('sgvalid-isvalid', false).data('sgvalid-isvalid-message', currentMessage.message);
                        }
                    }

                    // add a summary message, if necessary
                    if (addSummaryMessage) {
                        addClientValidationSummaryMessage(currentMessage.message, currentMessage.GlobalMessageId, dialogId);
                        if (scrollGlobalMessagesIntoView) {
                            globalAdded = true;
                        }
                    }
                }
            }
        }

        if (resetValidation) {
            var formSelector = '#' + formId;
            $(formSelector).removeData('validator');
            $(formSelector).removeData('unobtrusiveValidation');
            $.validator.unobtrusive.parse(formSelector);
            SunGard.Common.Validation.Init(formSelector);
        }

        // Re-validate the form, which will now include server-side or custom messages.
        $('#' + formId).valid();

        // If a global message was displayed, scroll it into view
        if (globalAdded) {
            scrollToValidationSummary(dialogId);
        }

        // If the Page Status indicates that the data was saved
        if (validationInformation.PageState === SunGard.Common.ChangeStatus.ChangesSaved) {
            // Set the saved message
            SunGard.Common.SetSaved();
        }
    },

    scrollToValidationSummary = function (dialogId) {
        /// <summary>
        /// Scrolls the validation summary into view.
        /// </summary>
        /// <param name="dialogId" type="string" optional="true">Optional dialogId for when the validation summary element is within a dialog</param>

        // Get the container that should be scrolled
        var $container = (dialogId !== null && typeof dialogId !== "undefined") ? $("#" + dialogId) : $("html, body");

        // Find the appropriate validation summary element and return if one is not found
        var $validationSummary = (dialogId !== null && typeof dialogId !== "undefined") ? $('div[data-valmsg-summary=true]', $("#" + dialogId)) : $('div[data-valmsg-summary=true]');
        if ($validationSummary.length === 0) {
            return;
        }

        // Find the top of the validation summary
        var valSummaryTop = $validationSummary.offset().top;

        // Initialize the adjustment - null means the validation summary is already scrolled into view
        var adjustment = null;

        // If within a dialog, the adjustment is based on the scroll top of the dialog
        if (dialogId !== null && typeof dialogId !== "undefined") {
            adjustment = $container.scrollTop() * -1;
            // If just on the page, check if the affix height is set
        } else {
            adjustment = $(".affix").parent().height();
        }

        // If there is an adjustment, apply it and scroll the validation summary into view.
        if (adjustment !== null && adjustment !== undefined) {
            $container.animate({ scrollTop: (valSummaryTop - adjustment) }, "normal");
        }
    },

    localizeMessage = function (message) {
        // Localize the base message if needed
        if ((message.message === null || $.trim(message.message) === '') &&
            (message.ResourceFile === null || $.trim(message.ResourceFile) === '') &&
            $.trim(message.ResourceMessageID) !== '') {
            message.message = SunGard.Common.GetResourceString(message.ResourceMessageID);
        }

        // If there are any message arguments
        if (message.MessageArguments !== undefined && message.MessageArguments !== null) {
            // Create a container for the arguments
            var args = [];
            // Localize any arguments that were not already localized
            for (var msgCtr = 0; msgCtr < message.MessageArguments.length; msgCtr++) {
                // If the argument is a LOCAL resource
                if (message.MessageArguments[msgCtr].IsResource === true && message.MessageArguments[msgCtr].IsGlobalResource !== true) {
                    // Load the local value
                    message.MessageArguments[msgCtr].MessageValue = SunGard.Common.GetResourceString(message.MessageArguments[msgCtr].MessageResourceId);
                }

                // Add the value to the arguments array
                args.push(message.MessageArguments[msgCtr].MessageValue);
            }

            // Build the entire message
            message.message = $.validator.format(message.message, args);
        }

        // Return the modified message
        return message;
    },

    clearServerValidationSummaryMessages = function (dialogId) {
        /// <summary>
        /// Clears all server-specific global messages
        /// </summary>

        var $validationSummary = (dialogId !== null && typeof dialogId !== "undefined") ? $('div[data-valmsg-summary=true]', $("#" + dialogId)) : $('div[data-valmsg-summary=true]');
        $('li.sg-client-validation-summary-error', $validationSummary).remove();
        if (!hasClientValidationSummaryMessages(dialogId)) {
            clearClientValidationSummaryMessages(dialogId);
        }
    },

    linkCommonValidation = function (context) {
        /// <summary>
        /// Sets up event handler for all sgvalid elements in the provided context.
        /// </summary>
        /// <param name="context">area to search</param>

        // Locate all common validation elements, and set an onchange event handler
        $(document).off('change.sgvalid', 'select[data-val-sgvalid], input[data-val-sgvalid], textarea[data-val-sgvalid]');
        $(document).on('change.sgvalid', 'select[data-val-sgvalid], input[data-val-sgvalid], textarea[data-val-sgvalid]', function (e) {
            // When changed, force the isvalid value back to true to server validation can be triggered.
            var $src = $(e.target);
            $src.data('sgvalid-isvalid', true);
            var $valMsg = $src.parent().find('span[data-valmsg-for="' + $src.attr('name') + '"]');
            if ($valMsg) {
                $valMsg.empty();
            }
        });
    },

    hasClientValidationSummaryMessages = function (dialogId) {
        /// <summary>
        /// True if any client validation summary message exist
        /// </summary>
        /// <returns type=""></returns>

        var $validationSummary = (dialogId !== null && typeof dialogId !== "undefined") ? $('div[data-valmsg-summary=true]', $("#" + dialogId)) : $('div[data-valmsg-summary=true]');
        return $('li.sg-client-validation-summary-error', $validationSummary).length > 0;
    },

    clearClientValidationSummaryMessages = function (dialogId) {
        /// <summary>
        /// Clears all client validation summary messages and hides the container
        /// </summary>

        var $validationSummary = (dialogId !== null && typeof dialogId !== "undefined") ? $('div[data-valmsg-summary=true]', $("#" + dialogId)) : $('div[data-valmsg-summary=true]');
        $('.sg-client-validation-summary-error', $validationSummary).remove();
        if ($('li:visible', $validationSummary).length === 0) {
            $validationSummary.removeClass('validation-summary-errors').addClass('validation-summary-valid');
        }
    },

    unobtrusive = function () {

        return {
            TextBox: function (name, value, attributes, userAccess, trackChanges) {
                addDataValAttribute(attributes);

                return SunGard.Common.Html.InputExtensions.SunGardTextBox(name, value, attributes, userAccess, trackChanges) +
                    validationMessageFor(name);
            },

            GridTextBox: function (collectionPropertyName, index, propertyName, value, attributes, userAccess, trackChanges) {
                var name = SunGard.Common.Html.HtmlExtensionMethods.CreateGridCollectionName(collectionPropertyName, index, propertyName);
                return this.TextBox(name, value, attributes, userAccess, trackChanges);
            },

            CheckBox: function (name, isChecked, attributes, userAccess, label, optionInputType, styleType, trackChanges) {
                addDataValAttribute(attributes);

                return SunGard.Common.Html.InputExtensions.SunGardCheckBox(name, isChecked, attributes, userAccess, label, optionInputType, styleType, trackChanges) +
                    validationMessageFor(name);
            },

            GridCheckBox: function (collectionPropertyName, index, propertyName, isChecked, attributes, userAccess, label, optionInputType, styleType, trackChanges) {
                var name = SunGard.Common.Html.HtmlExtensionMethods.CreateGridCollectionName(collectionPropertyName, index, propertyName);
                return this.CheckBox(name, isChecked, attributes, userAccess, label, optionInputType, styleType, trackChanges);
            },

            RadioButton: function (name, value, isChecked, attributes, userAccess, label, optionInputType, styleType, trackChanges) {
                addDataValAttribute(attributes);

                return SunGard.Common.Html.InputExtensions.SunGardRadioButton(name, value, isChecked, attributes, userAccess, label, optionInputType, styleType, trackChanges) +
                    validationMessageFor(name);
            },

            GridRadioButton: function (collectionPropertyName, index, propertyName, value, isChecked, attributes, userAccess, label, optionInputType, styleType, trackChanges) {
                var name = SunGard.Common.Html.HtmlExtensionMethods.CreateGridCollectionName(collectionPropertyName, index, propertyName);
                return this.RadioButton(name, value, isChecked, attributes, userAccess, label, optionInputType, styleType, trackChanges);
            },

            TextArea: function (name, value, rows, cols, attributes, userAccess, trackChanges) {
                addDataValAttribute(attributes);

                return SunGard.Common.Html.TextAreaExtensions.SunGardTextArea(name, value, rows, cols, attributes, userAccess, trackChanges) +
                    validationMessageFor(name);
            },

            GridTextArea: function (collectionPropertyName, index, propertyName, value, rows, cols, attributes, userAccess, trackChanges) {
                var name = SunGard.Common.Html.HtmlExtensionMethods.CreateGridCollectionName(collectionPropertyName, index, propertyName);
                return this.TextArea(name, value, rows, cols, attributes, userAccess, trackChanges);
            },

            DropDownList: function (name, selectList, attributes, userAccess, displayFormat, trackChanges, sortOrder) {
                addDataValAttribute(attributes);

                return SunGard.Common.Html.SelectExtensions.SunGardDropDownList(name, selectList, attributes, userAccess, displayFormat, trackChanges, sortOrder) +
                    validationMessageFor(name);
            },

            GridDropDownList: function (collectionPropertyName, index, propertyName, selectList, attributes, userAccess, displayFormat, trackChanges, sortOrder) {
                var name = SunGard.Common.Html.HtmlExtensionMethods.CreateGridCollectionName(collectionPropertyName, index, propertyName);
                return this.DropDownList(name, selectList, attributes, userAccess, displayFormat, trackChanges, sortOrder);
            },

            ListBox: function (name, selectList, attributes, userAccess, displayFormat, trackChanges, showSelectAll, selectAllId, sortOrder) {
                addDataValAttribute(attributes);

                return SunGard.Common.Html.SelectExtensions.SunGardListBox(name, selectList, attributes, userAccess, displayFormat, trackChanges, showSelectAll, selectAllId, sortOrder) +
                    validationMessageFor(name);
            },

            GridListBox: function (collectionPropertyName, index, propertyName, selectList, attributes, userAccess, displayFormat, trackChanges, showSelectAll, selectAllId, sortOrder) {
                var name = SunGard.Common.Html.HtmlExtensionMethods.CreateGridCollectionName(collectionPropertyName, index, propertyName);
                return this.ListBox(name, selectList, attributes, userAccess, displayFormat, trackChanges, showSelectAll, selectAllId, sortOrder);
            },

            DataList: function (name, value, attributes, userAccess, displayFormat, idProperty, textProperty, trackChanges, sortOrder, initOnFocus) {
                addDataValAttribute(attributes);

                return SunGard.Common.Html.SelectExtensions.SunGardDataList(name, value, attributes, userAccess, displayFormat, idProperty, textProperty, trackChanges, sortOrder, initOnFocus) +
                    validationMessageFor(name);
            },

            GridDataList: function (collectionPropertyName, index, propertyName, value, attributes, userAccess, displayFormat, idProperty, textProperty, trackChanges, sortOrder, initOnFocus) {
                var name = SunGard.Common.Html.HtmlExtensionMethods.CreateGridCollectionName(collectionPropertyName, index, propertyName);
                attributes = $.extend({ "data-sg-clone-data": true }, attributes);
                return this.DataList(name, value, attributes, userAccess, displayFormat, idProperty, textProperty, trackChanges, sortOrder, initOnFocus);
            },

            DataListBox: function (name, attributes, userAccess, selectedValues, displayFormat, idProperty, textProperty, showSelectAll, trackChanges, selectAllId, sortOrder) {
                addDataValAttribute(attributes);

                return SunGard.Common.Html.SelectExtensions.SunGardDataListBox(name, attributes, userAccess, selectedValues, displayFormat, idProperty, textProperty, showSelectAll, trackChanges, selectAllId, sortOrder) +
                    validationMessageFor(name);
            },

            GridDataListBox: function (collectionPropertyName, index, propertyName, attributes, userAccess, selectedValues, displayFormat, idProperty, textProperty, showSelectAll, trackChanges, selectAllId, sortOrder) {
                var name = SunGard.Common.Html.HtmlExtensionMethods.CreateGridCollectionName(collectionPropertyName, index, propertyName);
                attributes = $.extend({ "data-sg-clone-data": true }, attributes);
                return this.DataListBox(name, attributes, userAccess, selectedValues, displayFormat, idProperty, textProperty, showSelectAll, trackChanges, selectAllId, sortOrder);
            },

            Datepicker: function (name, value, attributes, userAccess, showCalendarIcon, trackChanges) {
                addDataValAttribute(attributes);

                return SunGard.Common.Html.InputExtensions.SunGardDatepicker(name, value, attributes, userAccess, showCalendarIcon, trackChanges) +
                    validationMessageFor(name);
            },

            GridDatepicker: function (collectionPropertyName, index, propertyName, value, attributes, userAccess, showCalendarIcon, trackChanges) {
                var name = SunGard.Common.Html.HtmlExtensionMethods.CreateGridCollectionName(collectionPropertyName, index, propertyName);
                return this.Datepicker(name, value, attributes, userAccess, showCalendarIcon, trackChanges);
            },

            Timepicker: function (name, value, attributes, userAccess, useSeconds, trackChanges) {
                addDataValAttribute(attributes);

                return SunGard.Common.Html.InputExtensions.SunGardTimepicker(name, value, attributes, userAccess, useSeconds, trackChanges) +
                    validationMessageFor(name);
            },

            GridTimepicker: function (collectionPropertyName, index, propertyName, value, attributes, userAccess, useSeconds, trackChanges) {
                var name = SunGard.Common.Html.HtmlExtensionMethods.CreateGridCollectionName(collectionPropertyName, index, propertyName);
                return this.Timepicker(name, value, attributes, userAccess, useSeconds, trackChanges);
            },

            AdvancedSearch: function (name, inputMethod, outputMethod, searchType, htmlAttributes, userAccess, value, trackChanges) {
                addDataValAttribute(htmlAttributes);

                return SunGard.Common.Html.InputExtensions.SunGardAdvancedSearch(name, inputMethod, outputMethod, searchType, htmlAttributes, userAccess, value, trackChanges) +
                    validationMessageFor(name);
            },

            GridAdvancedSearch: function (collectionPropertyName, index, propertyName, inputMethod, outputMethod, searchType, htmlAttributes, userAccess, value, trackChanges) {
                var name = SunGard.Common.Html.HtmlExtensionMethods.CreateGridCollectionName(collectionPropertyName, index, propertyName);

                return this.AdvancedSearch(name, inputMethod, outputMethod, searchType, htmlAttributes, userAccess, value, trackChanges);
            },

            ColorPicker: function (name, value, htmlAttributes, userAccess, trackChanges) {
                addDataValAttribute(htmlAttributes);

                return SunGard.Common.Html.InputExtensions.SunGardColorpicker(name, value, htmlAttributes, userAccess, trackChanges) +
                    validationMessageFor(name);
            },

            GridColorPicker: function (collectionPropertyName, index, propertyName, value, htmlAttributes, userAccess, trackChanges) {
                var name = SunGard.Common.Html.HtmlExtensionMethods.CreateGridCollectionName(collectionPropertyName, index, propertyName);

                return this.ColorPicker(name, value, htmlAttributes, userAccess, trackChanges);
            },

            ValOperator:
            {
                EqualTo: 'EqualTo',
                NotEqualTo: 'NotEqualTo',
                GreaterThan: 'GreaterThan',
                LessThan: 'LessThan',
                GreaterThanOrEqualTo: 'GreaterThanOrEqualTo',
                LessThanOrEqualTo: 'LessThanOrEqualTo',
                RegExMatch: 'RegExMatch',
                NotRegExMatch: 'NotRegExMatch',
            },

            RequiredIfValDataAttributes: function (fieldname, operator, dependentProperty, dependentValue, dependentPropertyName, passOnNull, message) {
                if (!message) {
                    message = SunGard.Common.GetResourceString('GlobalRequiredIf');
                }

                if (!dependentPropertyName) {
                    dependentPropertyName = SunGard.Common.GetResourceString(dependentProperty);
                }

                return {
                    'data-val-requiredif': $.validator.format(message, fieldname, dependentPropertyName, dependentValue, SunGard.Common.GetResourceString(operator)),
                    'data-val-requiredif-operator': operator,
                    'data-val-requiredif-dependentvalue': dependentValue,
                    'data-val-requiredif-dependentproperty': dependentProperty,
                    'data-val-requiredif-passonnull': passOnNull
                };
            },

            IsValDataAttributes: function (fieldname, operator, dependentProperty, dependentPropertyName, passOnNull, message) {
                if (!message) {
                    message = SunGard.Common.GetResourceString('GlobalIs');
                }

                if (!dependentPropertyName) {
                    dependentPropertyName = SunGard.Common.GetResourceString(dependentProperty);
                }

                return {
                    'data-val-is': $.validator.format(message, fieldname, dependentPropertyName, SunGard.Common.GetResourceString(operator)),
                    'data-val-is-dependentproperty': dependentProperty,
                    'data-val-is-operator': operator,
                    'data-val-is-passonnull': passOnNull,
                };
            },

            TimeIsValDataAttributes: function (fieldname, operator, dependentProperty, dependentPropertyName, passOnNull, message) {
                if (!message) {
                    message = SunGard.Common.GetResourceString('GlobalIs');
                }

                if (!dependentPropertyName) {
                    dependentPropertyName = SunGard.Common.GetResourceString(dependentProperty);
                }

                return {
                    'data-val-timeis': $.validator.format(message, fieldname, dependentPropertyName, SunGard.Common.GetResourceString(operator)),
                    'data-val-timeis-dependentproperty': dependentProperty,
                    'data-val-timeis-operator': operator,
                    'data-val-timeis-passonnull': passOnNull,
                };
            },

            RequiredValDataAttributes: function (fieldName, message) {
                if (!message) {
                    message = SunGard.Common.GetResourceString("GlobalRequired");
                }

                return {
                    'data-val-required': $.validator.format(message, fieldName)
                };
            },

            NumberValDataAttributes: function (fieldName, message) {
                if (!message) {
                    message = SunGard.Common.GetResourceString('InvalidNumber');
                }

                return {
                    'data-val-number': $.validator.format(message, fieldName)
                };
            },

            DateValDataAttributes: function (fieldName, message) {
                if (!message) {
                    message = SunGard.Common.GetResourceString('DateInvalid');
                }

                return {
                    'data-val-date': $.validator.format(message, fieldName)
                };
            },

            RangeValDataAttributes: function (fieldName, minValue, maxValue, message) {
                if (!message) {
                    message = SunGard.Common.GetResourceString('InvalidRangeMinMax');
                }

                return {
                    'data-val-range': $.validator.format(message, fieldName, minValue, maxValue),
                    'data-val-range-max': maxValue,
                    'data-val-range-min': minValue,
                };
            },

            DateRangeValDataAttributes: function (fieldName, minValue, maxValue, message) {
                if (!message) {
                    message = SunGard.Common.GetResourceString('InvalidDateRangeMinMax');
                }

                return {
                    'data-val-daterange': $.validator.format(message, fieldName, minValue, maxValue),
                    'data-val-daterange-maximum': maxValue,
                    'data-val-daterange-minimum': minValue,
                };
            },

            TimeValDataAttributes: function (fieldName, message) {
                if (!message) {
                    message = SunGard.Common.GetResourceString("InvalidTime");
                }

                return {
                    "data-val-timefield": $.validator.format(message, fieldName)
                };
            },

            SgInvalidSelectionsValDataAttributes: function (fieldName, message) {
                if (!message) {
                    message = SunGard.Common.GetResourceString("InvalidSelections");
                }

                return {
                    "data-val-sginvalidselections": $.validator.format(message, fieldName),
                }
            },
        };
    }();

    var validationErrorMessage = function () {
        var result = {};

        var _globalMessageId = '';
        /// <summary>
        /// Global message id to be added.
        /// </summary>
        Object.defineProperty(result, 'GlobalMessageId', {
            get: function () {
                // Not sure how to handle this in JS so just using _globalMessageId
                //var messageId = !$.trim(this._globalMessageId) ? message.GetHashCode().ToString() : this._globalMessageId;
                var messageId = _globalMessageId;
                return $.validator.format("SERVER-{0}", messageId);
            },
            set: function (value) {
                _globalMessageId = value;
            }
        });

        /// <summary>
        /// ID of the linked field
        /// </summary>
        result.LinkedFieldName = null;
        /// <summary>
        /// Prefix value to use when building the field id/name
        /// </summary>
        result.LinkedFieldPrefix = null;
        /// <summary>
        /// Index value to use when building the field id/name
        /// </summary>
        result.LinkedFieldIndex = null;
        /// <summary>
        /// The validation message
        /// </summary>
        result.message = null;
        /// <summary>
        /// Arguments used to customize the localization message
        /// </summary>
        result.MessageArguments = []; // messageArguments
        /// <summary>
        /// Resource file used to retreive Global localization values
        /// </summary>
        result.ResourceFile = null; //'eSchoolPLUS.Validation.Common';
        /// <summary>
        /// Id of the localization message
        /// </summary>
        result.ResourceMessageID = null;

        var _providedLinkedFieldName = null;
        Object.defineProperty(result, 'LinkedFieldID', {
            get: function () {
                if (!$.trim(_providedLinkedFieldName)) {
                    var field = '';

                    if ($.trim(result.LinkedFieldName)) {
                        if ($.trim(result.LinkedFieldPrefix)) {
                            field += this.LinkedFieldPrefix;
                        }

                        if (result.LinkedFieldIndex !== null) {
                            field += $.validator.format("_{0}_", result.LinkedFieldIndex);
                        }

                        if (field.length > 0) {
                            field += "_";
                        }

                        field += result.LinkedFieldName;
                    }

                    return field;
                } else {
                    return _providedLinkedFieldName.replace("[", "_").replace("]", "_").replace(".", "_");
                }
            },
            writeable: false
        });

        Object.defineProperty(result, 'LinkedField', {
            get: function () {
                if (!$.trim(_providedLinkedFieldName)) {
                    var field = '';

                    if ($.trim(result.LinkedFieldName)) {
                        if ($.trim(result.LinkedFieldPrefix)) {
                            field += result.LinkedFieldPrefix;
                        }

                        if (result.LinkedFieldIndex !== null) {
                            field += $.validator.format("[{0}]", result.LinkedFieldIndex);
                        }

                        if (field.length > 0) {
                            field += ".";
                        }

                        field += result.LinkedFieldName;
                    }

                    return field;
                } else {
                    return _providedLinkedFieldName;
                }
            },
            set: function (value) {
                _providedLinkedFieldName = value;
            }
        });

        result.AddArgument = function (arg) {
            result.MessageArguments.push(arg);
            return result;
        };

        return result;
    };

    var messageArgument = function () {

        var result = {};

        /// <summary>
        /// Finalized message value after global localization
        /// </summary>
        result.MessageValue = null;

        /// <summary>
        /// Determines if localization is required.
        /// </summary>
        Object.defineProperty(result, 'IsResource', {
            get: function () {
                return ($.trim(result.MessageResourceFile) + $.trim(result.MessageResourceId)) !== '';
            },
            writeable: false
        });

        /// <summary>
        /// Resource file to be used for Global Localization.
        /// </summary>
        result.MessageResourceFile = 'eSchoolPLUS.Labels';

        /// <summary>
        /// Resource ID for a localized message
        /// </summary>
        result.MessageResourceId = null;

        /// <summary>
        /// Indicates if the provided resource message is a Global or Local resource type.
        /// </summary>
        result.IsGlobalResource = true;

        return result;
    };

    return {
        Init: init,
        CreatePopover: createPopover,
        DestroyPopover: destroyPopover,
        DisableValidationClasses: _disableValidationClasses,
        ParseDynamicContent: parseDynamicContent,
        ClearErrorList: clearErrorList,
        RemoveErrorListItem: removeErrorListItem,
        Enable: enable,
        Disable: disable,
        AddDataValAttribute: addDataValAttribute,
        ValidationMessageFor: validationMessageFor,
        Unobtrusive: unobtrusive,
        InitializeCustomUnobtrusiveValidation: initializeCustomUnobtrusiveValidation,
        AddClientValidationSummaryMessage: addClientValidationSummaryMessage,
        RemoveClientValidationSummaryMessage: removeClientValidationSummaryMessage,
        HasClientValidationSummaryMessages: hasClientValidationSummaryMessages,
        ClearClientValidationSummaryMessages: clearClientValidationSummaryMessages,
        ProcessClientValidationMessages: processClientValidationMessages,
        ClearServerValidationSummaryMessages: clearServerValidationSummaryMessages,
        ValidationErrorMessage: validationErrorMessage,
        MessageArgument: messageArgument,
        ScrollToValidationSummary: scrollToValidationSummary,
        LocalizeMessage: localizeMessage
    };
}();