//#region File Header
/*
 * ------------------------------------------------------------------------------------------------
 * © Copyright 1990-2014 SunGard K-12 Education, All Rights Reserved.
 * This program is PROPRIETARY and CONFIDENTIAL information of SunGard K-12 Education, and may not
 * be disclosed or used except as expressly authorized in a license agreement controlling such use
 * and disclosure.  Unauthorized use of this program will result in legal proceedings, civil
 * damages, and possible criminal prosecution.
 * ------------------------------------------------------------------------------------------------
 * System Name: SunGard K-12 Education
 * ------------------------------------------------------------------------------------------------
 * File Name: Sungard.Bootstrap.js
 * ------------------------------------------------------------------------------------------------
 * File Description:
 *   jQuery script file for client-side processing that can be used by any application to
 *   manipulate objects created using SunGard's version of Twitter Bootstrap for styling.
 * ------------------------------------------------------------------------------------------------
 */
//#endregion

//#region Basic Bootstrap functionality

var SunGard = (SunGard || {});

SunGard.Bootstrap = function () {
    var init = function () {
        /// <summary>Performs any global initializations for Twitter/SunGard Bootstrap scripting functionality</summary>

        // Initialize dropdown menus on the banner and navigation banner
        $(".nav .dropdown").each(function (index) {
            if (!$(this).hasClass("dropdown-view"))
                SunGard.Bootstrap.Navs.InitializeDropdownButton(this);
        });

        attachPageChangeStampDisplay();

        // Perform any textarea initialization
        SunGard.Bootstrap.Textarea.Init();

        // Perform any jqGrid initialization
        SunGard.Bootstrap.JQGrid.Init();

        // Perform any panel initialization
        SunGard.Bootstrap.Panel.Init();

        //Perform any plugin initialization
        SunGard.Bootstrap.Plugins.Init();
    };

    var getPageSize = function () {
        /// <summary>
        /// Determine what screen size we're at.
        /// </summary>
        /// <returns type="string">Returns the Bootstrap 2 character screen size code the page is currently rendered at.</returns>

        // Build the array of screen sizes
        var envs = ['xs', 'sm', 'md', 'lg', 'xl'];

        // Create a DIV and add it to the BODY tag
        $el = $('<div>');
        $el.appendTo($('body'));

        // Loop through the screen sizes until the DIV becomes hidden at which point we've identified the current screen size
        for (var i = envs.length - 1; i >= 0; i--) {
            var env = envs[i];

            $el.addClass('hidden-' + env);
            if ($el.is(':hidden')) {
                $el.remove();
                return env
            }
        }
    };

    var attachPageChangeStampDisplay = function () {
        /// <summary>
        /// Attaches the popover for displaying the change stamp information when clicking the page-level icon.
        /// </summary>

        var $dateTimeStampButton = $("#pageOptions-option-datetimestamp");
        if ($dateTimeStampButton.length > 0) {
            // Store the title in a data attribute and remove it.  Not doing so will result in the popover
            // using it as the title for the popover and then removing it from being displayed as a default
            // browser tooltip.
            $dateTimeStampButton.data().tooltipTitle = $dateTimeStampButton.attr("title");
            $dateTimeStampButton.removeAttr("title");

            // Create the popover
            $dateTimeStampButton.popover({
                trigger: "focus",
                content: function () {
                    return $(".sg-page-timestamp").html();
                },
                html: true,
                placement: "bottom",
                container: ".sg-page-title-area"
            });

            // Put the title back so the default browser tooltip will be rendered as desired.
            $dateTimeStampButton.attr("title", $dateTimeStampButton.data().tooltipTitle);
        }
    };

    return {
        Init: init,
        GetPageSize: getPageSize
    };
}();

//#endregion

//#region Checkbox functionality

SunGard.Bootstrap.Checkbox = function () {
    var toggleCheckboxButton = function (selector) {
        /// <summary>
        /// Toggles a checkbox button
        /// </summary>
        /// <param name="selector" type="string">Selector that identifies the checkbox to toggle.</param>

        var $element = (selector instanceof jQuery ? selector : $(selector));

        if ($element === null)
            return;

        // Determine what the new state should be (checked/unchecked)
        var newState = !$element.prop("checked");

        // Find the label associated with the checkbox
        var checkboxLabel = $element.closest("label");

        // If the label is not a button, then it's not a checkbox button and shouldn't be toggled
        if (checkboxLabel !== null && checkboxLabel.hasClass("btn")) {
            // Toggle the checkbox
            $element.prop("checked", newState);

            // Toggle the label's state
            if (newState)
                checkboxLabel.addClass("active");
            else
                checkboxLabel.removeClass("active");
        }
    };

    return {
        ToggleCheckboxButton: toggleCheckboxButton
    };
}();

//#endregion

//#region Dialog functionality

SunGard.Bootstrap.Dialog = function () {

    //#region Private Variables

    var _visibleDialogs = [];
    var _eventsTracked = false;
    var _dialogContainer = null;

    //#endregion

    //#region Enumerations

    /// <var>Possible dialog box sizes and the classes that should be applied for that size</var>
    var dialogSize = {
        /// <field name="Small" type="string">Will render the dialog box as a narrow dialog</field>
        Small: "modal-dialog modal-sm",
        /// <field name="Medium" type="string">Will render the dialog box as a average-sized dialog</field>
        Medium: "modal-dialog",
        /// <field name="Large" type="string">Will render the dialog box as a wide dialog</field>
        Large: "modal-dialog modal-lg",
        /// <field name="ExtraLarge" type="string">Will render the dialog box as a extra-wide dialog</field>
        ExtraLarge: "modal-dialog modal-xl"
    };

    /// <var>Possible button sets that can be used on dialog boxes</var>
    var buttonSets = {
        /// <field name="OkOnly" type="number">Will render an OK button only</field>
        OkOnly: 0,
        /// <field name="OkCancel" type="number">Will render OK and Cancel buttons</field>
        OkCancel: 1,
        /// <field name="YesNo" type="number">Will render Yes and No buttons</field>
        YesNo: 2,
        /// <field name="YesNoCancel" type="number">Will render Yes, No, and Cancel buttons</field>
        YesNoCancel: 3,
        /// <field name="SaveCancel" type="number">Will render Save and Cancel buttons</field>
        SaveCancel: 4,
        /// <field name="SaveDeleteCancel" type="number">Will render Save, Delete, and Cancel buttons</field>
        SaveDeleteCancel: 5,
        /// <field name="None" type="number">Will render no buttons whatsoever</field>
        None: 99
    };

    /// <var>Possible options for tracking changes made to input fields within a dialog</var>
    var trackChangesOption = {
        /// <field name="PageDefault" type="number">Tracking of changes within the dialog are turned on/off based on the page setting</field>
        PageDefault: 0,
        /// <field name="None" type="number">Tracking of changes is turned off within the dialog</field>
        None: 1,
        /// <field name="WithinDialog" type="number">Tracking of changes is turned on within the dialog</field>
        WithinDialog: 2
    };

    //#endregion

    //#region Default ButtonSets Button Settings

    /// <var>Default settings for the OK button</var>
    var okButton = {
        text: "OK",
        tooltip: "",
        cssClass: null,
        dismissDialog: true,
        htmlAttributes: null,
        click: null
    };

    /// <var>Default settings for the Yes button</var>
    var yesButton = {
        text: "Yes",
        tooltip: "",
        cssClass: null,
        dismissDialog: true,
        htmlAttributes: null,
        click: null
    };

    /// <var>Default settings for the No button</var>
    var noButton = {
        text: "No",
        tooltip: "",
        cssClass: null,
        dismissDialog: true,
        htmlAttributes: null,
        click: null
    };

    /// <var>Default settings for the Save button</var>
    var saveButton = {
        text: "Save",
        tooltip: "",
        cssClass: null,
        dismissDialog: false,
        htmlAttributes: null,
        click: null
    };

    /// <var>Default settings for the Delete button</var>
    var deleteButton = {
        text: "Delete",
        tooltip: "",
        cssClass: null,
        dismissDialog: false,
        htmlAttributes: null,
        click: null
    };

    /// <var>Default settings for the Cancel button</var>
    var cancelButton = {
        text: "Cancel",
        tooltip: "",
        cssClass: null,
        dismissDialog: true,
        htmlAttributes: null,
        click: null
    };

    //#endregion

    //#region Default Button and Dialog Settings

    /// <var>Base dialog options</var>
    var _baseOptions = {
        /// <field name="size" type="object">Default size is medium</field>
        size: dialogSize.Medium,
        /// <field name="cssClass" type="string">Additional CSS classes to add to the dialog</field>
        cssClass: null,
        /// <field name="removeCssClass" type="string">CSS classes to remove from the dialog</field>
        removeCssClass: null,
        /// <field name="modal" type="boolean">Flag indicating if the dialog should behave like a modal where clicking outside of the dialog has no effect</field>
        modal: true,
        /// <field name="showBackdrop" type="boolean">Set both this flag and the modal flag to false to not display a backdrop and to allow the user to click outside of the dialog and keep the dialog open</field>
        showBackdrop: true,
        /// <field name="trackChanges" type="SunGard.Bootstrap.Dialog.TrackChangesOption">Flag indicating if changes made to input fields in the dialog should be tracked and if so, how</field>
        trackChanges: trackChangesOption.PageDefault,
        /// <field name="unsavedChangesMessage" type="string">"Unsaved Changes" message to be displayed for the dialog if overriding the default</field>
        unsavedChangesMessage: null,
        /// <field name="changesSavedMessage" type="string">"Changes Saved" message to be displayed for the dialog if overriding the default</field>
        changesSavedMessage: null,
        /// <field name="moveable" type="boolean">Flag indicating if the dialog can be moved on the screen</field>
        moveable: true,
        /// <field name="resizable" type="boolean">Not currently implemented (may not be, so placeholder for now)</field>
        resizable: false,
        /// <field name="okClick" type="function">Event to fire when the OK button is clicked (only applicable if specifying buttons via button sets)</field>
        okClick: null,
        /// <field name="yesClick" type="function">Event to fire when the Yes button is clicked (only applicable if specifying buttons via button sets)</field>
        yesClick: null,
        /// <field name="noClick" type="function">Event to fire when the No button is clicked (only applicable if specifying buttons via button sets)</field>
        noClick: null,
        /// <field name="saveClick" type="function">Event to fire when the Save button is clicked (only applicable if specifying buttons via button sets)</field>
        saveClick: null,
        /// <field name="deleteClick" type="function">Event to fire when the Delete button is clicked (only applicable if specifying buttons via button sets)</field>
        deleteClick: null,
        /// <field name="cancelClick" type="function">Event to fire when the Cancel button is clicked (only applicable if specifying buttons via button sets)</field>
        cancelClick: null,
        /// <field name="onShow" type="function">Event to fire as soon as the call to show the dialog is made</field>
        onShow: null,
        /// <field name="onShown" type="function">Event to fire when the dialog is finished rendering</field>
        onShown: null,
        /// <field name="onHide" type="function">Event to fire as soon as the call is made to close the dialog</field>
        onHide: null,
        /// <field name="onHidden" type="function">Event to fire once the dialog is fully hidden</field>
        onHidden: null
    };

    /// <var>Default button settings.  Used to make sure all button setting objects have a default set of properties identified.</var>
    var defaultButtonSettings = {
        text: null,
        tooltip: null,
        name: null,
        cssClass: null,
        dismissDialog: true,
        htmlAttributes: null,
        click: null
    };

    //#endregion

    //#region Global Dialog Event Handlers

    var attachGlobalEvents = function () {
        /// <summary>
        /// Attaches the global event handlers for dialogs.
        /// </summary>

        // If the global event tracking was already turned on, there's no need to continue
        if (_eventsTracked)
            return;

        // Enable global event tracking when dialogs are shown or hidden
        $(document).on("shown.bs.modal", ".modal", flagDialogShown);
        $(document).on("hide.bs.modal", ".modal", flagDialogHide);

        // Flag that the global event handlers were already configured
        _eventsTracked = true;
    };

    var flagDialogShown = function (e) {
        /// <summary>
        /// Event handler that processes all dialogs when they are shown.
        /// </summary>
        /// <param name="e" type="Event">Event object</param>

        // Get a reference to the dialog that triggered the event
        var $dialog = $(e.target);

        // Apply focus as necessary
        SunGard.Common.ApplyFocusOnLoad($dialog);

        // Make sure it is indeed a dialog and if so, add it to the array of current dialogs
        if ($dialog.hasClass("modal")) {
            _visibleDialogs.push($dialog);
        }

        // Set the dialog as the currently tracked dialog if tracking is turned on for it
        var trackedDialog = $dialog;
        if (!isDialogTracked(trackedDialog)) {
            trackedDialog = null;
        }
        SunGard.Common.SetTrackedContent(trackedDialog);
        SunGard.Common.InitializeChangeStatus();

        // Determine the dialog's backdrop setting
        var backdropSetting = $dialog.data().backdrop;

        // If the dialog is not showing the backdrop, disable the event handler that prevents
        // applying focus to a field outside of the dialog
        if (backdropSetting === "false" || backdropSetting === false) {
            $(document).off("focusin.bs.modal");
        }

        // If the dialog has already been processed in terms of stacking then quit processing
        if ($dialog.hasClass("sg-modal-stack")) {
            return;
        }

        // Adjust the z-index of the dialog and its backdrop to handle dialog stacking
        $dialog.addClass("sg-modal-stack");
        $dialog.css("z-index", 1040 + (10 * _visibleDialogs.length));
        var $backdrop = $(".modal-backdrop").not(".sg-modal-stack").detach();
        dialogContainer().append($backdrop);
        $backdrop.css("z-index", 1039 + (10 * _visibleDialogs.length))
            .addClass("sg-modal-stack")
            .addClass("sg-dialog-print-invisible");
    };

    var flagDialogHide = function (e) {
        /// <summary>
        /// Event handler that processes all dialogs when they are hidden.
        /// </summary>
        /// <param name="e" type="Event">Event object</param>

        // Get a reference to the dialog that triggered the event
        var $dialog = $(e.target);

        // Check if there is a form within the dialog that may have an error list to be closed as well
        $("form", $dialog).each(function (index, form) {
            var $form = $(form);
            if ($.hasData(form) && $form.data().errorDialog !== null && $form.data().errorDialog !== undefined) {
                closeDialog($form.data().errorDialog);
            }
        });

        // Make sure it is indeed a dialog and if so, remove it from the array of current dialogs
        if ($dialog.hasClass("modal"))
            _visibleDialogs.pop($dialog);

        // If there are no dialogs displayed anymore then set the tracked content to the page
        if (!isDialogShown()) {
            SunGard.Common.SetTrackedContent();
            // Otherwise, set the newly visible dialog back as the tracked dialog if tracking is turned on
        } else {
            var newTrackedDialog = currentDialog();
            if (!isDialogTracked(newTrackedDialog))
                newTrackedDialog = null;
            SunGard.Common.SetTrackedContent(newTrackedDialog);
        }

        // Set the dialog that was closed as no longer being stacked
        $dialog.removeClass("sg-modal-stack");
    };

    //#endregion

    //#region Dialog Tracking Methods

    var isDialogTracked = function (dialog) {
        /// <summary>
        /// Indicates if the specified dialog has changes being tracked.
        /// </summary>
        /// <param name="dialog" type="jQuery object">Dialog to check if changes are being tracked</param>
        /// <returns type="boolean">Returns true if the dialog has changes being tracked, otherwise returns false</returns>

        // If a dialog wasn't provided, throw an error
        if (dialog === null || dialog === undefined || !dialog.hasClass("modal"))
            throw "A valid dialog must be provided";

        // Check if the dialog is tracking changes
        if (dialog.hasClass("sg-track-changes"))
            return true;
        else
            return false;
    };

    var isCurrentDialogTracked = function () {
        /// <summary>
        /// Indicates if the currently displayed dialog has changes being tracked.
        /// </summary>
        /// <returns type="boolean">Returns true if the dialog has changes being tracked, otherwise returns false</returns>

        // Check that a dialog is actually visible
        if (!isDialogShown())
            throw "No dialog is currently visible";

        // Check if the dialog is tracking changes
        return isDialogTracked(currentDialog());
    };

    var dialogStatus = function (status, $dialog) {
        /// <summary>
        /// Gets or sets the change status of the dialog
        /// </summary>
        /// <param name="status" type="SunGard.Common.ChangeStatus" optional="true">The change status to set the dialog to if provided.</param>
        /// <param name="$dialog" type="object" optional="true">jQuery object reference to the dialog the status is being set on or returned from.</param>
        /// <returns type="SunGard.Common.ChangeStatus">If a status was not provided, the current change status of the dialog is returned.  Otherwise, nothing is returned.</returns>

        // Get a reference to the jQuery object for the current dialog
        $dialog = $dialog || currentDialog();

        // If a status was not provided, then return the current status
        if (status === null || status === undefined) {
            // If there is no current dialog, then return a status of NoStatus
            if ($dialog === null || !isDialogTracked($dialog))
                return SunGard.Common.ChangeStatus.NoStatus;
            else
                return $dialog.data("sg.modal").dialogStatus;
            // If a status was provided, the set that as the current dialog's new status
        } else {
            if ($dialog !== null)
                $dialog.data("sg.modal").dialogStatus = status;
        }
    };

    var getUnsavedChangesMessage = function () {
        /// <summary>
        /// Gets the message that should be displayed for the current dialog when the user
        /// changes the value of one of the dialog's tracked input fields.
        /// </summary>
        /// <returns type="string">Message to display to the user</returns>

        // Make sure a dialog is currently shown
        if (!isDialogShown())
            throw "No dialog is currently visible";

        // Get a jQuery object reference to the currently shown dialog
        var $dialog = currentDialog();

        // If no value was set specifically for this dialog, then use the global setting
        if ($dialog.data("sg.modal").unsavedChangesMessage === null)
            return SunGard.Common.GetResourceString("DialogUnsavedChangesMessage");
        else
            return $dialog.data("sg.modal").unsavedChangesMessage;
    };

    var getChangesSavedMessage = function () {
        /// <summary>
        /// Gets the message that should be displayed for the current dialog when the user
        /// successfully saves the changes they made to the dialog's tracked input fields.
        /// </summary>
        /// <returns type="string">Message to display to the user</returns>

        // Make sure a dialog is currently shown
        if (!isDialogShown())
            throw "No dialog is currently visible";

        // Get a jQuery object reference to the currently shown dialog
        var $dialog = currentDialog();

        // If no value was set specifically for this dialog, then use the global setting
        if ($dialog.data("sg.modal").changesSavedMessage === null)
            return SunGard.Common.GetResourceString("DialogChangesSavedMessage");
        else
            return $dialog.data("sg.modal").changesSavedMessage;
    };

    //#endregion

    //#region Validation Methods

    var isValidDialogSize = function (size) {
        /// <summary>
        /// Validates that the passed value is a valid DialogSize value
        /// </summary>
        /// <param name="size" type="SunGard.Bootstrap.Dialog.DialogSize" optional="false">Dialog size to evaluate.</param>
        /// <returns type="boolean">Returns true if the parameter is a member of the enumeration.</returns>

        switch (size) {
            case dialogSize.Small:
            case dialogSize.Medium:
            case dialogSize.Large:
            case dialogSize.ExtraLarge:
                return true;

            default:
                return false;
        }
    };

    var isValidButtonSet = function (buttonSet) {
        /// <summary>
        /// Validates that the passed value is a valid ButtonSets value
        /// </summary>
        /// <param name="buttonSet" type="SunGard.Bootstrap.Dialog.ButtonSets" optional="false">Button set to evaluate.</param>
        /// <returns type="boolean">Returns true if the parameter is a member of the enumeration.</returns>

        switch (buttonSet) {
            case buttonSets.OkOnly:
            case buttonSets.OkCancel:
            case buttonSets.YesNo:
            case buttonSets.YesNoCancel:
            case buttonSets.SaveCancel:
            case buttonSets.SaveDeleteCancel:
            case buttonSets.None:
                return true;

            default:
                return false;
        }
    };

    var isValidTrackChanges = function (tracking) {
        /// <summary>
        /// Validates that the passed value is a valid TrackChangesOption value
        /// </summary>
        /// <param name="tracking" type="SunGard.Bootstrap.Dialog.TrackChangesOption">Track changes setting to evaluate.</param>
        /// <returns type="boolean">Returns true if the parameter is a member of the enumeration.</returns>

        switch (tracking) {
            case trackChangesOption.PageDefault:
            case trackChangesOption.None:
            case trackChangesOption.WithinDialog:
                return true;

            default:
                return false;
        }
    };

    var validateOptions = function (options) {
        /// <summary>
        /// Validate that the options provided are all valid.  Properties that are boolean types are checked to see
        /// if they are set to the opposite of the default value, and if they are not, they are set to the default value.
        /// This is done to insure that they didn't get set to something other than a boolean value without generating
        /// an error.
        /// </summary>
        /// <param name="options" type="object">The options to be used for rendering the dialog box</param>
        /// <returns type="object">Dialog box options object</returns>

        // Validate the size
        if (!isValidDialogSize(options.size))
            throw "The provided options.size is invalid";

        // Validate the tracking changes setting
        if (!isValidTrackChanges(options.trackChanges))
            throw "The provided options.trackChanges is invalid";

        // Validate the boolean settings
        if (options.modal !== false)
            options.modal = true;

        if (options.moveable !== false)
            options.moveable = true;

        if (options.resizable !== true)
            options.resizable = false;

        // Validate that the event handlers are pointing to functions if set
        if (options.okClick !== null && typeof options.okClick !== "function")
            throw "The provided options.okClick is invalid";

        if (options.yesClick !== null && typeof options.yesClick !== "function")
            throw "The provided options.yesClick is invalid";

        if (options.noClick !== null && typeof options.noClick !== "function")
            throw "The provided options.noClick is invalid";

        if (options.saveClick !== null && typeof options.saveClick !== "function")
            throw "The provided options.saveClick is invalid";

        if (options.deleteClick !== null && typeof options.deleteClick !== "function")
            throw "The provided options.deleteClick is invalid";

        if (options.cancelClick !== null && typeof options.cancelClick !== "function")
            throw "The provided options.cancelClick is invalid";

        if (options.onShow !== null && typeof options.onShow !== "function")
            throw "The provided options.onShow is invalid";

        if (options.onShown !== null && typeof options.onShown !== "function")
            throw "The provided options.onShown is invalid";

        if (options.onHide !== null && typeof options.onHide !== "function")
            throw "The provided options.onHide is invalid";

        if (options.onHidden !== null && typeof options.onHidden !== "function")
            throw "The provided options.onHidden is invalid";

        return options;
    };

    var validateButtons = function (dialogId, options, defaultButtonSet, buttons) {
        /// <summary>
        /// Validate the buttons parameter and build the button list that should be displayed on the
        /// dialog box.
        /// </summary>
        /// <param name="dialogId" type="string">ID of the dialog box wrapper.</param>
        /// <param name="options" type="object">Dialog box options.</param>
        /// <param name="defaultButtonSet">Default button set to use if no buttons are provided.</param>
        /// <param name="buttons" type="number|object[]" optional="true">Enumeration ButtonSets value or an array of button setting objects.</param>
        /// <returns type="object[]">List of button setting objects</returns>

        // If a button list was not provided, set the parameter value to indicate it should instead use
        // the specified default button set
        if (buttons === null || buttons === undefined || (typeof buttons !== "number" && $.isArray(buttons) && buttons.length === 0)) {
            buttons = defaultButtonSet;
        }

        // Initialize the button list that we'll ultimately return
        var buttonList = [];

        // Determine if the passed parameter is indicating to use a default button set
        if (typeof buttons === "number") {
            if (!isValidButtonSet(buttons))
                throw "The provided buttons parameter is invalid";

            switch (buttons) {
                case buttonSets.OkOnly:
                    buttonList.push($.extend({}, okButton, { name: dialogId + "-ok", click: options.okClick }));
                    break;

                case buttonSets.OkCancel:
                    buttonList.push($.extend({}, okButton, { name: dialogId + "-ok", click: options.okClick }));
                    buttonList.push($.extend({}, cancelButton, { name: dialogId + "-cancel", click: options.cancelClick }));
                    break;

                case buttonSets.YesNo:
                    buttonList.push($.extend({}, yesButton, { name: dialogId + "-yes", click: options.yesClick }));
                    buttonList.push($.extend({}, noButton, { name: dialogId + "-no", click: options.noClick }));
                    break;

                case buttonSets.YesNoCancel:
                    buttonList.push($.extend({}, yesButton, { name: dialogId + "-yes", click: options.yesClick }));
                    buttonList.push($.extend({}, noButton, { name: dialogId + "-no", click: options.noClick }));
                    buttonList.push($.extend({}, cancelButton, { name: dialogId + "-cancel", click: options.cancelClick }));
                    break;

                case buttonSets.SaveCancel:
                    buttonList.push($.extend({}, saveButton, { name: dialogId + "-save", click: options.saveClick }));
                    buttonList.push($.extend({}, cancelButton, { name: dialogId + "-cancel", click: options.cancelClick }));
                    break;

                case buttonSets.SaveDeleteCancel:
                    buttonList.push($.extend({}, saveButton, { name: dialogId + "-save", click: options.saveClick }));
                    buttonList.push($.extend({}, deleteButton, { name: dialogId + "-delete", click: options.deleteClick }));
                    buttonList.push($.extend({}, cancelButton, { name: dialogId + "-cancel", click: options.cancelClick }));
                    break;

                case buttonSets.None:
                    break;

                default:
                    throw "validateButtons: ButtonSet option not handled: " + buttons;
            }

            // Determine if the passed parameter is indicating to use a unique button list
        } else if ($.isArray(buttons)) {
            $.each(buttons, function (index, button) {
                // Make sure the button object has all of the necessary properties included
                button = $.extend({}, defaultButtonSettings, button);

                // Validate the properties to make sure required properties are set
                if (button.text === null || $.trim(button.text) === "")
                    throw "validateButtons: The button text property is required (index " + index + ")";

                if (button.name === null || $.trim(button.name) === "")
                    throw "validateButtons: The button name property is required (index " + index + ")";

                if (button.dismissDialog !== false)
                    button.dismissDialog = true;

                if (button.click !== null && typeof button.click !== "function")
                    throw "validateButtons: The button click property must be a function reference (index " + index + ")";

                // Add the button to the button list
                buttonList.push(button);
            });

            // An invalid value was passed as the button list, so throw an error
        } else {
            throw "The provided buttons parameter is invalid";
        }

        return buttonList;
    };

    //#endregion

    //#region Public Methods

    var initializeDialog = function (dialogId, title, buttons, options, body) {
        /// <summary>
        /// Initializes a dialog box for later use so that all that has to be done is to update the content
        /// when ready to display the dialog.
        /// </summary>
        /// <param name="dialogId" type="string">ID of the dialog box wrapper.</param>
        /// <param name="title" type="string">Title of the dialog.</param>
        /// <param name="buttons" type="number|object[]" optional="true">Array of button setting objects.</param>
        /// <param name="options" type="object" optional="true">Dialog box options.</param>
        /// <param name="body"></param>

        // Validate the parameters
        if (dialogId === null || dialogId === undefined || $.trim(dialogId) === "")
            throw "The dialogId parameter is required";

        if (title === null || title === undefined || $.trim(title) === "")
            throw "The title parameter is required";

        if (options !== null && options !== undefined && typeof options !== "object")
            throw "The options parameter must be an object";

        var dialogOptions = $.extend({}, _baseOptions, options);
        dialogOptions = validateOptions(dialogOptions);

        buttons = validateButtons(dialogId, dialogOptions, buttonSets.OkOnly, buttons);

        // Since we're initializing the dialog, if it already exists, destroy it so it can be recreated
        // without having any lingering effects from the previous version
        var $dialog = $("#" + dialogId);
        if ($dialog.length > 0)
            $dialog.remove();

        // Create the new dialog wrapper and add it to the body
        $dialog = $(SunGard.Common.Html.TagBuilder("div").GenerateId(dialogId).ToString());
        dialogContainer().append($dialog);

        // Build the dialog markup
        buildDialog($dialog, title, buttons, dialogOptions);

        // Add the body to the dialog if it was provided
        if (body !== null && body !== undefined) {
            var $body = $(".sg-modal-body-content", $dialog);
            $body.html(body);
        }
    };

    var showAlert = function (dialogId, body, title, options) {
        /// <summary>
        /// Shows a simple alert with an OK button.
        /// </summary>
        /// <param name="dialogId" type="string">ID of the dialog box wrapper.</param>
        /// <param name="body" type="string" optional="true">Content to be displayed in the dialog.</param>
        /// <param name="title" type="string" optional="true">Title of the dialog.</param>
        /// <param name="options" type="object" optional="true">Dialog box options.</param>

        // Create the default button for alerts
        var buttons = buttonSets.OkOnly;

        // Display the dialog
        showDialog(dialogId, body, title, buttons, options);
    };

    var showDialog = function (dialogId, body, title, buttons, options) {
        /// <summary>
        /// Displays a dialog box based on the parameters provided.
        /// </summary>
        /// <param name="dialogId" type="string">ID of the dialog box wrapper.</param>
        /// <param name="body" type="string" optional="true">Content to be displayed in the dialog.</param>
        /// <param name="title" type="string" optional="true">Title of the dialog.</param>
        /// <param name="buttons" type="object[]" optional="true">Array of button setting objects.</param>
        /// <param name="options" type="object" optional="true">Dialog box options.</param>

        // Stop processing if the dialog is already visible
        if (isDialogShown(dialogId)) {
            return;
        }

        // Start tracking events if not already done
        attachGlobalEvents();

        // Validate the parameters
        if (dialogId === null || dialogId === undefined || $.trim(dialogId) === "")
            throw "The dialogId parameter is required";

        if (options !== null && options !== undefined && typeof options !== "object")
            throw "The options parameter must be an object";

        var dialogOptions = $.extend({}, _baseOptions, options);
        dialogOptions = validateOptions(dialogOptions);

        // Determine if the dialog exists on the page already
        var dialogExists = false;
        var $dialog = $("#" + dialogId);

        if ($(".modal-body", $dialog).length > 0)
            dialogExists = true;

        // If the dialog doesn't exist, build it
        if (!dialogExists) {
            // When building the dialog, a title is required
            if (title === null || title === undefined || $.trim(title) === "")
                throw "The title parameter is required";

            // Validate the buttons provided
            buttons = validateButtons(dialogId, dialogOptions, buttonSets.OkOnly, buttons);

            // If the actual div for the dialog didn't exist, create it and add it to the BODY tag
            if ($dialog.length === 0) {
                $dialog = $(SunGard.Common.Html.TagBuilder("div").GenerateId(dialogId).ToString());
                dialogContainer().append($dialog);
            }

            // Build the dialog box
            buildDialog($dialog, title, buttons, dialogOptions);

            // If the dialog exists, but a title, buttons, or options were provided, then update the existing dialog
        } else if ((title !== null && title !== undefined) ||
                   (buttons !== null && buttons !== undefined) ||
                   (options !== null && options !== undefined)) {
            // Check if buttons were provided as items to be updated.  If so, validate them
            if (buttons !== null && buttons !== undefined) {
                buttons = validateButtons(dialogId, dialogOptions, buttonSets.OkOnly, buttons);
            }

            // Update the dialog box
            updateDialog($dialog, title, buttons, options);
        }

        // If updated body content was provided, put it in the dialog box
        if (body !== null && body !== undefined) {
            var $body = $(".sg-modal-body-content", $dialog);
            $body.html(body);
        }

        // Make sure that it opens at the default position instead of where the user last drug it to
        $(".modal-content", $dialog).css({ "left": "", "top": "" });

        // Show the dialog box
        $dialog.modal("show");
    };

    var closeDialog = function (dialogId) {
        /// <summary>
        /// Closes the specified dialog box.
        /// </summary>
        /// <param name="dialogId" type="string">ID of the dialog box wrapper.</param>

        // Validate the parameters
        if (dialogId === null || dialogId === undefined || $.trim(dialogId) === "")
            throw "The dialogId parameter is required";

        // Get a jQuery object reference to the dialog
        var $dialog = $("#" + dialogId);

        // If there is no dialog or if it's not currently shown, just return as there's nothing to do
        if ($dialog === null || $dialog.length === 0 || !$dialog.hasClass("in"))
            return;

        // Close the dialog
        $dialog.modal("hide");
    };

    var printDialog = function (dialogId, orientation) {
        /// <summary>
        /// Creates a PDF screen print of a dialog.
        /// </summary>
        /// <param name="dialogId" type="string">The identifier of the dialog to be printed.</param>
        /// <param name="orientation" type="SunGard.Bootstrap.ScreenPrint.PageOrientation">Page orientation to use for the screen print (default is Landscape for extra-large screens and Portrait for all other screen sizes)</param>

        // Initializations
        var $dialog = $("#" + dialogId);
        var removeHiddenFlagCssClass = "sg-remove-hidden-for-dialog-print";
        var removeInvisibleFlagCssClass = "sg-remove-invisible-for-dialog-print";

        // Get the name of the classes to apply to elements to hide them or make them invisible
        // as appropriate
        var hiddenElementCssClass = SunGard.Bootstrap.ScreenPrint.HiddenElementCssClass();
        var invisibleElementCssClass = SunGard.Bootstrap.ScreenPrint.InvisibleElementCssClass();
        var dialogHiddenElementCssClass = SunGard.Bootstrap.ScreenPrint.DialogHiddenElementCssClass();
        var dialogInvisibleElementCssClass = SunGard.Bootstrap.ScreenPrint.DialogInvisibleElementCssClass();

        // Determine the page orientation
        if (orientation === null || orientation === undefined ||
            (orientation !== SunGard.Bootstrap.ScreenPrint.PageOrientation.Portrait && orientation !== SunGard.Bootstrap.ScreenPrint.PageOrientation.Landscape)) {
            var screenSize = SunGard.Bootstrap.GetPageSize();
            orientation = SunGard.Bootstrap.ScreenPrint.PageOrientation.Portrait;
            if (screenSize === "lg" || screenSize === "xl") {
                orientation = SunGard.Bootstrap.ScreenPrint.PageOrientation.Landscape;
            }
        }

        // Find all elements that should be hidden or invisible when printing a dialog and weren't
        // already marked to be hidden for screen printing
        var $elementsHide = $("." + dialogHiddenElementCssClass + ":not(." + hiddenElementCssClass + ")");
        var $elementsInvisible = $("." + dialogInvisibleElementCssClass + ":not(." + invisibleElementCssClass + ")");
        $elementsHide.addClass(hiddenElementCssClass);
        $elementsInvisible.addClass(invisibleElementCssClass);

        // Find all visible dialogs and hide all of them except for the one being printed
        var $visibleDialogs = $(".modal.in:not(#" + dialogId + "):not(." + hiddenElementCssClass + ")");
        $visibleDialogs.addClass(hiddenElementCssClass);

        // Find all other page content that hasn't been hidden yet
        var $pageContent = $(SunGard.Common.PageContentSelector()).children();
        var pageContentToHide = $.grep($pageContent, function (element, index) {
            var $element = $(element);
            if (!$element.is("script ." + hiddenElementCssClass + " ." + invisibleElementCssClass) &&
                (!$element.attr || $element.attr("id") !== dialogId)) {
                return true;
            } else {
                return false;
            }
        });
        var $pageContentToHide = $(pageContentToHide);
        $pageContentToHide.addClass(invisibleElementCssClass);

        // Temporarily remove vertical scrollbars from all jqGrids on page
        var $dialogGridBodyElements = $('.ui-jqgrid-bdiv', $dialog).filter(function () { return this.style.height != 'auto'; });
        $dialogGridBodyElements.each(function () { $(this).data('height', this.style.height); this.style.height = 'auto'; });

        // Since the dialog height could be bigger than the page height, we need to make sure that the
        // height of the HTML is set to the height of the dialog content.
        // Also note, that the height of jqGrid rows that purely have text content appear to be shorter
        // when processed by the HiQPdf HTML-to-PDF converter than what they are when viewed within the
        // browser.  As a result, the PDF could have additional blank space at the end of the document
        // that could result in a blank page being included.
        var $html = $("html");
        var $dialogContent = $(".modal-content", $dialog);
        $html.css("height", $dialogContent.height());

        // Print the dialog
        SunGard.Bootstrap.ScreenPrint.Capture(orientation);

        // Undo jqGrid body changes
        $dialogGridBodyElements.each(function () { this.style.height = $(this).data('height'); $(this).removeData('height'); });

        // Remove any classes that were added to hide content
        $elementsHide.removeClass(hiddenElementCssClass);
        $elementsInvisible.removeClass(invisibleElementCssClass);
        $visibleDialogs.removeClass(hiddenElementCssClass);
        $pageContentToHide.removeClass(invisibleElementCssClass);

        // Remove the height that was applied to the HTML tag earlier
        $html.css("height", "");
    };

    var isDialogShown = function (dialog) {
        /// <summary>
        /// Indicates if there is at least one dialog currently shown.
        /// </summary>
        /// <returns type="boolean">Returns true if at least one dialog is shown, otherwise returns false</returns>

        if (dialog === undefined) {
            if (_visibleDialogs.length === 0) {
                return false;
            } else {
                return true;
            }
        } else {
            if (_visibleDialogs.length === 0) {
                return false;
            }

            var dialogId = null;
            var dialogVisible = false;

            switch (typeof dialog) {
                case "string":
                    dialogId = dialog;
                    break;

                case "object":
                    dialogId = dialog.attr("id");
                    break;

                default:
                    throw "The dialog parameter is of an unknown type.  It must be a string ID or a jQuery object.";
                    break;
            }

            $.each(_visibleDialogs, function (index, currentDialog) {
                if (currentDialog.attr("id") === dialogId) {
                    dialogVisible = true;
                    return false;
                }
            });

            return dialogVisible;
        }
    };

    var visibleDialogs = function () {
        /// <summary>
        /// Gets an array of jQuery object references to all open dialogs.
        /// </summary>

        return _visibleDialogs;
    }

    var currentDialog = function () {
        /// <summary>
        /// Gets a reference to the currently displayed dialog.
        /// </summary>
        /// <returns type="jQuery object">jQuery object reference to the currently displayed dialog if one is visible, otherwise returns null</returns>

        if (!isDialogShown())
            return null;
        else
            return _visibleDialogs[_visibleDialogs.length - 1];
    };

    var dialogContainer = function (container) {
        /// <summary>
        /// Gets or sets the container that dialogs should be put within.
        /// </summary>
        /// <param name="container" type=""></param>
        /// <returns type=""></returns>

        if (container === undefined) {
            if (_dialogContainer === null) {
                return $("body");
            } else {
                return _dialogContainer;
            }
        } else {
            _dialogContainer = container;
        }
    };

    //#endregion

    //#region Dialog Creation Methods

    var buildDialog = function (dialog, title, buttons, options) {
        /// <summary>
        /// Create the HTML markup for the dialog box.
        /// </summary>
        /// <param name="dialog" type="object">Reference to the jQuery dialog wrapper object.</param>
        /// <param name="title" type="string">Title of the dialog.</param>
        /// <param name="buttons" type="object[]">Array of button setting objects.</param>
        /// <param name="options" type="object">Dialog box options.</param>

        // Build an ID for the title as it needs to be referenced elsewhere within the dialog markup
        var titleId = dialog.attr("id") + "-title";

        // Determine the data-backdrop setting.  If it's a modal, then clicking outside of the dialog
        // should not be allowed.  In this instance, set it to "static".  Otherwise, if that's
        // allowed, set it to "true".
        var backdrop = "static";
        var modelessClasses = "";
        if (!options.modal) {
            backdrop = options.showBackdrop;
            if (!options.showBackdrop) {
                modelessClasses = "sg-modeless";
                switch (options.size) {
                    case dialogSize.Small:
                        modelessClasses += " sg-modeless-sm";
                        break;

                    case dialogSize.Large:
                        modelessClasses += " sg-modeless-lg";
                        break;

                    case dialogSize.ExtraLarge:
                        modelessClasses += " sg-modeless-xl";
                        break;

                    default:
                        break;
                }
            }
        }

        // Determine if the dialog is tracking changes
        var trackChangesClass = " sg-track-changes";
        if (options.trackChanges === trackChangesOption.None ||
            (options.trackChanges === trackChangesOption.PageDefault && !SunGard.Common.PageTrackingChanges()))
            trackChangesClass = "";

        // Add the additional properties and classes to the dialog wrapper
        dialog.addClass("modal modal-primary fade" + (options.cssClass === null ? "" : " " + options.cssClass) + trackChangesClass)
            .addClass(modelessClasses)
            .attr("tabindex", "-1")
            .attr("role", "dialog")
            .attr("aria-labelledby", titleId)
            .attr("aria-hidden", "true")
            .attr("data-backdrop", backdrop);

        // If the provided options indicate there classes to remove, then do so
        if (options.removeCssClass !== null && $.trim(options.removeCssClass) !== "")
            dialog.removeClass(options.removeCssClass);

        // Initialize the header HTML
        var headerHtml = "";

        if ($.isArray(buttons))
            // If no buttons are supposed to be added, don't allow the dialog to be cancelled by hitting
            // the [ESC] key
            if (buttons.length === 0)
                dialog.attr("data-keyboard", "false");
                // Add the close button to the dialog header if there are buttons being displayed
            else
                headerHtml += SunGard.Common.Html.TagBuilder("button")
                    .MergeAttribute("type", "button")
                    .AddCssClass("close")
                    .MergeAttribute("data-dismiss", "modal")
                    .MergeAttribute("aria-hidden", "true")
                    .SetInnerHtml("&times;")
                    .ToString();

        // Add the title to the dialog header
        headerHtml += SunGard.Common.Html.TagBuilder("h2")
            .AddCssClass("modal-title")
            .GenerateId(titleId)
            .SetInnerHtml(title)
            .ToString();

        // Create the header DIV
        var headerDiv = SunGard.Common.Html.TagBuilder("div")
            .AddCssClass("modal-header")
            .SetInnerHtml(headerHtml);

        if (options.moveable)
            headerDiv.AddCssClass("sg-modal-moveable");

        // Create a DIV for displaying the dialog status
        var alertSpan = SunGard.Common.Html.TagBuilder("span")
            .AddCssClass("alert");

        var statusDiv = SunGard.Common.Html.TagBuilder("div")
            .AddCssClass("col-xs-8 col-xs-offset-2 col-lg-4 col-lg-offset-4 text-center")
            .SetInnerHtml(alertSpan.ToString());

        var statusRowDiv = SunGard.Common.Html.TagBuilder("div")
            .AddCssClass("row sg-modal-save-status hidden sg-dialog-print-hidden")
            .SetInnerHtml(statusDiv.ToString());

        // Create an empty body DIV that showDialog will update when the dialog is to be shown
        var bodyContentDiv = SunGard.Common.Html.TagBuilder("div")
            .AddCssClass("sg-modal-body-content");

        // Create a DIV that will hold the dialog status and the dialog content
        var bodyDiv = SunGard.Common.Html.TagBuilder("div")
            .AddCssClass("modal-body")
            .SetInnerHtml(statusRowDiv.ToString() + bodyContentDiv.ToString());

        // Create the buttons that should render in the dialog footer
        var buttonsHtml = "";
        var createButtonEventHandlers = false;
        if ($.isArray(buttons)) {
            $.each(buttons, function (index, button) {
                if (typeof button === "object") {
                    var attributes = $.extend({}, { "type": "button", title: (button.tooltip || "") }, button.htmlAttributes);
                    if (button.dismissDialog)
                        attributes = $.extend({}, attributes, { "data-dismiss": "modal" });

                    if (buttonsHtml !== "")
                        buttonsHtml += "&nbsp;";

                    buttonsHtml += SunGard.Common.Html.TagBuilder("button")
                        .MergeAttributes(attributes)
                        .AddCssClass("btn btn-primary" + (button.cssClass === null ? "" : " " + button.cssClass))
                        .GenerateId(button.name)
                        .SetInnerHtml(button.text)
                        .ToString();

                    if (button.click !== null)
                        createButtonEventHandlers = true;
                }
            });
        }

        // Create the footer DIV
        var footerDiv = SunGard.Common.Html.TagBuilder("div")
            .AddCssClass("modal-footer sg-dialog-print-hidden")
            .SetInnerHtml(buttonsHtml);

        // Create the content DIV that includes the header, body, and footer DIVs
        var contentDiv = SunGard.Common.Html.TagBuilder("div")
            .AddCssClass("modal-content")
            .SetInnerHtml(headerDiv.ToString() + bodyDiv.ToString() + footerDiv.ToString());

        // Create the dialog DIV which specifies the size and includes the content DIV
        var dialogDiv = SunGard.Common.Html.TagBuilder("div")
            .AddCssClass(options.size)
            .SetInnerHtml(contentDiv.ToString());

        // Set the dialog DIV as the content inside of the dialog wrapper jQuery object
        dialog.html(dialogDiv.ToString());

        // Hook up any event handlers
        if (options.onShow !== null)
            dialog.on("show.bs.modal", options.onShow);

        if (options.onShown !== null)
            dialog.on("shown.bs.modal", options.onShown);

        if (options.onHide !== null)
            dialog.on("hide.bs.modal", options.onHide);

        if (options.onHidden !== null)
            dialog.on("hidden.bs.modal", options.onHidden);

        // If there are button event handlers specified, wire them up
        if (createButtonEventHandlers) {
            $.each(buttons, function (index, button) {
                $("#" + button.name, dialog).click(button.click);
            });
        }

        // Enable drag/drop
        if (options.moveable)
            SunGard.Bootstrap.Draggable.EnableDialog(dialog);

        // Store the dialog's change tracking related information in the data object
        dialog.data("sg.modal",
            {
                dialogStatus: SunGard.Common.ChangeStatus.NoStatus,
                unsavedChangesMessage: options.unsavedChangesMessage,
                changesSavedMessage: options.changesSavedMessage
            });
    };

    var updateDialog = function (dialog, title, buttons, options) {
        /// <summary>
        /// Update pieces of an already existing dialog box.
        /// </summary>
        /// <param name="dialog" type="object">Reference to the jQuery dialog wrapper object.</param>
        /// <param name="title" type="string" optional="true">Title of the dialog.</param>
        /// <param name="buttons" type="object[]" optional="true">Array of button setting objects.</param>
        /// <param name="options" type="object" optional="true">Dialog box options.</param>

        // If the title was provided, update it
        if (title !== null && title !== undefined && $.trim(title) !== "") {
            var $title = $(".modal-title", dialog);
            $title.html(title);
        }

        // If an array of buttons was provided, replace the existing buttons with the provided list of buttons
        if (buttons !== null && buttons !== undefined && $.isArray(buttons)) {
            var $footer = $(".modal-footer", dialog);

            var buttonsHtml = "";
            var createButtonEventHandlers = false;

            if (buttons.length === 0) {
                // Remove the close "X" if it exists
                var $closeButton = $(".modal-header > button.close", dialog);
                if ($closeButton.length > 0)
                    $closeButton.remove();

                // Don't allow the dialog to be cancelled by hitting the [ESC] key
                if (dialog.data("bs.modal") === null || dialog.data("bs.modal") === undefined)
                    dialog.attr("data-keyboard", "false");
                else
                    dialog.data("bs.modal").options.keyboard = false;
            } else {
                $.each(buttons, function (index, button) {
                    if (typeof button === "object") {
                        var attributes = $.extend({}, { "type": "button", title: (button.tooltip || "") }, button.htmlAttributes);
                        if (button.dismissDialog)
                            attributes = $.extend({}, attributes, { "data-dismiss": "modal" });

                        if (buttonsHtml !== "")
                            buttonsHtml += "&nbsp;";

                        buttonsHtml += SunGard.Common.Html.TagBuilder("button")
                            .MergeAttributes(attributes)
                            .AddCssClass("btn btn-primary" + (button.cssClass === null ? "" : " " + button.cssClass))
                            .GenerateId(button.name)
                            .SetInnerHtml(button.text)
                            .ToString();

                        if (button.click !== null)
                            createButtonEventHandlers = true;
                    }
                });

                // Make sure the close "X" exists
                var $closeButton = $(".modal-header > button.close", dialog);
                if ($closeButton.length === 0) {
                    var closeButtonHtml = SunGard.Common.Html.TagBuilder("button")
                        .MergeAttribute("type", "button")
                        .AddCssClass("close")
                        .MergeAttribute("data-dismiss", "modal")
                        .MergeAttribute("aria-hidden", "true")
                        .SetInnerHtml("&times;")
                        .ToString();
                    $(".modal-header > h2", dialog).before(closeButtonHtml);
                }

                // Make sure the dialog can be cancelled by hitting the [ESC] key
                if (dialog.data("bs.modal") === null || dialog.data("bs.modal") === undefined)
                    dialog.removeAttr("data-keyboard");
                else
                    dialog.data("bs.modal").options.keyboard = true;
            }

            $footer.html(buttonsHtml);

            // If there are button event handlers specified, wire them up
            if (createButtonEventHandlers) {
                $.each(buttons, function (index, button) {
                    $("#" + button.name, dialog).click(button.click);
                });
            }
        }

        // If options were provided, update the appropriate settings
        if (options !== null && options !== undefined && typeof options === "object") {
            // Make sure all properties exist in the options object
            var dialogOptions = $.extend({}, _baseOptions, options);

            // Add any additional CSS classes as specified in the options
            if (dialogOptions.cssClass !== null && $.trim(dialogOptions.cssClass) !== "")
                dialog.addClass(dialogOptions.cssClass);

            // Remove any CSS classes as specified in the options
            if (dialogOptions.removeCssClass !== null && $.trim(dialogOptions.removeCssClass) !== "")
                dialog.removeClass(dialogOptions.removeCssClass);

            // Adjust the size
            $sizeDiv = $(".modal-dialog", dialog);
            $sizeDiv.removeClass("modal-sm modal-lg").addClass(dialogOptions.size);

            // Adjust the data-backdrop setting
            if (dialog.data("bs.modal") === null || dialog.data("bs.modal") === undefined)
                dialog.attr("data-backdrop", (dialogOptions.modal ? "static" : "true"));
            else
                dialog.data("bs.modal").options.backdrop = (dialogOptions.modal ? "static" : "true");

            // Appropriately set whether we're tracking changes
            // Determine if the dialog is tracking changes
            var trackChanges = true;
            if (options.trackChanges === trackChangesOption.None ||
                (options.trackChanges === trackChangesOption.PageDefault && !SunGard.Common.PageTrackingChanges()))
                trackChanges = false;

            if (trackChanges) {
                dialog.addClass("sg-track-changes");
            } else {
                dialog.removeClass("sg-track-changes");
            }

            // Enable/disable drag/drop as appropriate (always removing the event handlers
            // so we don't have the event handlers being added multiple times)
            SunGard.Bootstrap.Draggable.Disable(dialog);
            if (dialogOptions.moveable) {
                SunGard.Bootstrap.Draggable.EnableDialog(dialog);
                $(".modal-header", dialog).addClass("sg-modal-moveable");
            } else {
                $(".modal-header", dialog).removeClass("sg-modal-moveable");
            }

            // Update the event handlers
            dialog.off("show.bs.modal")
                .off("shown.bs.modal")
                .off("hide.bs.modal")
                .off("hidden.bs.modal");

            if (dialogOptions.onShow !== null)
                dialog.on("show.bs.modal", dialogOptions.onShow);

            if (dialogOptions.onShown !== null)
                dialog.on("shown.bs.modal", dialogOptions.onShown);

            if (dialogOptions.onHide !== null)
                dialog.on("hide.bs.modal", dialogOptions.onHide);

            if (dialogOptions.onHidden !== null)
                dialog.on("hidden.bs.modal", dialogOptions.onHidden);

            // Update the dialog change tracking settings
            dialog.data("sg.modal").dialogStatus = SunGard.Common.ChangeStatus.NoStatus;
            dialog.data("sg.modal").unsavedChangesMessage = dialogOptions.unsavedChangesMessage;
            dialog.data("sg.modal").changesSavedMessage = dialogOptions.changesSavedMessage;
        }
    };

    var enableResizing = function (dialog) {
        /// <summary>
        /// Enable resizing on a dialog box.  This is currently not implemented.
        /// </summary>
        /// <param name="dialog" type="object">Reference to the jQuery dialog wrapper object.</param>

        throw "Resizing is not currently implemented";

        var $dialog = $(".modal-dialog", dialog);
        //var $dialog = $(dialog);

        $dialog.resizable();

        $dialog.on("resizestart", function (event, ui) {
            var $body = $(".modal-body", ui.element);
            $body.data("resizeData", { originalHeight: $body.height() });
        });

        $dialog.on("resize", function (event, ui) {
            ui.element.parent().css("margin-right", -ui.size.width);
            ui.element.parent().css("margin-bottom", -ui.size.height / 2);

            var $body = $(".modal-body", ui.element);
            $body.css("max-height", $body.data("resizeData").originalHeight + ui.size.height - ui.originalSize.height);
        });
    };

    //#endregion

    return {
        DialogSize: dialogSize,
        ButtonSets: buttonSets,
        TrackChangesOption: trackChangesOption,
        DialogStatus: dialogStatus,
        GetUnsavedChangesMessage: getUnsavedChangesMessage,
        GetChangesSavedMessage: getChangesSavedMessage,
        InitializeDialog: initializeDialog,
        ShowAlert: showAlert,
        ShowDialog: showDialog,
        CloseDialog: closeDialog,
        PrintDialog: printDialog,
        IsDialogShown: isDialogShown,
        VisibleDialogs: visibleDialogs,
        CurrentDialog: currentDialog,
        DialogContainer: dialogContainer
    }
}();

//#endregion

//#region jqGrid functionality

SunGard.Bootstrap.JQGrid = function () {
    var _deletedRowClass = 'sg-highlight-deleted-row';
    var _topScrollbarHeight = 16;

    var init = function () {
        /// <summary>
        /// Performs any JQGrid initializations.
        /// </summary>

        // Adjust height of frozen rows when list boxes change controls change.
        $(document).off('change', 'table.ui-jqgrid-btable .sg-select-box.form-control');
        $(document).on('change', 'table.ui-jqgrid-btable .sg-select-box.form-control', function (e) {
            var $grid = $(this).closest('table.ui-jqgrid-btable');
            if ($grid.length)
                SunGard.Bootstrap.JQGrid.AdjustFrozenColumnRowHeight($grid);
        });

        // Add event handler for clicking on the delete column header button
        //$('.ui-jqgrid-htable th').off('click', '.sg-grid-header-delete-icon');
        //$('.ui-jqgrid-htable th').on('click', '.sg-grid-header-delete-icon', function (e) {
        //SunGard.Bootstrap.Checkbox.InitalizeCheckAllButton(this, $('input.sg-delete-row', $(this).closest('.ui-jqgrid')), true);
        //});

        // Add event handler for styling changes when marking a row for deletion
        $(document).off('change', '.sg-delete-row');
        $(document).on('change', '.sg-delete-row', function (e) {
            var $this = $(this);
            strikeoutDeletedRow($this);
            // If the checkbox is supposed to also disable the subgrid, enable/disable the subgrid based on
            // state of the checkbox.
            if ($this.hasClass("sg-disable-subgrid")) {
                applySubGridAccess($this);
            }
        });
    };

    var strikeoutDeletedRows = function () {
        /// <summary>
        /// This function strikes out all grid rows marked for deletion
        /// </summary>
        $('.sg-delete-row:checked').each(function () {
            strikeoutDeletedRow($(this));
        });
    };

    var strikeoutDeletedRow = function ($element) {
        /// <summary>
        /// This function handles the logic when a user checks a grid row for deletion
        /// </summary>
        /// <param name="$element">The jQuery object representing the delete checkbox in the grid row</param>

        if (!($element instanceof jQuery))
            throw "The element parameter must be a jQuery object";

        if (!$element.hasClass('sg-delete-row'))
            throw "The element must be a grid delete checkbox";

        if ($element.hasClass(_deletedRowClass) || $element.hasClass('sg-simple-delete') || $element.hasClass('sg-suppress-strikeout'))
            return;

        var deletedCellOverlayClass = 'sg-deleted-cell-overlay';
        var $row = $element.closest('tr.jqgrow');

        var $frozenRow;
        var grid = $element.closest('table.ui-jqgrid-btable')[0];
        if (grid.grid && grid.grid.fbDiv) {
            $frozenRow = $('tr.jqgrow[id=' + $row.attr('id') + ']', grid.grid.fbDiv);
        }

        if ($element.is(":checked")) {
            $row.addClass(_deletedRowClass);
            $('[data-val=true]', $row).each(function () {
                if (!$(this).is(SunGard.Common.Validation.DisableValidationClasses)) {
                    $(this).addClass('sg-delete-element');
                    SunGard.Common.Validation.Disable($(this));
                }
            });

            if ($frozenRow !== undefined && $frozenRow.length)
                $frozenRow.addClass(_deletedRowClass);
        }
        else {
            $row.removeClass(_deletedRowClass);
            $('.sg-delete-element[data-val=true]', $row).each(function () {
                $(this).removeClass('sg-delete-element');
                SunGard.Common.Validation.Enable($(this));
            });

            if ($frozenRow !== undefined && $frozenRow.length)
                $frozenRow.removeClass(_deletedRowClass);
        }

        //Add a overlay with a higher z-index value so that the user cannot change any of the controls in the row
        var $deleteCheckbox = $element;
        var $deleteCheckboxCell = $element.closest('td');

        var $rows = $('td:visible', $row);
        if ($frozenRow !== undefined && $frozenRow.length)
            $rows = $rows.add($('td:visible', $frozenRow));

        $rows.each(function () {
            if (!$(this).is($deleteCheckboxCell)) {
                if ($deleteCheckbox.is(":checked")) {
                    $(this).prepend(SunGard.Common.Html.TagBuilder("div").AddCssClass(deletedCellOverlayClass).ToString());
                    var cellOverlay = $('.' + deletedCellOverlayClass, $(this));
                    cellOverlay.width($(this).width());
                    cellOverlay.height($(this).height() + 1);
                }
                else {
                    $('.' + deletedCellOverlayClass, $(this)).remove();
                }
            }
        });
    };

    var applySubGridAccess = function ($element) {
        /// <summary>
        /// Disables the subgrid when marking the parent grid row for deletion.
        /// </summary>
        /// <param name="$element" type="object">jQuery object of the Delete checkbox that was checked.</param>

        // Determine if the subgrid access should be disabled
        var disable = $element.is(":checked");

        // Get a reference to the row the checkbox was in.
        var $row = $element.closest("tr");

        // Find the expand/collapse icon cell
        var $expandIconCell = $("td.ui-sgcollapsed", $row);

        // Determine if the row is currently expanded or not
        var expanded = $expandIconCell.hasClass("sgexpanded");

        // If the row is currently expanded, collapse it
        if (expanded && disable) {
            var rowId = $row.attr("id");
            var $grid = $element.closest('table.ui-jqgrid-btable');
            $grid.jqGrid("collapseSubGridRow", rowId);
        }

        // Remove the class that the click event is bound to which performs the show/hide of the subgrid.  Also
        // add another class so that we can later find and reapply the class to rebind the event.
        $expandIconCell.toggleClass("sg-sgcollapsed-off", disable).toggleClass("sgcollapsed", !disable);

        // Hide the icon
        $("a", $expandIconCell).toggleClass("hidden", disable);
    };

    var resizeAllGrids = function () {
        /// <summary>
        /// Finds all grids on the page and resizes them to fit their parent container.
        /// </summary>

        var grids = $(".ui-jqgrid-btable:visible");

        if (grids !== null) {
            grids.each(function (index) {
                var gridId = $(this).attr("id");
                $('#' + gridId).jqGrid('sgResizeGrid');
            });
        }
    };

    var adjustFrozenColumnRowHeight = function (grid) {
        /// <summary>Adjusts the row height of frozen columns to match the row height of the underlying grid.</summary>
        /// <param name="grid">The grid object</param>

        if (grid === null)
            throw "The grid parameter cannot be null or undefined";

        if (grid instanceof jQuery)
            grid = grid[0];

        if (!grid.grid || !grid.grid.fbDiv)
            return;

        var $rows;
        if (typeof grid.grid.fbDiv !== "undefined") {
            $rows = $('>div>table.ui-jqgrid-btable>tbody>tr.jqgrow', grid.grid.bDiv);
            $('>table.ui-jqgrid-btable>tbody>tr.jqgrow', grid.grid.fbDiv).each(function (i) {
                var rowHeight = $($rows[i]).height();
                var rowHeightFrozen = $(this).height();

                $(">td", this).height(rowHeight);
                rowHeightFrozen = $(this).height();
                if (rowHeight !== rowHeightFrozen) {
                    $(">td", this).height(rowHeight + (rowHeight - rowHeightFrozen));
                }
            });
            $(grid.grid.fbDiv).height(grid.grid.bDiv.clientHeight);
            $(grid.grid.fbDiv).css($(grid.grid.bDiv).position());
        }

        if (typeof grid.grid.fhDiv !== "undefined") {
            $rows = $('>div>table.ui-jqgrid-htable>thead>tr', grid.grid.hDiv);
            $('>table.ui-jqgrid-htable>thead>tr', grid.grid.fhDiv).each(function (i) {
                var rowHeight = $($rows[i]).height();
                var rowHeightFrozen = $(this).height();

                $(this).height(rowHeight);
                rowHeightFrozen = $(this).height();
                if (rowHeight !== rowHeightFrozen) {
                    $(this).height(rowHeight +(rowHeight -rowHeightFrozen));
                }
            });
            $(grid.grid.fhDiv).css('height', 'auto');
            $(grid.grid.fhDiv).css($(grid.grid.hDiv).position());
        }
    };

    var getDeleteColumnModelObject = function (gridCollectionName, userAccess, htmlAttributes, suppressStrikeout, disableSubGridAccess) {
        /// <summary>
        /// This method creates the jqGrid column model object for the delete column
        /// </summary>
        /// <param name="gridCollectionName">The name of grid model property to be used when posting the form</param>
        /// <param name="userAccess">Optional parameter for when specific access is required</param>
        /// <param name="htmlAttributes">Optional attributes to add the the delete checkbox</param>
        /// <param name="suppressStrikeout">When true suppress the strikeout functionality</param>
        /// <param name="disableSubGridAccess">When true, hides the subgrid and removes ability to expand row</param>
        /// <returns type=""></returns>

        var deletePropertyName = 'Delete';
        var canDeletePropertyName = 'CanDelete';

        if (userAccess === undefined || userAccess === null)
            userAccess = SunGard.Common.GetDefaultUserAccess();

        if (disableSubGridAccess === null || disableSubGridAccess === undefined || disableSubGridAccess !== true) {
            disableSubGridAccess = false;
        }

        htmlAttributes = htmlAttributes || {};
        var existingClass = htmlAttributes["class"];
        htmlAttributes["class"] = ((existingClass !== undefined && existingClass !== null) ? $.trim(existingClass) + ' ' : '') + 'sg-delete-row';
        if (suppressStrikeout === true)
            htmlAttributes["class"] += ' sg-suppress-strikeout';
        if (disableSubGridAccess) {
            htmlAttributes["class"] += " sg-disable-subgrid";
        }

        var columnModel = {
            name: deletePropertyName,
            index: deletePropertyName,
            width: 56,
            align: 'center',
            sortable: false,
            formatter: function (cellvalue, options, rowObject) {
                var name = (gridCollectionName === undefined || gridCollectionName === null) ? deletePropertyName :
                    SunGard.Common.Html.HtmlExtensionMethods.CreateGridCollectionName(gridCollectionName, parseInt(options.rowId) - 1, options.colModel.name);
                var canDeleteName = (gridCollectionName === undefined || gridCollectionName === null) ? canDeletePropertyName :
                    SunGard.Common.Html.HtmlExtensionMethods.CreateGridCollectionName(gridCollectionName, parseInt(options.rowId) - 1, canDeletePropertyName);

                return (rowObject.CanDelete ? SunGard.Common.Html.InputExtensions.SunGardCheckBox(name, cellvalue, htmlAttributes, userAccess) :
                    SunGard.Common.Html.InputExtensions.SunGardHidden(name, 'false')) +
                    SunGard.Common.Html.InputExtensions.SunGardHidden(canDeleteName, rowObject.CanDelete.toString());
            },
            unformat: function (cellvalue, options, cell) {
                return $('input', cell).is(':checked');
            }
        };

        if (userAccess !== SunGard.Common.UserAccessType.ReadWrite)
            columnModel.hidden = true;

        return columnModel;
    };

    var getGridHeaderDeleteAllButton = function (name) {
        /// <summary>
        /// Gets the delete label button to use in the grid header delete column
        /// </summary>
        /// <param name="name">A button name, "gridHeaderDelete" will be used if none is passed</param>
        /// <returns type=""></returns>

        if (name === undefined || name === null || $.trim(name) === '')
            name = "gridHeaderDelete";

        return SunGard.Common.Html.ButtonExtensions.SunGardIconButton(SunGard.Common.Html.IconType.Delete, name, {}, { 'class': 'sg-grid-header-delete-icon', title: SunGard.Common.GetResourceString("DeleteOptionGridHeaderTooltip") });
    };

    var getArrowToggleColumnModelObject = function (name, canClose, collapsed, htmlAttributes, gridId) {
        /// <summary>
        /// Gets the column model for the arrow toggle icon for a grid.
        /// </summary>
        /// <param name="name">The name of the icon that will be used</param>
        /// <param name="canClose">Whether or not clicking the icon will collapse it if it's expanded</param>
        /// <param name="collapsed">Is the icon collapsed to start?</param>
        /// <param name="htmlAttributes">Extra html attributes that can be added</param>
        /// <returns type="">The column model.</returns>
        if (!name) { name = 'ArrowToggle'; }
        if (typeof collapsed === 'undefined' || collapsed == null) { collapsed = true; }
        var columnModel = {
            name: name,
            index: name,
            width: 25,
            align: 'center',
            sortable: false,
            formatter: function (cellvalue, options, rowObject) {
                var name = options.colModel.name + options.rowId;
                if (gridId)
                    name = SunGard.Common.Html.HtmlExtensionMethods.CreateGridCollectionName(gridId, options.rowId - 1, options.colModel.name);
                var tag = SunGard.Common.Html.TagBuilder('span');
                tag.MergeAttributes({
                    'data-is-collapsed': collapsed,
                    'data-can-collapse': !!canClose,
                    name: name
                });
                tag.GenerateId();
                tag.MergeAttributes(htmlAttributes, true);
                tag.AddCssClass('sg-arrow-toggle');
                if (collapsed) { tag.AddCssClass('sg-icon-collapsed'); }
                else { tag.AddCssClass('sg-icon-expanded'); }
                return tag.ToString();
            },
            unformat: function (cellvalue, options, cell) {
                return '';
            }
        };
        return columnModel;
    };

    var addTopScrollbar = function ($grid) {
        /// <summary>
        /// This method creates a top scrolling grid
        /// </summary>
        /// <param name="$grid">The jQuery object representing the grid to add the top scrollbar to</param>
        if (!($grid instanceof jQuery))
            throw "The grid parameter must be a jQuery object";

        var $gridView = $grid.closest('.ui-jqgrid-view');

        //If scroll wrapper already existt, do nothing
        if ($('.sg-top-scroll-wrapper', $gridView).length)
            return;

        //Create markup for top scrollbar
        var topScrollWrapper = new SunGard.Common.Html.TagBuilder('div').AddCssClass('sg-top-scroll-wrapper');
        topScrollWrapper.SetInnerHtml(new SunGard.Common.Html.TagBuilder('div').AddCssClass('sg-top-scroll-content').ToString());

        //Add to DOM
        $('.ui-jqgrid-hdiv:not(.frozen-div)', $gridView).before(topScrollWrapper.ToString());

        //Add the width of the scrollbar to the frozen sections
        $('.frozen-div.ui-jqgrid-hdiv, .frozen-bdiv.ui-jqgrid-bdiv', $gridView).css("top", "+=" + _topScrollbarHeight).css("overflow-y", "hidden");

        //Bind top scroll event to scroll grid body
        $(".sg-top-scroll-wrapper", $gridView).scroll(function () {
            var preventScrollEvent = $grid.data('prevent-scroll-event') || false;
            var $body = $(".ui-jqgrid-bdiv", $gridView);
            var $this = $(this);

            if (!preventScrollEvent && $body.scrollLeft() !== $this.scrollLeft()) {
                $body.scrollLeft($this.scrollLeft());
                $grid.data('prevent-scroll-event', true);
                return;
            }

            $grid.data('prevent-scroll-event', false);
        });

        //Bind scroll of grid body to adjust top scroll bar
        $(".ui-jqgrid-bdiv", $gridView).scroll(function () {
            var $topScroll = $(".sg-top-scroll-wrapper", $gridView);
            if ($topScroll.length === 0) return;

            var preventScrollEvent = $grid.data('prevent-scroll-event') || false;
            var $this = $(this);

            if (!preventScrollEvent && $topScroll.scrollLeft() !== $this.scrollLeft()) {
                $topScroll.scrollLeft($this.scrollLeft());
                $grid.data('prevent-scroll-event', true);
                return;
            }

            $grid.data('prevent-scroll-event', false);
        });

    };

    var getCellModifiedIndicator = function (htmlAttributes) {
        htmlAttributes = htmlAttributes || {};
        return SunGard.Common.Html.TagBuilder('div').AddCssClass('sg-grid-cell-modified-indicator').MergeAttributes(htmlAttributes).ToString();
    };

    var unformat = function (cellvalue, options, cell) {
        var cellInputControl = $(":input:not(.select2-focusser):not(.select2-input):not(.sgDeleteRow)", cell);

        if (cellInputControl.length === 0) {
            return cellvalue;
        } else if (cellInputControl.prop("type") === "checkbox") {
            return cellInputControl.is(":checked");
        } else {
            return cellInputControl.val();
        }
    };

    var toggleGridScroll = function ($element, $grid) {
        /// <summary>
        /// Toggles a grid between scrolling in the grid and scrolling on th epage.  Local Resource strings for
        /// ScrollInGrid and ScrollOnPage are required.
        /// </summary>
        /// <param name="$element" type="JQuery">The page option element clicked to toggle the grid.</param>
        /// <param name="$grid" type="JQuery">The grid to toggle.</param>

        if (typeof $element.data('grid-toggle') === "undefined" || $element.data('grid-toggle') === null) {
            $element.data('grid-toggle', 'grid');
        }
        if ($element.data('grid-toggle') === "grid") {
            $grid.jqGrid('setGridParam', { sg_autoResize: false, sg_enableHeightResize: true });
            $grid.jqGrid('setGridHeight', 'auto');
            $element.text(SunGard.Common.GetResourceString("ScrollInGrid"))
                    .data('grid-toggle', 'page');

            // Disable resize of grid when window resizes or when a collapsed parent panel is opened.        
            var selector = '#' + $grid.attr('id');
            $(window).off('resize.' + $grid.attr('id'));
            $grid.parents('.panel-collapse').each(function (idx, ele) {
                // When the panel is shown, resize the grid
                $(ele).off('shown.bs.collapse.' + $grid.attr('id'));
            });
        } else {
            $grid.jqGrid('setGridParam', { sg_autoResize: true, sg_enableHeightResize: true });
            $grid.jqGrid('linkResize');
            $element.text(SunGard.Common.GetResourceString("ScrollOnPage"))
                    .data('grid-toggle', 'grid');
        }
    };

    return {
        Init: init,
        ResizeAllGrids: resizeAllGrids,
        AdjustFrozenColumnRowHeight: adjustFrozenColumnRowHeight,
        GetDeleteColumnModelObject: getDeleteColumnModelObject,
        GetGridHeaderDeleteAllButton: getGridHeaderDeleteAllButton,
        GetArrowToggleColumnModelObject: getArrowToggleColumnModelObject,
        StrikeoutDeletedRows: strikeoutDeletedRows,
        StrikeoutDeletedRow: strikeoutDeletedRow,
        AddTopScrollbar: addTopScrollbar,
        GetCellModifiedIndicator: getCellModifiedIndicator,
        Unformat: unformat,
        ToggleGridScroll: toggleGridScroll
    }
}();

//#endregion

//#region Navigation Bar functionality

SunGard.Bootstrap.Navs = function () {
    var initializeDropdownButton = function (element) {
        /// <summary>
        /// Initializes a dropdown button by checking to see if there are any options provided.
        /// If not, hides the caret and removes ability to click it to render a menu.
        /// </summary>
        /// <param name="element" type="object">Dropdown button (&lt;li class="dropdown"/&gt;) to initialize.</param>
        var $element = $(element);
        if ($("ul li", $element).length === 0) {
            $(".dropdown-toggle", $element).attr("data-toggle", "");
            $(".caret", $element).addClass("hidden");
        }
    };

    return {
        InitializeDropdownButton: initializeDropdownButton
    }
}();

//#endregion

//#region Panels/Cards functionality

SunGard.Bootstrap.Panel = function () {
    var init = function () {
        /// <summary>Performs any initializations for Panels/Cards scripting functionality within Twitter/SunGard Bootstrap</summary>
        attachEvents();
    };

    var attachEvents = function () {
        /// <summary>Attaches events to the appropriate HTML tags for any Panels/Cards created on a page.</summary>
        var collapsiblePanels = $(".panel-collapse");
        collapsiblePanels.collapse({ toggle: false });
        $(document).on("hidden.bs.collapse", ".panel-collapse", { showHide: "hide" }, showHidePanel);
        $(document).on("shown.bs.collapse", ".panel-collapse", { showHide: "show" }, showHidePanel);

        // Handles the click on the delete button of a deletable panel
        $(document).on('click.panel.delete', '.panel > .panel-heading .sg-deletable-btn', function (e) {
            var $this = $(this);
            var $panel = $this.closest('.panel');
            var panelDeletedClass = 'sg-panel-deleted';
            SunGard.Common.SetDirty();

            if ($panel.hasClass(panelDeletedClass))
            {
                //Trigger event beforeUnDelete
                var beforeUnDeleteEvent = $.Event('beforeUnDelete');
                $panel.trigger(beforeUnDeleteEvent);
                if (beforeUnDeleteEvent.isDefaultPrevented()) return;

                $panel.removeClass(panelDeletedClass);
                $this.closest(".panel-title").css('text-decoration', 'inherit');
                $this.addClass("hidden");
                $(".sg-deletable-btn.sg-delete-btn", $panel).removeClass("hidden");
                //$('.sg-icon', $this).removeClass('fa-trash').addClass('fa-trash-o');
                var $panels = $('.panel-collapse', $panel);
                $panels.off('show.bs.collapse.deleted');
                for (var idx = $panels.length - 1; idx >= 0; --idx) {
                    var $subPanel = $($panels[idx]);
                    var $collapsedInput = $subPanel.find("input.sg-collapse-input:first");
                    if (!$subPanel.hasClass('in')) {
                        if ($collapsedInput.length > 0) {
                            $collapsedInput.trigger("click");
                        } else {
                            $subPanel.collapse('show');
                        }
                    }
                }

                //Trigger event afterUnDelete
                var afterUnDeleteEvent = $.Event('afterUnDelete');
                $panel.trigger(afterUnDeleteEvent);
            }
            else
            {
                //Trigger event beforeDelete
                var beforeDeleteEvent = $.Event('beforeDelete');
                $panel.trigger(beforeDeleteEvent);
                if (beforeDeleteEvent.isDefaultPrevented()) return;

                $panel.addClass(panelDeletedClass);
                $this.closest(".panel-title").css('text-decoration', 'line-through');
                $this.addClass("hidden");
                $(".sg-deletable-btn.sg-undelete-btn", $panel).removeClass("hidden");
                //$('.sg-icon', $this).removeClass('fa-trash-o').addClass('fa-trash');
                var $panels = $('.panel-collapse', $panel);
                for (var idx = $panels.length - 1; idx >= 0; --idx) {
                    var $subPanel = $($panels[idx]);
                    var $collapsedInput = $subPanel.find("input.sg-collapse-input:first");
                    if ($subPanel.hasClass('in')) {
                        if ($collapsedInput.length > 0) {
                            $collapsedInput.trigger("click");
                        } else {
                            $subPanel.collapse('hide');
                        }
                    }
                }
                $panels.on('show.bs.collapse.deleted', function () { return false; });

                //Trigger event afterDelete
                var afterDeleteEvent = $.Event('afterDelete');
                $panel.trigger(afterDeleteEvent);
            }
        });

        var pageTitle = $(".sg-page-title");
        var panelToggleAll = $(".panel-toggle-all");

        if (pageTitle.text() === "") {
            panelToggleAll.addClass("hidden");
        } else {
            $(".panel-toggle-all").on("click", showHideAllPanels);
        }
    };

    var showHideAllPanels = function () {
        /// <summary>Toggles all collapsible Panels/Cards between being shown or hidden.</summary>
        var pageToggle = $(this);
        var wasCollapsed = (pageToggle.attr("data-toggle").toLowerCase() === "collapsed");
        if (wasCollapsed) {
            var collapsibleContent = $(".panel-collapse:not(.in)");
            collapsibleContent.collapse("show");
            pageToggle.addClass("sg-icon-expanded").removeClass("sg-icon-collapsed");
            pageToggle.attr("data-toggle", "expanded");
        } else {
            var collapsibleContent = $(".panel-collapse.in");
            collapsibleContent.collapse("hide");
            pageToggle.addClass("sg-icon-collapsed").removeClass("sg-icon-expanded");
            pageToggle.attr("data-toggle", "collapsed");
        }
    };

    var showHidePanel = function (options) {
        /// <summary>Toggles a single collapsible Panel/Card between being shown or hidden.</summary>
        /// <param name="options" type="object">Event arguments and options that were sent when the Shown/Hidden event fired.</param>
        var id = this.id;
        var $collapsible = $(this);
        var classToAdd = "sg-icon-collapsed";
        var classToRemove = "sg-icon-expanded";

        if ($collapsible.hasClass("in")) {
            classToAdd = "sg-icon-expanded";
            classToRemove = "sg-icon-collapsed";
        }

        var collapseTitle = $("a[data-toggle='collapse'][href='#" + id + "']");
        var collapserIcon = collapseTitle.find("span.sg-icon-collapsed, span.sg-icon-expanded");

        // Since this event seems to get fired for panels that weren't actually
        // clicked on, check to see if any toggling was intended
        if (collapserIcon.hasClass(classToAdd))
            return;

        var panel = collapserIcon.closest(".panel");
        if (panel.hasClass("sg-panel-1")) {
            var panelHeading = collapserIcon.closest(".panel-heading")
            panelHeading.toggleClass("sg-panel-1-collapsed");
        }

        // is there an input that is holding whether this panel is collapsed?  If so, update the value.  The
        // icon class will change automatically through knockout binding.
        var $collapsedInput = collapseTitle.parent().find("input.sg-collapse-input");
        if ($collapsedInput.length > 0) {
            $collapsedInput.trigger("click");
        } else {
            // otherwise, set the icon class manually.
            collapserIcon.addClass(classToAdd).removeClass(classToRemove);
        }
    };

    return {
        Init: init
    };
}();

//#endregion

//#region Radio Button functionality

SunGard.Bootstrap.RadioButton = function () {
    var selectButtonGroupOption = function (selector) {
        /// <summary>
        /// Changes the selected option in a radio button toggle group to the specified
        /// radio button.
        /// </summary>
        /// <param name="selector" type="string">jQuery selector that uniquely identifies the radio button toggle to select</param>

        // Make sure a selector was provided
        if (selector === null || selector === undefined || $.trim(selector) === "")
            throw "The selector parameter is required";

        // Get a jQuery object reference to the element specified by the selector
        var $element = $(selector);

        // Make sure 1 element was found and that it isn't already checked
        if ($element === null || $element.length !== 1 || $element.prop("checked") === true)
            return;

        // Find the closest label
        var radioButtonLabel = $element.closest("label.btn");

        // If the label was not found, then it's not a button group with the
        // options acting like radio buttons and shouldn't be toggled
        if (radioButtonLabel !== null) {
            // Find the button group that this radio button is part of
            var buttonGroup = radioButtonLabel.closest("div.btn-group");

            // If a button group isn't found, then there's no radio button options
            // to toggle
            if (buttonGroup !== null) {
                // Find the LABEL element that is already checked
                var activeLabel = $("label.active", buttonGroup);

                // Find the radio button element that is already checked
                var checkedRadioButton = $("input:radio", activeLabel);

                // Uncheck the currently selected radio button
                activeLabel.removeClass("active");
                checkedRadioButton.prop("checked", false);

                // Check the newly selected radio button
                radioButtonLabel.addClass("active");
                $element.prop("checked", true);
            }
        }
    };

    var getButtonGroupValue = function (selector) {
        /// <summary>
        /// Gets the value for the selected toggle in a radio button group
        /// </summary>
        /// <param name="selector" type="string">jQuery selector that identifies the button group wrapper</param>
        /// <returns type="string">Value for the selected toggle within the specified button group</returns>

        // Make sure a selector was provided
        if (selector === null || selector === undefined || $.trim(selector) === "")
            throw "The selector parameter is required";

        // Get a jQuery object reference to the button group specified by the provided selector
        var $element = $(selector);

        // Make sure the selected element exists and is a button group
        if ($element === null || $element.length !== 1 || !$element.hasClass("btn-group"))
            return "";

        // Get the active label
        var selectedLabel = $("label.btn.active", $element);

        if (selectedLabel !== null) {
            var selectedRadioButton = $("input:radio", selectedLabel);
            if (selectedRadioButton !== null && (selectedRadioButton.prop("checked") || selectedRadioButton.attr("checked") === "checked"))
                return selectedRadioButton.val();
        }
    }

    var getSelectedValue = function (name) {
        /// <summary>
        /// Returns the value of the selected radio button for a radio button group.
        /// </summary>
        /// <param name="name" type="string">Name given to all radio buttons within the group</param>
        /// <returns type="string">Value of the radio button within the group that was currently selected</returns>

        // Make sure a name was provided
        if (name === null || name === undefined || $.trim(name) === "")
            throw "The name parameter is required";

        // Return the selected value
        return $("input[name = '" + $.trim(name) + "']:radio:checked").val();
    }

    return {
        GetButtonGroupValue: getButtonGroupValue,
        SelectButtonGroupOption: selectButtonGroupOption,
        GetSelectedValue: getSelectedValue
    };
}();

//#endregion

//#region Textarea functionality

SunGard.Bootstrap.Textarea = function () {

    var _crLfKeys = {
        "10": "line-feed",
        "13": "carriage-return"
    };

    var init = function ($container) {
        /// <summary>
        /// Performs any initialization on textareas.
        /// </summary>
        /// <param name="$container" type="object" optional="true">jQuery object to look within for textarea controls that need to be initialized.</param>

        // Find all textarea elements.  If a container was provided, only find those contained within the container.
        var $textareas = $container === null || $container === undefined ? $("textarea") : $("textarea", $container);

        // Process each textarea found that is supposed to be auto-sized on page load.
        $textareas.filter(".sg-textarea-size-on-load").each(function (index, textarea) {
            var $textarea = $(textarea);

            // Get the method of auto-sizing to perform from the element's data object.
            var dataSizing = $textarea.data("autoSize");

            // If a method of auto-sizing was found and it's valid, then resize the control.
            if (dataSizing !== null && dataSizing !== undefined && SunGard.Common.Html.HtmlExtensionMethods.IsValidAutoSizeOption(dataSizing)) {
                resize($textarea, dataSizing);
            }

            // Remove the "size on load" class so it doesn't get processed again.
            $textarea.removeClass("sg-textarea-size-on-load");
        });

        // Add an event handler that prevents typing CR/LF characters in a textarea if the element is flagged accordingly.
        $(document).off("keydown.sg");
        $(document).on("keydown.sg", "textarea.sg-textarea-prevent-crlf", function (e) {
            if (_crLfKeys[e.which]) {
                e.preventDefault();
            }
        })
    };

    var autoSizeElementToDataContent = function ($textarea, size) {
        /// <summary>
        /// Auto-sizes a textarea using the method specified.
        /// </summary>
        /// <param name="$textarea" type="object">jQuery object for a textarea control.</param>
        /// <param name="size" type="SunGard.Common.Html.TextAreaAutoSizing" optional="true">The auto-sizing method to use.  If not provided, the method indicated via the 'autoSize' data attribute will be used.</param>

        // Make sure an element was provided
        if ($textarea === null || $textarea === undefined || !($textarea instanceof jQuery) || $textarea.length !== 1 || $textarea.prop("tagName").toLowerCase() !== "textarea") {
            throw "$textarea parameter must be provided and must be a textarea";
        }

        // If a size isn't provided, see if there is a data attribute specifying the size
        if (size === null || size === undefined) {
            var dataSizing = $textarea.data("autoSize");
            if (dataSizing !== undefined && dataSizing !== "") {
                size = dataSizing;
            }
        }

        // Validate the size parameter and set it to the default value if not provided.
        if (size === null || size === undefined || !SunGard.Common.Html.HtmlExtensionMethods.IsValidAutoSizeOption(size)) {
            size = textAreaSizeOnLoad.None;
        }

        // Resize the textarea.
        resize($textarea, size);
    };

    var autoSizeToDataContent = function ($container, size, forceSizing) {
        /// <summary>
        /// Auto-sizes all textareas within a specified container using the method specified.
        /// </summary>
        /// <param name="$container" type="object" optional="true">jQuery object to look within for textarea controls that need to be initialized.</param>
        /// <param name="size" type="SunGard.Common.Html.TextAreaAutoSizing" optional="true">The auto-sizing method to use.  If not provided, the method indicated via the 'autoSize' data attribute will be used.</param>
        /// <param name="forceSizing" type="boolean" optional="true">Flag indicating if the auto-sizing method specified should always be used.  If true, it's always used.  When false, it's only used as a default when an auto-sizing method isn't specified via a data property.</param>

        // Find all textarea elements.  If a container was provided, only find those contained within the container.
        var $textareas = $container === null || $container === undefined ? $("textarea") : $("textarea", $container);

        // Validate the "force sizing" setting.  When it's not set, assume true if a valid size was provided; otherwise, false.
        if (forceSizing === null || forceSizing === undefined) {
            if (size === null || size === undefined || !SunGard.Common.Html.HtmlExtensionMethods.IsValidAutoSizeOption(size)) {
                forceSizing = false;
            } else {
                forceSizing = true;
            }
            // When it's set to true, validate that a size was provided and it's valid.  If not, throw an exception.
        } else if (forceSizing === true) {
            if (size === null || size === undefined) {
                throw "size is invalid (not provided) so can't force sizing";
            } else if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidAutoSizeOption(size)) {
                throw "size is invalid (" + size.toString() + ") so can't force sizing";
            }
            // Under any other condition, the value should be false.
        } else {
            forceSizing = false;
        }

        // Determine the auto size to use as the default if there is no setting for the textarea.
        var defaultSize = SunGard.Common.Html.TextAreaAutoSizing.None;
        if (size !== null && size !== undefined && SunGard.Common.Html.HtmlExtensionMethods.IsValidAutoSizeOption(size)) {
            defaultSize = size;
        }

        // Process each textarea
        $textareas.each(function (index, textarea) {
            var $textarea = $(textarea);

            // Determine the auto-sizing method to apply.
            var sizeToApply = defaultSize;

            // If not forcing the auto-size method, then check if there's a data property specifiying the auto-sizing to perform.
            if (!forceSizing) {
                var dataSizing = $textarea.data("autoSize");
                if (dataSizing !== null && dataSizing !== undefined && SunGard.Common.Html.HtmlExtensionMethods.IsValidAutoSizeOption(dataSizing)) {
                    sizeToApply = dataSizing;
                }
            }

            // Resize the textarea.
            resize($textarea, sizeToApply);
        });
    };

    var resize = function ($textarea, size) {
        /// <summary>
        /// Resizes a textarea using the specified auto-sizing method.
        /// </summary>
        /// <param name="$textarea" type="object">jQuery object for a textarea control.</param>
        /// <param name="size" type="SunGard.Common.Html.TextAreaAutoSizing">The auto-sizing method to use.</param>

        var height = $textarea.height();
        var scrollHeight = $textarea.prop("scrollHeight");

        switch (size) {
            case SunGard.Common.Html.TextAreaAutoSizing.None:
                // Do nothing
                break;

            case SunGard.Common.Html.TextAreaAutoSizing.LargerOnly:
                if (scrollHeight > height) {
                    $textarea.height(scrollHeight);
                }
                break;

                // Leaving these options commented for future implementation.
                //case SunGard.Common.Html.TextAreaAutoSizing.SmallerOnly:
                //    break;

                // Leaving these options commented for future implementation.
                //case SunGard.Common.Html.TextAreaAutoSizing.Any:
                //    break;

            default:
                throw "Unknown auto-sizing method: " + size;
                break;
        }
    };

    return {
        Init: init,
        AutoSizeElementToDataContent: autoSizeElementToDataContent,
        AutoSizeToDataContent: autoSizeToDataContent
    }
}();

//#endregion Textarea functionality

//#region Bootstrap Plugins

SunGard.Bootstrap.Plugins = function () {

    var init = function () {
        SunGard.Bootstrap.DropDownList.Init();
        SunGard.Bootstrap.Datepicker.Init();
        SunGard.Bootstrap.Timepicker.Init();
        SunGard.Bootstrap.Colorpicker.Init();

        $(window).scroll(function () {
            $('.sg-datepicker').datepicker('hide');
        });
    };

    var getValueFromDataAttribute = function(str) {
        /// <summary>
        /// This method checks to see if a string represents a javascript variable (with or without a namespace)
        /// </summary>
        /// <param name="str"></param>
        /// <returns type=""></returns>
        if ($.type(str) !== "string")
            return str;

        var value;
        var namespaceSplit = str.split('.');
        for (var i = 0; i < namespaceSplit.length; i++) {
            value = (value === undefined) ? window[namespaceSplit[i]] : value[namespaceSplit[i]];
            if (value !== undefined && value !== null && ($.isPlainObject(value) || $.isFunction(value) || $.isArray(value)))
                continue;
            value = null;
            break;
        }

        return value || str;
    }

    return {
        Init: init,
        GetValueFromDataAttribute: getValueFromDataAttribute
    };
}();

//#endregion

//#region DropDownList functionality

SunGard.Bootstrap.DropDownList = function () {

    var _deserializedOptions = {};

    //#region Drop Down Initialization

    var init = function (container, callback) {
        /// <summary>
        /// This code initializes select2 on all controls that have a class of sg-select-box-init
        /// </summary>
        /// <param name="container">Initializes select2 on all elements which are children of the passed container</param>

        // Get the objects that should only be initialized when focus is given to them and attach a focus
        // even to perform the initialization
        var $initOnFocus = (container == null) ? $(".sg-select-box-init.sg-select-init-on-focus").not(".sg-delay-init") : $(".sg-select-box-init.sg-select-init-on-focus", container).not(".sg-delay-init");
        $(document).off("mousedown.sg.select2", ".sg-select-init-on-focus:not(.sg-delay-init)");
        $(document).on("mousedown.sg.select2", ".sg-select-init-on-focus:not(.sg-delay-init)", function (e) {
            var $this = $(this);
            if (!$this.is(":focus")) {
                $this.data("clicked", true);
            }
        });
        $(document).off("focus.sg.select2", ".sg-select-init-on-focus:not(.sg-delay-init)");
        $(document).on("focus.sg.select2", ".sg-select-init-on-focus:not(.sg-delay-init)", function (e) {
            var $this = $(this);
            $this.removeClass("sg-select-init-on-focus").addClass("sg-select2-hide-arrow");
            var clicked = $this.data("clicked");
            if (clicked === null || clicked === undefined || clicked !== true) {
                clicked = false;
            }
            $this.removeData("clicked");
            init($this.parent(), function () {
                setTimeout(function () {
                    if (clicked) {
                        $this.select2("open");
                    } else {
                        $this.select2("focus");
                    }
                }, 1);
            });
            e.preventDefault = true;
        });

        var $init = (container == null) ? $('.sg-select-box-init').not('.sg-delay-init').not('.sg-select-init-on-focus') : $('.sg-select-box-init', container).not('.sg-delay-init').not('.sg-select-init-on-focus');

        $(document).off('change.validation', '.select2-offscreen.sg-select-box[data-val=true]');
        $(document).on('change.validation', '.select2-offscreen.sg-select-box[data-val=true]', function () {
            //Trigger validation on select2 controls when the change event is fired.  This for some reason does not happen automatically
            var validator = $(this).closest('form').data('validator');
            if (validator !== undefined && validator !== null) {
                validator.element($(this));
                if ($(this).hasClass('valid')) {
                    SunGard.Common.Validation.DestroyPopover($(this).select2('container'));
                }
            }
        });
        $(document).off('select2-focus.validation ', '.select2-offscreen.sg-select-box[data-val=true]');
        $(document).on('select2-focus.validation ', '.select2-offscreen.sg-select-box[data-val=true]', function (e) {
            if ($(this).hasClass('input-validation-error')) {
                var $container = $(this).select2('container');
                var content = $(this).next('.field-validation-error').text();
                SunGard.Common.Validation.CreatePopover($container, content, 'manual');
                $container.popover("show");
            }
        });
        $(document).off('select2-blur.validation ', '.select2-offscreen.sg-select-box[data-val=true]');
        $(document).on('select2-blur.validation ', '.select2-offscreen.sg-select-box[data-val=true]', function (e) {
            if ($(this).hasClass('input-validation-error')) {
                SunGard.Common.Validation.DestroyPopover($(this).select2('container'));
            }
        });
        $(document).off("optionDataChanged.sg.select2", ".select2-offscreen.sg-select-box");
        $(document).on("optionDataChanged.sg.select2", ".select2-offscreen.sg-select-box", optionDataChanged);
        $init.each(function () {
            var $this = $(this);
            $this.removeClass('sg-select-box-init');

            var parameters = $this.data();
            for (var p in parameters) {
                if (parameters.hasOwnProperty(p)) {
                    parameters[p] = SunGard.Bootstrap.Plugins.GetValueFromDataAttribute(parameters[p]);
                }
            }

            var idProperty = (parameters["sgIdProperty"] === null || parameters["sgIdProperty"] === undefined ? "id" : parameters["sgIdProperty"]);
            if ($this.prop("tagName").toLowerCase() !== "select" && (parameters["id"] === null || parameters["id"] === undefined)) {
                parameters.id = function (item) {
                    return $.trim(item[idProperty]);
                };
            }

            $this.select2(parameters);
            $this.addClass('sg-select-box');

            if ($this.hasClass('sg-select-box-init-disabled')) {
                $this.removeClass('sg-select-box-init-disabled');
                $this.addClass('sg-select-box-disabled');
                $this.select2("enable", false);
            }
            if ($this.hasClass("sg-select-box-init-readonly")) {
                $this.removeClass("sg-select-box-init-readonly")
                    .addClass("sg-select-box-readonly")
                    .select2("readonly", true);
            }
        });

        $('.sg-select-all-select', $init.parent()).on('change', function () {
            toggleCheckAllBtn(this);
        });
        $('.sg-select-all-select', $init.parent()).each(function () {
            toggleCheckAllBtn(this);
        });
        $('.sg-select-all-btn', $init.parent()).on('change', function () {
            selectAllOptions(this);
        });

        if (callback !== null && callback !== undefined && $.isFunction(callback)) {
            callback();
        }
    };

    //#endregion

    //#region Create "Invalid Value" Options

    var processDataOptions = function (data) {
        /// <summary>
        /// Processes the data options to add/remove options based on application business rules.
        /// </summary>
        /// <param name="data" type="object[]">Data options to process</param>
        /// <returns type="object[]">The data options for the dropdown control after applying the application business rules.</returns>

        var $element = $(this);

        if ($element.data("sg-process-invalid-selections")) {
            var invalidValueOptionText = $element.data("sg-invalid-value-option-text");
            var alwaysAddInvalidValues = $element.data("sg-always-add-invalid-values");
            data.results = processInvalidSelections.call(this, data.results, invalidValueOptionText, alwaysAddInvalidValues);
        }

        return data;
    };

    var processInvalidSelections = function (data, invalidValueOptionText, alwaysAddInvalidValues) {
        /// <summary>
        /// Processes the data list to make sure invalid selections appear in the list and generate the
        /// necessary unobtrusive validation errors.
        /// </summary>
        /// <param name="data" type="object[]">Data list for the control.</param>
        /// <param name="invalidValueOptionText" type="string" optional="true">Text to display as the description for the invlid values if other than the default.</param>
        /// <param name="alwaysAddInvalidValues" type="boolean">Flag indicating whether the data list should always be checked to make sure the invalid selections have been added.</param>
        /// <returns type=""></returns>

        // Get a reference to the element we're processing the options for
        var $element = $(this);

        // Set the default value for always adding invalid values
        if (alwaysAddInvalidValues === null || alwaysAddInvalidValues === undefined || alwaysAddInvalidValues !== true) {
            alwaysAddInvalidValues = false;
        }

        // Only do the processing if the element is configured to check for invalid
        // selections and the invalid value check hasn't been done before
        if (typeof $element.data("val-sginvalidselections-values") === "undefined" || alwaysAddInvalidValues) {
            // Get the currently selected values and turn it into an array
            var selectedValues = $element.val();
            if ($.trim(selectedValues) === "") {
                selectedValues = [];
            } else if (isNaN(selectedValues) && selectedValues.indexOf(",") >= 0) {
                selectedValues = selectedValues.split(",");
            } else {
                selectedValues = [selectedValues];
            }

            // Get the name of the data id and text properties
            var idProperty = $element.data("sg-id-property") || "id";
            var textProperty = $element.data("sg-text-property") || "text";

            // Get the invalid value option text
            if (invalidValueOptionText === null || invalidValueOptionText === undefined || $.trim(invalidValueOptionText) === "") {
                invalidValueOptionText = SunGard.Common.GetResourceString("InvalidValueOptionText");
            }

            // Initialize the array of invalid selected options
            var invalidOptions = [];
            var optionsToAdd = [];

            // Get an array of the option values
            var dataValues = [];
            if (data.length > 0) {
                // If the data for the dropdown is grouped, it will have a property called children.
                // This property is an array of the ACTUAL DATA to validate against.
                if (data[0].hasOwnProperty("children")) {
                    for (var index = 0, len = data.length; index < len; ++index) {
                        // Loop through the children of this group and add to the list of values.
                        var children = data[index].children;
                        for (var childIndex = 0, childLen = children.length; childIndex < childLen; ++childIndex) {
                            var child = children[childIndex];
                            dataValues.push($.trim(child[idProperty]).toLowerCase())
                        }
                    }
                } else {
                    dataValues = $(data).map(function () {
                        return $.trim(this[idProperty]).toLowerCase();
                    });
                }
            }

            if (alwaysAddInvalidValues && typeof $element.data("val-sginvalidselections-values") !== "undefined") {
                // Get the list of invalid options that were previously found
                var values = $element.data("val-sginvalidselections-values");
                if (values !== null && values !== undefined) {
                    invalidOptions = $.isArray(values) ? values : $.parseJSON(values);
                }

                if (invalidOptions.length > 0) {
                    var temp = $(invalidOptions).map(function () {
                        return $.trim(this).toLowerCase();
                    });

                    // Process each selected value
                    $(selectedValues).each(function (index, value) {
                        // If the selected value is in the list of invalid options and is also
                        // not in the list of options, then add it to the list of options to add
                        if ($.inArray($.trim(value).toLowerCase(), temp) >= 0 &&
                            $.inArray($.trim(value).toLowerCase(), dataValues) === -1) {
                            optionsToAdd.push(value);
                        }
                    });
                }
            } else {
                // Process each selected value to see if it's valid
                $(selectedValues).each(function (index, value) {
                    // If the value is not in the list of options, add it to the array
                    // for further processing
                    if ($.inArray($.trim(value).toLowerCase(), dataValues) === -1) {
                        optionsToAdd.push(value);
                        invalidOptions.push(value);
                    }
                });

                // Set the unobtrusive validation "values" property
                $element.data("val-sginvalidselections-values", invalidOptions);
            }

            // Add any invalid options to the data array
            if (optionsToAdd.length > 0) {
                $element.addClass("sg-show-invalid-value-error");
                $(optionsToAdd).each(function (index, invalidValue) {
                    var newValue = {};
                    newValue[idProperty] = invalidValue;
                    newValue[textProperty] = invalidValueOptionText;
                    data.push(newValue);
                });
            }
        }

        // Return the updated data array
        return data;
    }

    //#endregion

    //#region Formatters

    var formatCodeDescription = function (item, container) {
        if (item === null || item === undefined) return '';

        var idProperty = this.element.attr("data-sg-id-property");
        var textProperty = this.element.attr("data-sg-text-property");

        var code = $.trim(item[idProperty]);
        var desc = $.trim(item[textProperty]);
        var codeAndDescription = code;

        if (desc !== '') {
            var descriptionSpan = SunGard.Common.Html.TagBuilder("span")
                .AddCssClass("sg-result-description")
                .SetInnerHtml(desc);
            codeAndDescription += ' - ' + descriptionSpan.ToString();
        }

        var tagBuilder = SunGard.Common.Html.TagBuilder("div")
            .AddCssClass("sg-result-container")
            .SetInnerHtml(codeAndDescription);

        return tagBuilder.ToString();
    };

    var formatCode = function (item, container) {
        var idProperty = this.element.attr("data-sg-id-property");

        return (item === null || item === undefined) ? '' : $.trim(item[idProperty]);
    };

    var formatDescription = function (item, container) {
        var textProperty = this.element.attr("data-sg-text-property");

        var returnValue = (item === null || item === undefined) ? "" : $.trim(item[textProperty]);

        var tagBuilder = SunGard.Common.Html.TagBuilder("div")
            .AddCssClass("sg-result-container")
            .SetInnerHtml(returnValue);

        return tagBuilder.ToString();
    }

    //#endregion

    //#region Sorters

    var sortMatchesFirst = function (results, container, query) {
        if (results && results.length > 1 && this.element !== null && this.element !== undefined) {
            var data = $(this.element).data();
            var sortOrder = data.sgSortOrder.toString();
            var idProperty = data.sgIdProperty;
            var textProperty = data.sgTextProperty;
            results = applySortOrder(results, sortOrder, idProperty, textProperty);
        }
        if (results && results.length > 1 && results[0].children === undefined && query && query.term) {
            var idProperty = this.element.attr("data-sg-id-property");
            var textProperty = this.element.attr("data-sg-text-property");
            var term = query.term.toLowerCase();

            for (var i = 0; i < results.length; i++) {
                if ($.trim(results[i][idProperty]).toLowerCase() === term || $.trim(results[i][textProperty]).toLowerCase() === term) {
                    results.splice(0, 0, results.splice(i, 1)[0]);
                    break;
                }
            }
        }

        return results;
    };

    var applySortOrder = function (results, sortOrder, idProperty, textProperty) {
        if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidDropdownSortOrder(sortOrder)) {
            sortOrder = SunGard.Common.Html.DropdownSortOrder.UseDefault;
        }

        switch (sortOrder) {
            case SunGard.Common.Html.DropdownSortOrder.UseDefault:
            case SunGard.Common.Html.DropdownSortOrder.Description:
                return results.sort(function (a, b) {
                    var aDescription = a[textProperty] === null || a[textProperty] === undefined ? "" : a[textProperty].toLowerCase();
                    var bDescription = b[textProperty] === null || b[textProperty] === undefined ? "" : b[textProperty].toLowerCase();

                    return aDescription < bDescription ? -1 : aDescription > bDescription ? 1 : 0;
                });
                break;

            case SunGard.Common.Html.DropdownSortOrder.Code:
                return results.sort(function (a, b) {
                    var aCode = a[idProperty] === null || a[idProperty] === undefined ? "" : a[idProperty].toLowerCase();
                    var bCode = b[idProperty] === null || b[idProperty] === undefined ? "" : b[idProperty].toLowerCase();

                    return aCode < bCode ? -1 : aCode > bCode ? 1 : 0;
                });
                break;

            case SunGard.Common.Html.DropdownSortOrder.None:
                return results;
                break;
        }
    }

    //#endregion

    //#region Matchers

    var codeDescriptionMatcher = function (term, text, option) {
        var code = "";
        var idProperty = this.element.attr("data-sg-id-property");

        if (text === null) {
            text = "";
        }

        if (option[idProperty] === undefined || option[idProperty] === null) {
            if (option.attr !== undefined) {
                code = option.attr("value");
            }
        } else {
            code = option[idProperty];
        }
        code = code.toString();

        return text.toUpperCase().indexOf(term.toUpperCase()) >= 0 ||
            code.toUpperCase().indexOf(term.toUpperCase()) >= 0;
    };

    var codeMatcher = function (term, text, option) {
        var code = "";
        var idProperty = this.element.attr("data-sg-id-property");

        if (option[idProperty] === undefined || option[idProperty] === null) {
            if (option.attr !== undefined) {
                code = option.attr("value");
            }
        } else {
            code = option[idProperty];
        }

        return code.toUpperCase().indexOf(term.toUpperCase()) >= 0;
    };

    var descriptionMatcher = function (term, text, option) {
        if (text === null) {
            text = "";
        }

        return text.toUpperCase().indexOf(term.toUpperCase()) >= 0;
    };

    //#endregion

    //#region Data List Options

    var getSelectListOptions = function () {
        /// <summary>
        /// Retrieves the list of options when stored as a data attribute.
        /// </summary>

        // Initialize the returned dropdown data
        var dropdownData = [];

        // Determine the text property.
        var $element = $(this);
        var textProperty = $element.data("sgTextProperty");

        // Determine the ID
        var id = $element.attr("id");

        // If the text property was found, get the list of options
        if (textProperty !== null && textProperty !== undefined) {
            // Check if we already deserialized this list of options
            if (_deserializedOptions.hasOwnProperty(id)) {
                dropdownData = _deserializedOptions[id];
                // Otherwise, get the list of options from the data attribute
            } else {
                var serializedOptions = $element.data("selectListOptions");
                // If the serialized options were found, deserialize them.
                if (serializedOptions !== null && serializedOptions !== undefined) {
                    var parsedOptions = $.isArray(serializedOptions) ? serializedOptions : $.parseJSON(serializedOptions);
                    // If the parsed options result in an array, use the array; otherwise use the default empty array.
                    if ($.isArray(parsedOptions)) {
                        dropdownData = parsedOptions;
                    }
                    _deserializedOptions[id] = dropdownData;
                }
            }
        }

        // Return the valid options
        return { text: textProperty, results: dropdownData };
    };

    //#endregion Data List Options

    //#region "Select All" Button processing

    var selectAllOptions = function (sender) {
        var $sender = $(sender);
        var props = $sender.data();
        var $item = $(props.selectName, $sender.closest(".input-group"));

        var allData;

        if ($item.data().data == undefined) {
            allData = $.makeArray($item.find('option').map(function (index, val) { return { text: $(val).html(), id: $(val).prop('value') }; }));
        } else {
            allData = SunGard.Select2.SunGardDataProcessing($item, $item.data().data).results;
        }

        if ($sender.is(':checked')) {
            $item.select2('data', allData);
        }
        else {
            $item.select2('data', []);
        }
        $item.trigger("change");
    };

    var toggleCheckAllBtn = function (sender) {
        var $sender = $(sender);

        if ($sender.hasClass("select2-container")) {
            return;
        }

        var props = $sender.data();
        var $item = $(props.selectAllBtn, $sender.closest(".input-group"));

        var allData;

        if (props.data == undefined) {
            allData = $.makeArray($sender.find('option').map(function (index, val) { return { text: $(val).html(), id: $(val).prop('value') }; }));
        } else {
            allData = props.data.call($sender).results;
        }
        var selectedData = $sender.select2('data');

        if (($item.is(':checked') && (allData.length !== selectedData.length || allData.length === 0)) || (!$item.is(':checked') && (allData.length === selectedData.length && allData.length !== 0)))
            SunGard.Bootstrap.Checkbox.ToggleCheckboxButton($item);
    };

    var optionDataChanged = function (e) {
        /// <summary>
        /// Handles the optionDataChanged event on a select2 element.
        /// </summary>
        /// <param name="e" type="object">Event object</param>

        // Get a reference to the element that triggered the event.
        var $element = $(this);

        // If element has unobtrusive validation checking for invalid selections, the 
        // options previously flagged as invalid should be cleared since the option list has
        // now changed
        if (typeof $element.data("val-sginvalidselections") !== "undefined") {
            $element.data("val-sginvalidselections-values", []);
        }

        // Determine if the select2 control is tied to a SELECT tag or INPUT tag
        var dataList = $element.prop("tagName").toLowerCase() === "input";

        // Determine if this is a multi-select control
        var multiSelect = ($element.prop("multiple") || ($element.data() && $element.data().multiple !== undefined && ($element.data().multiple === true || $element.data().multiple.toLowerCase() === "true")));

        // Get the id and text property names used when referencing an option item
        var idProperty = $element.data().sgIdProperty;
        var textProperty = $element.data().sgTextProperty;

        // Get an array of the valid options
        var elementData;
        if (dataList) {
            elementData = $element.data().data.call($element).results;
        } else {
            elementData = $.makeArray($element.find("option").map(function (index, option) { return { id: $(option).prop("value"), text: $(option).html() }; }));
        }

        // Process multi-select controls
        if (multiSelect) {
            // Get the list of currently selected options
            var selectedData = $element.select2("data");

            // Initialize the list of options that will remain selected
            var newSelectedData = [];

            // Check if each selected option still exists in the list of valid options
            $(selectedData).each(function (index, option) {
                var optionValid = ($(elementData).filter(function (index, element) {
                    return $.trim(element[idProperty]).toLowerCase() === $.trim(option[idProperty]).toLowerCase();
                }).length > 0);
                if (optionValid) {
                    newSelectedData.push(option[idProperty]);
                }
            });

            // Update the selected values for the control to those that were found to still exist, if any
            $element.select2("val", newSelectedData);

            // Toggle the "Select All" button based on the newly selected options
            toggleCheckAllBtn(this);
            // Process single-select controls
        } else {
            // If the select2 is bound to a SELECT tag, the selected option is automatically
            // processed as you change the options, so make sure the displayed select2 value
            // matches what is really selected
            if (!dataList) {
                $element.select2("val", $element.val());
                // When the select2 is bound to an INPUT tag, we must verify that the selected value
                // is still a valid option
            } else {
                var selectedOption = $element.select2("val");
                var optionValid = ($(elementData).filter(function (index, element) {
                    return element[idProperty].trim().toLowerCase() === selectedOption.trim().toLowerCase();
                }).length > 0);

                // If the selected option is no longer valid, blank out the selected value
                if (!optionValid) {
                    $element.select2("val", "");
                }
            }
        }
    };

    //#endregion

    return {
        Init: init,
        ProcessDataOptions: processDataOptions,
        ProcessInvalidSelections: processInvalidSelections,
        FormatCodeDescription: formatCodeDescription,
        FormatCode: formatCode,
        FormatDescription: formatDescription,
        SortMatchesFirst: sortMatchesFirst,
        CodeDescriptionMatcher: codeDescriptionMatcher,
        CodeMatcher: codeMatcher,
        DescriptionMatcher: descriptionMatcher,
        GetSelectListOptions: getSelectListOptions
    };
}();

//#endregion

//#region Bootstrap Datepicker functionality

SunGard.Bootstrap.Datepicker = function () {

    //#region Datepickers Initialization
    var init = function (container) {
        /// <summary>
        /// This code initializes datepicker on all controls that have a class of sg-datepicker-init
        /// </summary>
        /// <param name="container">Initializes datepicker on all elements which are children of the passed container</param>

        container = container || $(document);

        //Initialize all rows that have the sg-datepicker-init class, except those that have sg-datepicker-init and sg-delay-init
        //var $init = $('div.sg-datepicker-init:has(input:not(.sg-delay-init)), input.sg-datepicker-init:not(.sg-delay-init)', container);
        var $init = $('div.sg-datepicker-init', container).has('input:not(.sg-delay-init)')
            .add($('input.sg-datepicker-init', container).not('.sg-delay-init'));

        $init.each(function () {
            var $this = $(this);
            $this.removeClass('sg-datepicker-init');

            var parameters = $this.data();
            for (var p in parameters) {
                if (parameters.hasOwnProperty(p)) {
                    parameters[p] = SunGard.Bootstrap.Plugins.GetValueFromDataAttribute(parameters[p]);
                }
            }

            $this.datepicker(parameters);
            $this.addClass('sg-datepicker');

            if ($this.hasClass('input-group') && $this.hasClass('date'))
                $('input', $this).off('focus');
        });

        bindDatepickerEvents();
    };

    var bindDatepickerEvents = function () {
        $(document).off('keydown', '.sg-datepicker-input');
        $(document).on('keydown', '.sg-datepicker-input', function (e) {
            var formatString = "MM/DD/YYYY";
            var fireChangeEvent = false;

            if (e.which == 84) { // "t" or "T" : Set to today's date
                $(this).val(moment().format(formatString));
                e.preventDefault();
                fireChangeEvent = true;
            }
            if (e.which == 77) { // "m" or "M" : Set to first day of current month
                var currentDate = moment();
                currentDate.date(1);
                $(this).val(currentDate.format(formatString));
                e.preventDefault();
                fireChangeEvent = true;
            }
            if (e.which == 89) { // "y" or "Y" : Set to first day of current year
                var currentDate = moment();
                currentDate.month(0);
                currentDate.date(1);
                $(this).val(currentDate.format(formatString));
                e.preventDefault();
                fireChangeEvent = true;
            }
            if (e.which == 187) { // "+" or "=" : Increase entered date by one day
                var parsedDate = moment($(this).val());
                if (parsedDate.isValid()) {
                    parsedDate.add("d", 1);
                    $(this).val(parsedDate.format(formatString));
                    e.preventDefault();
                    fireChangeEvent = true;
                }
            }
            if (e.which == 189) { // "_" or "-" : Decrease entered date by one day
                var parsedDate = moment($(this).val());
                if (parsedDate.isValid()) {
                    parsedDate.subtract("d", 1);
                    $(this).val(parsedDate.format(formatString));
                    e.preventDefault();
                    fireChangeEvent = true;
                }
            }
            if (e.which == 221) { // "]" : Increase entered date by one month
                var parsedDate = moment($(this).val());
                if (parsedDate.isValid()) {
                    parsedDate.add("M", 1);
                    $(this).val(parsedDate.format(formatString));
                    e.preventDefault();
                    fireChangeEvent = true;
                }
            }
            if (e.which == 219) { // "[" : Decrease entered date by one month
                var parsedDate = moment($(this).val());
                if (parsedDate.isValid()) {
                    parsedDate.subtract("M", 1);
                    $(this).val(parsedDate.format(formatString));
                    e.preventDefault();
                    fireChangeEvent = true;
                }
            }

            if (fireChangeEvent)
                $(this).trigger("change");
        });

        //Validate date using moment.js on blur
        $(document).off('blur', '.sg-datepicker-input');
        $(document).on('blur', '.sg-datepicker-input', function (e) {
            var $this = $(this);
            var originalValue = $this.val();

            //Handle comma separated multidate
            if ($this.val().indexOf(',') >= 0) {
                var dates = $this.val().split(',');
                var formattedDates = [];

                for (var i = 0; i < dates.length; i++) {
                    var date = SunGard.Common.FormatDate(dates[i]);
                    if (date !== '')
                        formattedDates.push(date);
                    else
                        formattedDates.push(dates[i]);
                }
                $this.val(formattedDates.length > 0 ? formattedDates.join(",") : '');
            }
            else {
                var newValue = SunGard.Common.FormatDate($this.val());
                $this.val(newValue);
                if (originalValue != newValue) {
                    $this.trigger("change");
                    $this.trigger("blur");
                }
            }
        });
    };

    //#endregion

    return {
        Init: init
    };
}();

//#endregion

//#region Bootstrap Timepicker functionality

SunGard.Bootstrap.Timepicker = function () {

    //#region Datepickers Initialization
    var init = function (container) {
        /// <summary>
        /// This code initializes datetimepicker on all controls that have a class of sg-timepicker-init
        /// </summary>
        /// <param name="container">Initializes datetimepicker on all elements which are children of the passed container</param>

        container = container || $(document);

        //Initialize all rows that have the sg-datepicker-init class, except those that have sg-datepicker-init and sg-delay-init
        //var $init = $('div.sg-timepicker-init:has(input:not(.sg-delay-init))', container);
        var $init = $('div.sg-timepicker-init', container).has('input:not(.sg-delay-init)');

        $init.each(function () {
            var $this = $(this);
            $this.removeClass('sg-timepicker-init');

            var parameters = $this.data();
            for (var p in parameters) {
                if (parameters.hasOwnProperty(p)) {
                    parameters[p] = SunGard.Bootstrap.Plugins.GetValueFromDataAttribute(parameters[p]);
                }
            }

            $this.datetimepicker(parameters).on('dp.show', function (e) {
                $(':input', e.target).val(SunGard.Common.FormatTime(e.date));
            });
            $this.addClass('sg-timepicker');
        });

        bindTimepickerEvents();
    };

    var bindTimepickerEvents = function () {
        var timePickerSelector = '.sg-timepicker-input:not(.sg-text-readonly)';
        $(document).off('keydown', timePickerSelector);
        $(document).on('keydown', timePickerSelector, function (e) {
            var formatString = "hh:mm A";
            var fireChangeEvent = false;

            if ($(this).closest('.sg-timepicker').data('use-seconds') === true)
                formatString = "hh:mm:ss A";

            if (e.which == 84) { // "t" or "T" : set to the current time.
                $(this).val(new moment().format(formatString));
                e.preventDefault();
                fireChangeEvent = true;
            }
            if (e.which == 187) { // "+" or "=" : increase the time in increments of 5. The first time you press the keystroke, the entered time is increased to the next five minute interval. For example, if you entered 11:07 and pressed +, the time would be updated to 11:10.
                var parsedTime = SunGard.Common.GetTimeMoment($(this).val());
                if (parsedTime.isValid()) {
                    var minutes = (parsedTime.minute() % 5 === 0) ? 5 : (5 - (parsedTime.minute() % 5));
                    parsedTime.add("m", minutes);
                    $(this).val(parsedTime.format(formatString));
                    e.preventDefault();
                    fireChangeEvent = true;
                }
            }
            if (e.which == 189) { // "_" or "-" : decrease the time in increments of 5. The first time you press the keystroke, the entered time is decreased to the previous five minute interval. For example, if you entered 11:07 and pressed -, the time would be updated to 11:05.
                var parsedTime = SunGard.Common.GetTimeMoment($(this).val());
                if (parsedTime.isValid()) {
                    var minutes = (parsedTime.minute() % 5 === 0) ? 5 : (parsedTime.minute() % 5);
                    parsedTime.subtract("m", minutes);
                    $(this).val(parsedTime.format(formatString));
                    e.preventDefault();
                    fireChangeEvent = true;
                }
            }
            if (e.which == 221) { // "]" : increase the time entered by one hour.
                var parsedTime = SunGard.Common.GetTimeMoment($(this).val());
                if (parsedTime.isValid()) {
                    parsedTime.add("h", 1);
                    $(this).val(parsedTime.format(formatString));
                    e.preventDefault();
                    fireChangeEvent = true;
                }
            }
            if (e.which == 219) { // "[" : decrease the time entered by one hour.
                var parsedTime = SunGard.Common.GetTimeMoment($(this).val());
                if (parsedTime.isValid()) {
                    parsedTime.subtract("h", 1);
                    $(this).val(parsedTime.format(formatString));
                    e.preventDefault();
                    fireChangeEvent = true;
                }
            }
            if (e.which == 72) { // "h" : Round time down to the hour
                var parsedTime = SunGard.Common.GetTimeMoment($(this).val());
                if (parsedTime.isValid()) {
                    parsedTime.minute(0);
                    parsedTime.second(0);
                    $(this).val(parsedTime.format(formatString));
                    e.preventDefault();
                    fireChangeEvent = true;
                }
            }

            if (fireChangeEvent)
                $(this).trigger("change");
        });

    };

    //#endregion

    return {
        Init: init
    };
}();

//#endregion

//#region Colorpicker functionality

SunGard.Bootstrap.Colorpicker = function ($) {
    var init = function (container) {
        /// <summary>
        /// This code initializes colorpicker on all controls that have a class of sg-timepicker-init
        /// </summary>
        /// <param name="container">Initializes colorpicker on all elements which are children of the passed container</param>

        container = container || $(document);

        //Initialize all rows that have the sg-datepicker-init class, except those that have sg-datepicker-init and sg-delay-init
        var $init = $('div.sg-color-picker-init:not(.sg-delay-init)', container);

        $init.each(function () {
            $this = $(this);
            $this.removeClass('sg-color-picker-init');

            var $picker = $this.find('input[type=hidden]');
            var $input = $this.find('input[type=text]');

            var parameters = $picker.data();
            for (var p in parameters) {
                if (parameters.hasOwnProperty(p)) {
                    var paramValue = SunGard.Bootstrap.Plugins.GetValueFromDataAttribute(parameters[p]);
                    if (p === "palette" || p === "selectionPalette") {
                        if ($.isFunction(paramValue)) {
                            paramValue = paramValue();
                        } else if (typeof paramValue === "string") {
                            try {
                                var palette = JSON.parse(paramValue);
                                paramValue = palette
                            } catch (e) {
                                // do nothing
                            }
                        }
                    }
                    parameters[p] = paramValue;
                }
            }

            spectrumParameters = $.extend({},
                {
                    move: function (color) { setTbColor($('#' + $input.prop('id')), tinycolor(color.toHexString())); },
                    palette: [['000000', '660000', '996600', '666600', '006600', '006666', '000066', '660066', '6600cc'],
                              ['666666', 'cc0000', 'ff6600', 'cccc00', '00cc00', '00cccc', '0000cc', 'cc00cc', '6666ff'],
                              ['cccccc', 'ff0000', 'ffcc00', 'ffff00', '00ff00', '00ffff', '0033ff', 'ff66ff', 'cc66ff']]
                }, parameters);

            $picker.spectrum(spectrumParameters);
            $picker.on('change', function (e) {
                var $tb = $('#' + $input.prop('id'));
                setTbColor($tb, tinycolor($(e.target).spectrum('get')));
                $tb.trigger("change");
            });
            $input.on('change', function (e) {
                $('#' + $picker.prop('id')).spectrum('set', $(e.target).val().replace(' ', ''));
            });

            $('#' + $picker.prop('id')).spectrum('set', $input.val().replace(' ', ''));
            setTbColor($input, tinycolor($input.val()));
        });
    };

    var setTbColor = function ($tb, color) {
        if (color.toName()) {
            $tb.val(color.toName());
        } else {
            $tb.val(color.toHex());
        }
    }

    return {
        Init: init
    };
}($);

//#endregion

//#region Bootstrap Draggable

SunGard.Bootstrap.Draggable = function () {

    var _index = 0;

    var enableDialog = function (dialog) {
        /// <summary>
        /// Enable drag/drop on the dialog box.
        /// </summary>
        /// <param name="dialog" type="object">Reference to the jQuery dialog wrapper object.</param>
        enable(dialog, ".modal-content", ".modal-header");
    };

    var enable = function (container, content, handle) {
        /// <summary>
        /// Enable drag/drop on a container.
        /// </summary>
        /// <param name="container" type="object">Reference to the jQuery container wrapper object.</param>
        /// <param name="content" type="string">The selector of the element containing the content which be become draggable</param>
        /// <param name="handle" type="string">The selector of the element used to drag the container. Only elements that descend from the container element are permitted.</param>

        // Create data fields on the jQuery reference for storing data regarding the container's drag/drop state
        container.data("draggableData", { isMouseDown: false, mouseOffset: { top: 0, left: 0 } });
        container.data("content", content);
        container.data("handle", handle);
        container.data("namespace", "draggable" + _index++);

        // Establish the dragstart event
        $(handle, container).on("mousedown", { "container": container }, handleMouseDownEvent);

        // Establish the dragend event
        container.on("mouseup mouseleave", { "container": container }, handleMouseUpLeaveEvent);

        // Establish the drag event
        $("body").on("mousemove." + container.data("namespace"), { "container": container }, bodyMouseMoveEvent);
    };

    var handleMouseDownEvent = function (event) {
        // Track that the mouse button was held down and what the mouse offset was related to the
        // container top left corner
        var container = event.data.container;
        var $content = $(container.data("content"), container);

        // Check if this is a modeless dialog
        if (container.hasClass("sg-modeless")) {
            var updateOffset = false;
            // If the left margin is less than 0, the dialog hadn't been moved previously.  Only perform
            // this processing if it had been moved previously
            if (parseInt(container.css("margin-left"), 10) >= 0) {
                var middleLeft = (container.parent().outerWidth() - $content.outerWidth()) / 2;
                var offsetLeft = parseInt(container.css("left"), 10);
                var offsetTop = parseInt(container.css("top"), 10) + parseInt($content.parent().css("margin-top"), 10) + $(document).scrollTop();
                updateOffset = true;
            }
            container.removeClass("sg-modeless").addClass("sg-modeless-dragging");
            container.css("top", "");
            container.css("left", "");
            container.css("margin-left", "");
            if (updateOffset) {
                $content.offset({ left: offsetLeft, top: offsetTop });
            }
        }

        container.data("draggableData").isMouseDown = true;
        var offset = $content.offset();
        container.data("draggableData").mouseOffset.top = event.clientY - offset.top;
        container.data("draggableData").mouseOffset.left = event.clientX - offset.left;
    };

    var handleMouseUpLeaveEvent = function (event) {
        var container = event.data.container;
        // Make sure the mouse button was flagged as being down
        if (container.data("draggableData").isMouseDown) {
            // Indicate that the mouse button is no longer being held down
            container.data("draggableData").isMouseDown = false;

            // If it was a modeless dialog that was being dragged, then there is more processing that has to be done
            if (container.hasClass("sg-modeless-dragging")) {
                var $content = $(container.data("content"), container);
                var offset = $content.offset();
                var left = parseInt(container.css("margin-left"), 10) + offset.left;
                var top = offset.top - parseInt($content.parent().css("margin-top"), 10) - $(document).scrollTop();
                container.css("left", left);
                container.css("top", top);
                container.css("margin-left", 0);
                container.removeClass("sg-modeless-dragging").addClass("sg-modeless");
                $content.css("left", "");
                $content.css("top", "");
            }
        }
    };

    var bodyMouseMoveEvent = function (event) {
        // If the mouse button was not clicked and held down while in the container header prior to 
        // the mouse being moved, then do nothing
        var container = event.data.container;
        if (container.data("draggableData") === null || container.data("draggableData") === undefined || !container.data("draggableData").isMouseDown) {
            return;
        }

        // Set the top left offset for the container content based on where the mouse currently is
        // and where it started out
        var $content = $(container.data("content"), container);
        $content.offset({
            top: event.clientY - container.data("draggableData").mouseOffset.top,
            left: event.clientX - container.data("draggableData").mouseOffset.left
        });
    };

    var disable = function (container) {
        if (container.data("draggableData") === null || container.data("draggableData") === undefined)
            return;

        container.removeData('draggableData content handle namespace');
        $(container.data("handle"), container).unbind("mousedown", handleMouseDownEvent);
        container.unbind("mouseup mouseleave", handleMouseUpLeaveEvent);
        $("body").unbind("mousemove." + container.data("namespace"), bodyMouseMoveEvent);
    };

    return {
        Enable: enable,
        EnableDialog: enableDialog,
        Disable: disable
    };
}();

//#endregion

//#region Bootstrap ScreenPrint
SunGard.Bootstrap.ScreenPrint = function () {
    var capture = function (pageOrientation) {
        /// <summary>
        /// This function executes captures the screen and converts it to a PDF which is opened in a new browser tab.
        /// </summary>
        /// <param name="pageOrientation">The page orientation of the Pdf: Portrait vs. Landscape</param>

        var url = SunGard.Common.GetScreenPrintUrl();
        if (url === null) {
            SunGard.Bootstrap.Dialog.ShowAlert("screen-print-error", "The screen print functionality has not been implemented in this application.", "Screen Print Error");
            return;
        }

        // Find all elements in the DOM with a height:100% style property.  This property messes up the PDF to HTML converter tool.
        var $elements = $("[style*='height']").filter(function () { return this.style.height == '100%' });

        // Temporarily change the height:100% attributes to height:auto
        $elements.each(function () { this.style.height = 'auto'; });

        // Temporarily remove vertical scrollbars from all jqGrids on page
        var $gridBodyElements = $('.ui-jqgrid-bdiv').filter(function () { return this.style.height != 'auto' });
        $gridBodyElements.each(function () { $(this).data('height', this.style.height); this.style.height = 'auto'; });

        // We need to temporarily hide all jqgrid frozen content because it gets messy in HiQPdf
        var $frozenElements = $('.frozen-div.ui-jqgrid-hdiv,.frozen-bdiv.ui-jqgrid-bdiv');
        $frozenElements.addClass('sg-screen-print-hidden');

        // Alter the page so textarea control content is fully printable
        $(".sg-textarea-printable").each(function (index, textarea) {
            var $textarea = $(textarea);
            var $printView = $(".sg-textarea-print-view").filter(function (pvIndex, printView) {
                var $div = $(printView);
                if ($div.data("controlContent").toUpperCase() === $textarea.attr("id").toUpperCase()) {
                    return true;
                } else {
                    return false;
                }
            });
            $textarea.addClass("hidden");
            var $uneditable = $printView.children(".sg-uneditable-value");
            $uneditable.html(SunGard.Common.HtmlEncode($textarea.text()).replace(/\n/g, "<br />"));
            $printView.removeClass("hidden");
        });

        // Encode page markup
        var html = encodeURIComponent(getHTMLWithUpdatedValues());

        // Undo the page changes to textarea controls.
        $(".sg-textarea-print-view:not(.hidden) .sg-uneditable-value").html("");
        $(".sg-textarea-print-view:not(.hidden)").addClass("hidden");
        $(".sg-textarea-printable.hidden").removeClass("hidden");

        // Undo changes to height property
        $elements.each(function () { this.style.height = '100%'; });

        // Undo jqGrid body changes
        $gridBodyElements.each(function () { this.style.height = $(this).data('height'); $(this).removeData('height'); });

        // Undo frozen changes
        $frozenElements.removeClass('sg-screen-print-hidden');

        var innerHtml = '';
        if (pageOrientation !== null && pageOrientation !== undefined && pageOrientation !== '')
            innerHtml += SunGard.Common.Html.TagBuilder('input').MergeAttributes({ 'type': 'hidden', 'name': 'pageOrientation', 'value': pageOrientation }).ToString();

        var $form = $(SunGard.Common.Html.TagBuilder('form')
            .MergeAttributes({ 'action': url, 'method': 'post', 'target': '_blank' })
            .SetInnerHtml(
                SunGard.Common.Html.TagBuilder('input').MergeAttributes({ 'type': 'hidden', 'name': 'html', 'value': html }).ToString() +
                SunGard.Common.Html.TagBuilder('input').MergeAttributes({ 'type': 'hidden', 'name': 'browserViewportWidth', 'value': $(window).width() }).ToString() +
                innerHtml)
            .ToString());

        $('body').append($form);
        $form.submit();
        $form.remove();
    };

    var getHTMLWithUpdatedValues = function () {
        /// <summary>
        /// Gets the current page's HTML, only updated with any values changed by the user.
        /// </summary>

        // Iterate each visible input control on the page
        $(':input:visible:not(button)').each(function () {
            var $element = $(this);

            if ($element.is(':radio') || $element.is(':checkbox')) {
                // Cannot use the .prop() jQuery function here because it does not change the markup.  The markup needs to indidcate whether the control is checked or not
                if ($element.is(':checked')) {
                    $element.attr("checked", "checked");
                }
                else {
                    $element.removeAttr("checked");
                }
            }
            else if ($element.is('select')) {
                $element.find("option").each(function () {
                    var $option = $(this);

                    // Cannot use the .prop() jQuery function here because it does not change the markup.  The markup needs to indidcate whether the control is selected or not
                    if ($option.is(':selected')) {
                        $option.attr("selected", "selected");
                    } else {
                        $option.removeAttr("selected");
                    }
                });

            }
            else if ($element.is(':text') || $element.is('textarea')) {
                this.defaultValue = $element.val();
            }
        });

        return document.documentElement.outerHTML;
    };

    return {
        Capture: capture,
        HiddenElementCssClass: function () { return "sg-screen-print-hidden"; },
        InvisibleElementCssClass: function () { return "sg-screen-print-invisible"; },
        DialogHiddenElementCssClass: function () { return "sg-dialog-print-hidden"; },
        DialogInvisibleElementCssClass: function () { return "sg-dialog-print-invisible"; },
        PageOrientation: { Portrait: "Portrait", Landscape: "Landscape" }
    };
}();
//#endregion

//#region ArrowToggle functionality

SunGard.Bootstrap.ArrowToggle = function ($) {
    var init = function () {
        /// <summary>
        /// Initializes the arrow toggle to allow the events for sg-arrow-toggle-expanding and sg-arrow-toggle-collapsing
        /// </summary>
        $(document).on('click', '.sg-arrow-toggle', function (e) {
            toggle(this, true);
        });
    };
    var toggle = function (arrow, useCanCollapse) {
        var $this = $(arrow);
        var data = $this.data();
        var collapsed = data.isCollapsed;
        if (collapsed) {
            $this.data('is-collapsed', !data.isCollapsed);
            $this.removeClass('sg-icon-collapsed');
            $this.addClass('sg-icon-expanded');
            $this.trigger('sg-arrow-toggle-expanding');
        } else if (data.canCollapse || !useCanCollapse) {
            $this.data('is-collapsed', !data.isCollapsed);
            $this.addClass('sg-icon-collapsed');
            $this.removeClass('sg-icon-expanded');
            $this.trigger('sg-arrow-toggle-collapsing');
        }
    };
    return {
        Init: init,
        Toggle: toggle
    };
}($);
//#endregion