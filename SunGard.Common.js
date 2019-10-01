//#region File Info
/*
 * ------------------------------------------------------------------------------------------------
 * © Copyright 2012 SunGard K-12 Education, All Rights Reserved.
 * This program is PROPRIETARY and CONFIDENTIAL information of SunGard K-12 Education, and may not
 * be disclosed or used except as expressly authorized in a license agreement controlling such use
 * and disclosure.  Unauthorized use of this program will result in legal proceedings, civil
 * damages, and possible criminal prosecution.
 * ------------------------------------------------------------------------------------------------
 * System Name: Sungard Common
 * ------------------------------------------------------------------------------------------------
 * File Name: Sungard.Common.js
 * ------------------------------------------------------------------------------------------------
 * File Description:
 *   jQuery script file for client-side processing that can be used by any application.
 * ------------------------------------------------------------------------------------------------
 */
//#endregion

var SunGard = (SunGard || {});

SunGard.Common = function () {

    //#region Private properties

    //The resource string dictionary
    var _resourceDictionary = {},

        // AJAX related variables
        _activeAJaxCalls = [],
        _whenAjaxCallStartsCallback = [],
        _whenAjaxCallEndsCallback = [],

        // AJAX Spinner variables
        _suppressSpinner = false,

        // Grid and content resizing variables
        _resizeTimerSet = false,
        _resizeTimer = 0,

        // Root URL
        _rootUrl = "",
        _apiUrl = "",

        // User security
        _userAccess,

        // AJAX Methods
        _customAjaxErrorDialogWindowOptions = {},

        // Grid navigation variables
        _arrowIndex = 0,

        // Keys allowed in Read-only textboxes
        _allowedReadOnlyKeys = {
            "33": "page-up",
            "34": "page-down",
            "35": "end",
            "36": "home",
            "37": "arrow-left",
            "38": "arrow-up",
            "39": "arrow-right",
            "40": "arrow-down",
            "9": "tab"
        },

        // Change status variables
        _currentFormType = null,
        _trackedDialog = null,
        _changeTrackingContainer = null,
        _changeTrackingMessage = null,
        _pageStatus = null,
        _trackChanges = true,
        _unsavedChangesMessage = null,
        _changesSavedMessage = null,
        _defaultNavigateAwayOptions = null,
        _resetUnloadHandlers = false,
        _saveFn = null,

        // Screen printing variables
        _screenPrintUrl = null,

        // Page Content Selector Property variables
        _pageHeaderSelector = null,
        _pageContentSelector = null,
        _pageFooterSelector = null,

        // Auto Focus on Load
        _focusOnLoadEnabled = true;

    //#endregion

    //#region Enumerations

    var UseTokenWhenTypes = {
        NONE: 0,
        AJAX: 1,
        LEGACY: 2,
        BOTH: 3
    };

    var userAccessType = {
        NoAccess: 0,
        ReadOnly: 1,
        ReadWrite: 2
    };

    var changeStatus = {
        NoStatus: 0,
        UnsavedChanges: 1,
        ChangesSaved: 2
    };

    var inputFormTypes = {
        Page: 0,
        Dialog: 1
    };

    //#endregion

    //#region Initialization Method

    var init = function (url, trackChanges, spinnerID, apiUrl) {
        /// <summary>Performs any common initializations within a SunGard K-12 application.</summary>
        /// <param name="url" type="string">The application URL not including the protocol, server, or port number.</param>
        /// <param name="trackChanges" type="Boolean">Indicates if changes should be tracked on this page.</param>
        /// <param name="spinnerID" type="string">The id of the element used for displaying the spiller.</param>
        /// <param name="apiUrl" type="string">The application api URL not including the protocol, server, or port number.</param>

        if (spinnerID === undefined || spinnerID === null) {
            spinnerID = "AjaxSpinner";
        }
        _$spinner = $('#' + spinnerID);
        if (spinnerID === "AjaxSpinner") {
            _$spinner.html(createDefaultSpinner());
        }

        initializeExtentions();

        _rootUrl = url;

        //If there is a trailing slash, remove it
        if (_rootUrl.lastIndexOf("\/") === (_rootUrl.length - 1)) {
            _rootUrl = _rootUrl.substr(0, (_rootUrl.length - 1));
        }

        if (typeof apiUrl !== "undefined") {
            // set the base url for the api layer.
            _apiUrl = apiUrl;

            //If there is a trailing slash, remove it
            if (_apiUrl.lastIndexOf("\/") === (_apiUrl.length - 1)) {
                _apiUrl = _apiUrl.substr(0, (_apiUrl.length - 1));
            }
        } else {
            // otherwise, use the root url and add /api.
            _apiUrl = _rootUrl + "/api";
        }

        if (trackChanges === false) {
            _trackChanges = trackChanges;
        }

        setTrackedContent();
        initializeChangeStatus();
        monitorPageChanges();

        $(document).off('keydown', '.sg-text-readonly');
        $(document).on('keydown', '.sg-text-readonly', function (e) {
            if (!_allowedReadOnlyKeys[e.which]) {
                e.preventDefault();
            }
        });

        // Handle the resize event
        $(window).resize(resizePageContent);

        // Handle affix nav items
        $('#affix-nav').affix({ offset: { top: $('#affix-nav').offset().top } })
            .on('affix-top.bs.affix', affixTopEventHandler)
            .on('affix.bs.affix', affixEventHandler)
            .on('shown.bs.collapse', affixEventHandler)
            .on('hidden.bs.collapse', affixEventHandler)
            .on('heightchange', affixEventHandler);
    };

    var affixEventHandler = function (e) {
        var $src = getAffix(e);
        var $parent = $src.parent();
        var newHeight = $src.height();
        $parent.height(newHeight);
        //$parent.animate({ height: newHeight, queue: false });
        SunGard.Common.ConsoleLog('Adjust Affix Height: ' + newHeight + '  event: ' + e.type);
    };

    var affixTopEventHandler = function (e) {
        var $src = getAffix(e);
        var $parent = $src.parent();
        $parent.css('height', 'auto');
        SunGard.Common.ConsoleLog('Adjust Affix Height: auto  event: ' + e.type);
    };

    var getAffix = function (e) {
        var $src = $(e.target);
        if ($src.attr('id') !== 'affix-nav') {
            $src = $src.parents('#affix-nav');
        }

        return $src;
    };
    //#endregion

    //#region Adjust Page Padding

    var adjustPagePadding = function () {
        /// <summary>Adjusts page padding for any banners and footers that are using absolute or fixed positioning.</summary>

        //var topTotal = 0;
        //var bottomTotal = 27;

        //var bannerContainers = $(".sg-banner-container").filter(":visible");
        //bannerContainers.each(function (index, element) {
        //    var $element = $(element);
        //    var includeContainer = true;

        //    if (($element.hasClass("collapse") && !$element.hasClass("in")) || $element.hasClass("collapsing"))
        //        includeContainer = false;

        //    if (includeContainer) {
        //        $element.css("top", topTotal);

        //        var containerHeight = getElementHeight(element);
        //        topTotal += containerHeight;
        //    }
        //});

        //if (topTotal > 0) {
        //    $(".sg-main-content").css("paddingTop", topTotal);
        //}

        //var footerContainers = $(".sg-footer-container").filter(":visible");
        //footerContainers.each(function (index, element) {
        //    var $element = $(element);
        //    var includeContainer = true;

        //    if (($element.hasClass("collaps") && !$element.hasClass("in")) || $element.hasClass("collapsing"))
        //        includeContainer = false;

        //    if (includeContainer) {
        //        var containerHeight = getElementHeight(element);
        //        bottomTotal += containerHeight;
        //    }
        //});

        //if (bottomTotal > 0) {
        //    $(".sg-page-content").css("paddingBottom", bottomTotal);
        //}
    };

    //#endregion

    //#region Element Height/Width Methods

    var getElementHeight = function (element, includePadding, includeBorders, includeMargins) {
        /// <summary>Gets the height of an element</summary>
        /// <param name="element" type="object">The HTML object you're trying to determine the height for.</param>
        /// <param name="includePadding" type="boolean" mayBeNull="true" optional="true">
        /// Flag indicating if you want padding to be included when determining the element's height.  The default value is true.
        /// </param>
        /// <param name="includeBorders" type="boolean" mayBeNull="true" optional="true">
        /// Flag indicating if you want borders to be included when determining the element's height.  The default value is true.
        /// </param>
        /// <param name="includeMargins" type="boolean" mayBeNull="true" optional="true">
        /// Flag indicating if you want margins to be included when determining the element's height.  The default value is true.
        /// </param>
        /// <returns type="number">The height of the element in pixels.</returns>

        var $element = $(element);
        var elementHeight = 0;

        if ($element.length > 0) {
            consoleLog($element[0].className + ":");
        }

        if (includePadding === null || includePadding === undefined) {
            includePadding = true;
        }

        if (includeBorders === null || includeBorders === undefined) {
            includeBorders = true;
        }

        if (includeMargins === null || includeMargins === undefined) {
            includeMargins = true;
        }

        var temp = parseInt($element.height(), 10);
        if (!isNaN(temp)) {
            elementHeight += temp;
            consoleLog("* Height: " + temp);
        }

        if (includePadding) {
            temp = parseInt($element.css("paddingTop"), 10);
            if (!isNaN(temp)) {
                elementHeight += temp;
                consoleLog("* Padding Top: " + temp);
            }

            temp = parseInt($element.css("paddingBottom"), 10);
            if (!isNaN(temp)) {
                elementHeight += temp;
                consoleLog("* Padding Bottom: " + temp);
            }
        }

        if (includeBorders) {
            temp = parseInt($element.css("border-top-width"), 10);
            if (!isNaN(temp)) {
                elementHeight += temp;
                consoleLog("* Border Top: " + temp);
            }

            temp = parseInt($element.css("border-bottom-width"), 10);
            if (!isNaN(temp)) {
                elementHeight += temp;
                consoleLog("* Border Bottom: " + temp);
            }
        }

        if (includeMargins) {
            temp = parseInt($element.css("marginTop"), 10);
            if (!isNaN(temp)) {
                elementHeight += temp;
                consoleLog("* Margin Top: " + temp);
            }

            temp = parseInt($element.css("marginBottom"), 10);
            if (!isNaN(temp)) {
                elementHeight += temp;
                consoleLog("* Margin Bottom: " + temp);
            }
        }

        consoleLog("* Total Height: " + elementHeight);
        consoleLog("");

        return elementHeight;
    };

    var getElementWidth = function (element, includePadding, includeBorders, includeMargins) {
        /// <summary>Gets the width of an element</summary>
        /// <param name="element" type="object">The HTML object you're trying to determine the width for.</param>
        /// <param name="includePadding" type="boolean" mayBeNull="true" optional="true">
        /// Flag indicating if you want padding to be included when determining the element's width.  The default value is true.
        /// </param>
        /// <param name="includeBorders" type="boolean" mayBeNull="true" optional="true">
        /// Flag indicating if you want borders to be included when determining the element's width.  The default value is true.
        /// </param>
        /// <param name="includeMargins" type="boolean" mayBeNull="true" optional="true">
        /// Flag indicating if you want margins to be included when determining the element's width.  The default value is true.
        /// </param>
        /// <returns type="number">The width of the element in pixels.</returns>

        var $element = $(element);
        var elementWidth = 0;

        if (includePadding === null || includePadding === undefined) {
            includePadding = true;
        }

        if (includeBorders === null || includeBorders === undefined) {
            includeBorders = true;
        }

        if (includeMargins === null || includeMargins === undefined) {
            includeMargins = true;
        }

        var temp = parseInt($element.width(), 10);
        if (!isNaN(temp)) {
            elementWidth += temp;
        }

        if (includePadding) {
            temp = parseInt($element.css("paddingLeft"), 10);
            if (!isNaN(temp)) {
                elementWidth += temp;
            }

            temp = parseInt($element.css("paddingRight"), 10);
            if (!isNaN(temp)) {
                elementWidth += temp;
            }
        }

        if (includeBorders) {
            temp = parseInt($element.css("border-left-width"), 10);
            if (!isNaN(temp)) {
                elementWidth += temp;
            }

            temp = parseInt($element.css("border-right-width"), 10);
            if (!isNaN(temp)) {
                elementWidth += temp;
            }
        }

        if (includeMargins) {
            temp = parseInt($element.css("marginLeft"), 10);
            if (!isNaN(temp)) {
                elementWidth += temp;
            }

            temp = parseInt($element.css("marginRight"), 10);
            if (!isNaN(temp)) {
                elementWidth += temp;
            }
        }

        return elementWidth;
    };

    //#endregion

    //#region Root URL

    var rootURL = function () {
        /// <summary>
        /// Returns the root application URL that was provided during the Initialization functionality.
        /// </summary>
        /// <returns type="string">URL</returns>

        return _rootUrl;
    };

    var rootApiURL = function () {
        /// <summary>
        /// Returns the root application api URL that was provided during the Initialization functionality.
        /// </summary>
        /// <returns type="string">URL</returns>

        return _apiUrl;
    };

    //#endregion

    //#region Access Online Help

    var showOnlineHelp = function (area, controller, action) {
        /// <summary>
        /// Displays online help.
        /// </summary>
        /// <param name="area">The Area portion of the URL</param>
        /// <param name="controller">The Controller portion of the URL</param>
        /// <param name="action">The Action portion of the URL</param>

        var helpPage;

        if ($('#HelpFile').length) {
            helpPage = $('#HelpFile').val();

            // Strip any leading slashes off the help file name.
            helpPage = helpPage.replace(/^\/+/, '');
        } else {
            helpPage = (area !== "" ? area + "_" : "") + controller + "_" + action;
        }

        var helpFilePartial = $("#helpFilePartial");
        if (helpFilePartial !== null && helpFilePartial.length === 1 && helpFilePartial.val() !== "") {
            helpPage += "_" + helpFilePartial.val();
        }

        if (helpUrl.length > 0 && helpPage.length > 0) {
            var win = window.open(helpUrl + "#cshid=" + encodeURI(helpPage), "onlineHelp", "toolbar=yes,resizable=yes,scrollbars=yes,location=yes");
            if (win !== null) {
                win.focus();
            }
        }
    };

    //#endregion

    //#region Page Actions (Timestamps and Dirty Status Messages)

    var setPageTimestamp = function (changeDateTime, changeUid) {
        /// <summary>
        /// Displays the "Last modified" timestamp for the page.
        /// </summary>
        /// <param name="changeDateTime" type="datetime"></param>
        /// <param name="changeUid" type="string" mayBeNull="true" optional="true"></param>

        var changeTimeStamp = "";

        if (changeUid === null || changeUid === undefined) {
            changeUid = "";
        } else {
            changeUid = " by " + changeUid;
        }

        // Validate the date/time passed in to be a valid date/time and if it is, format it in a standard way that we want to use
        changeDateTime = formatDateAndTime(changeDateTime, "MM/DD/YYYY h:mm:ss A");
        if (changeDateTime === "") {
            $("#pageOptions-option-datetimestamp").addClass("hidden");
        } else {
            changeTimeStamp = changeDateTime;
            if (changeUid !== "") {
                changeTimeStamp += changeUid;
            }
            $("#pageOptions-option-datetimestamp").removeClass("hidden");
        }

        $(".sg-page-timestamp").text(changeTimeStamp);
    };

    var monitorPageChanges = function () {
        /// <summary>
        /// Create the necessary event handlers for tracking changes to input fields
        /// </summary>

        $(document).on("change", ".sg-track-changes", inputChanged);
        $(document).on("dp.change", timepickerChanged);
    };

    var timepickerChanged = function (e) {
        /// <summary>
        /// Event handler that fires when the user changes the value of a timepicker using the timepicker control
        /// </summary>
        /// <param name="e" type="Object">Event object</param>

        var $timepicker = $(e.target);
        if ($timepicker.length > 0) {
            var $input = $(".sg-timepicker-input", $timepicker);
            if ($input.length > 0) {
                $input.trigger("change");
            }
        }
    };

    var pageTrackingChanges = function (value) {
        /// <summary>
        /// Gets or sets whether the page is tracking changes
        /// </summary>
        /// <param name="value" type="boolean" optional="true">Flag indicating if the page should be set as tracking changes made by the user to input fields</param>
        /// <returns type="boolean">If no value is provided the current setting is returned</returns>

        // If the value was not provided, return the current setting
        if (value === null || value === undefined) {
            return _trackChanges;
            // If a value was provided, set the page tracking accordingly
        } else {
            // If a value of false was not provided, then the setting must be true
            if (value !== false) {
                value = true;
            }

            _trackChanges = value;
        }
    };

    var inputChanged = function (e) {
        /// <summary>
        /// Event handler that fires when the user changes an input field that is being tracked for changes.
        /// </summary>
        /// <param name="e" type="Event object">Event object</param>

        // Set the change status to indicate the content is dirty
        setDirty();
    };

    var setTrackedContent = function (dialog) {
        /// <summary>
        /// Set what group of fields are currently being tracked for changes.
        /// </summary>
        /// <param name="dialog" type="jQuery object" optional="true">jQuery object reference to a dialog to track changes</param>

        // If no dialog parameter was provided, then it's the actual page form that has
        // focus and is being tracked for changes
        if (dialog === undefined) {
            _currentFormType = inputFormTypes.Page;
            _trackedDialog = null;
            _changeTrackingContainer = null;
            _changeTrackingMessage = $(".sg-page-save-status .alert");
            // If a dialog parameter is provided, then it's a dialog that has focus and is
            // potentially being tracked for changes
        } else {
            _currentFormType = inputFormTypes.Dialog;
            _trackedDialog = dialog;
            _changeTrackingContainer = $(".sg-modal-save-status", dialog);
            _changeTrackingMessage = $(".alert", _changeTrackingContainer);
        }

        // Initialize the messages to null
        _unsavedChangesMessage = null;
        _changesSavedMessage = null;
    };

    var initializeChangeStatus = function () {
        /// <summary>
        /// Initializes the page status.
        /// </summary>

        _changeTrackingMessage.hide();
        clearChangeStatus();
    };

    var getChangeStatus = function (formType) {
        /// <summary>
        /// Gets the current state of the content currently being tracked for changes.
        /// </summary>
        /// <param name="formType" type="SunGard.Common.InputFormTypes">The location of the form the change status is being requested for.</param>
        /// <returns type="PageStatus">Enumeration of possible page statuses.  Only difference between NoStatus and ChangesSaved is whether the message is displayed on the screen.</returns>

        // If the form type parameter is not provided or is invalid, default to the current form type
        if (formType === null || formType === undefined || (formType !== inputFormTypes.Page && formType !== inputFormTypes.Dialog)) {
            formType = _currentFormType;
        }

        // If the content currently being tracked is the page, then return the page status
        if (formType === inputFormTypes.Page) {
            if (_trackChanges) {
                return _pageStatus;
            } else {
                return changeStatus.NoStatus;
            }
            // If the content currently being tracked is a dialog, then return the dialog status
        } else {
            if (_trackedDialog !== null) {
                return SunGard.Bootstrap.Dialog.DialogStatus();
            } else {
                return changeStatus.NoStatus;
            }
        }
    };

    var setDirty = function (alwaysDisplay) {
        /// <summary>
        /// Sets the current state of the content currently being tracked for changes to indicate there are unsaved changes.
        /// </summary>
        /// <param name="alwaysDisplay">Boolean: Display the message even if track changes isn't enabled.</param>

        // Set the default value for the alwaysDisplay parameter
        if (alwaysDisplay === null || alwaysDisplay === undefined || alwaysDisplay !== true) {
            alwaysDisplay = false;
        }

        // If not tracking changes for the content currently active, then exit
        if (!alwaysDisplay &&
            ((_currentFormType === inputFormTypes.Page && !_trackChanges) ||
             (_currentFormType === inputFormTypes.Dialog && _trackedDialog === null))) {
            return;
        }

        // If the "Unsaved Changes" message hasn't been determined yet, do so
        if (_unsavedChangesMessage === null) {
            if (_currentFormType === inputFormTypes.Page) {
                _unsavedChangesMessage = getResourceString("UnsavedChangesMessage");
            } else {
                _unsavedChangesMessage = SunGard.Bootstrap.Dialog.GetUnsavedChangesMessage();
            }
        }

        // Display the message and set the appropriate change status
        _changeTrackingMessage.addClass("alert-warning");
        _changeTrackingMessage.removeClass("alert-success");

        _changeTrackingMessage.html(_unsavedChangesMessage);
        if (_currentFormType === inputFormTypes.Page) {
            _pageStatus = changeStatus.UnsavedChanges;
        } else {
            _changeTrackingContainer.removeClass("hidden");
            SunGard.Bootstrap.Dialog.DialogStatus(changeStatus.UnsavedChanges);
        }
        _changeTrackingMessage.fadeIn("slow");
    };

    var setSaved = function (alwaysDisplay) {
        /// <summary>
        /// Sets the current state of the content currently being tracked for changes to indicate that the changes have been saved.
        /// </summary>
        /// <param name="alwaysDisplay">Boolean: Display the message even if track changes isn't enabled.</param>

        // Set the default value for the alwaysDisplay parameter
        if (alwaysDisplay === null || alwaysDisplay === undefined || alwaysDisplay !== true) {
            alwaysDisplay = false;
        }

        // If not tracking changes for the content currently active, then exit
        if (!alwaysDisplay &&
            ((_currentFormType === inputFormTypes.Page && !_trackChanges) ||
             (_currentFormType === inputFormTypes.Dialog && _trackedDialog === null))) {
            return;
        }

        // If the "Changes Saved" message hasn't been determined yet, do so
        if (_changesSavedMessage === null) {
            if (_currentFormType === inputFormTypes.Page) {
                _changesSavedMessage = getResourceString("ChangesSavedMessage");
            } else {
                _changesSavedMessage = SunGard.Bootstrap.Dialog.GetChangesSavedMessage();
            }
        }

        // Update the change status
        if (_currentFormType === inputFormTypes.Page) {
            _pageStatus = changeStatus.ChangesSaved;
        } else {
            SunGard.Bootstrap.Dialog.DialogStatus(changeStatus.ChangesSaved);
        }

        // Update the message
        _changeTrackingMessage.fadeOut("slow", function () {
            _changeTrackingMessage.removeClass("alert-warning");
            _changeTrackingMessage.addClass("alert-success");
            _changeTrackingMessage.html(_changesSavedMessage);
            if (_currentFormType !== inputFormTypes.Page) {
                _changeTrackingContainer.removeClass("hidden");
                SunGard.Bootstrap.Dialog.DialogStatus(changeStatus.ChangesSaved);
            }
            _changeTrackingMessage.fadeIn("slow", function () {
                setTimeout(function () {
                    //If the user has made changes to the page during the 5 second display of the "Change Saved" message, do not clear the change status
                    if (!pageIsDirty()) {
                        clearChangeStatus(alwaysDisplay);
                    }
                }, 5000);
            });
        });
    };

    var clearChangeStatus = function (alwaysDisplay) {
        /// <summary>
        /// Clears the current state of the content currently being tracked to indicate there are no unsaved changes and that the save changes process has completed.
        /// </summary>
        /// <param name="alwaysDisplay">Boolean: Display the message even if track changes isn't enabled.</param>

        // Set the default value for the alwaysDisplay parameter
        if (alwaysDisplay === null || alwaysDisplay === undefined || alwaysDisplay !== true) {
            alwaysDisplay = false;
        }

        // If not tracking changes for the content currently active, then exit
        if (!alwaysDisplay &&
            ((_currentFormType === inputFormTypes.Page && !_trackChanges) ||
             (_currentFormType === inputFormTypes.Dialog && _trackedDialog === null))) {
            return;
        }

        // Update the change status
        if (_currentFormType === inputFormTypes.Page) {
            _pageStatus = changeStatus.NoStatus;
        } else {
            SunGard.Bootstrap.Dialog.DialogStatus(changeStatus.NoStatus);
        }

        // Clear the message
        _changeTrackingMessage.fadeOut("slow", function () {
            _changeTrackingMessage.removeClass("alert-warning alert-success alert-danger");
            _changeTrackingMessage.html("&nbsp;");
            if (_currentFormType === inputFormTypes.Dialog) {
                _changeTrackingContainer.addClass("hidden");
            }
        });
    };

    //#endregion

    //#region Client-side Localization

    var addResource = function (resourceKey, resourceValue) {
        /// <summary>Adds a resource to the resource dictionary.</summary>
        /// <param name="resourceKey" type="string">The resource key used to look up the string</param>
        /// <returns type="string">The resrouce string associated with the key.</returns>
        _resourceDictionary[resourceKey] = resourceValue;
    };

    var getResourceString = function (resourceKey) {
        /// <summary>Gets a resource string from the library.</summary>
        /// <param name="resourceKey" type="string">The resource key to look up in the resource dictionary</param>
        /// <returns type="string">The resrouce string associated with the key.</returns>
        if (!_resourceDictionary[resourceKey]) {
            return "x - " + resourceKey;
        }

        return _resourceDictionary[resourceKey];
    };

    //#endregion

    //#region User Access

    var setDefaultUserAccess = function (userAccess) {
        if (userAccess !== SunGard.Common.UserAccessType.NoAccess &&
            userAccess !== SunGard.Common.UserAccessType.ReadOnly &&
            userAccess !== SunGard.Common.UserAccessType.ReadWrite) {
            throw "setDefaultUserAccess():  Invalid value for userAccess";
        }

        _userAccess = userAccess;
    };

    var getDefaultUserAccess = function () {
        if (_userAccess === null || _userAccess === undefined) {
            return SunGard.Common.UserAccessType.NoAccess;
        }

        return _userAccess;
    };

    //#endregion

    //#region Ajax Methods

    var __makeAjaxCall = function (ajaxSettings) {
        /// <summary>
        /// Makes the AJAX call with the passed in AJAX settings.  Makes use of a promise object
        /// in order to get an authentication token from a third party.
        /// </summary>
        /// <param name="ajaxSettings" type="object">The settings for making the AJAX call.</param>

        if (SunGard.Common.UseTokenForAjaxCalls()) {

            // if there is a function to create an authentication token, wait until
            // the promise object returned by the function is done and then create the ajax call.
            SunGard.Common.GetAuthenticationToken().done(function (token) {
                if (ajaxSettings.data === null || ajaxSettings.data === undefined) {
                    ajaxSettings.data = {};
                }

                // set the token in the data being sent to the ajax request
                ajaxSettings.data.token = token;

                // Issue the ajax call based on the provided parameters
                var jqXHR = $.ajax(ajaxSettings);
                addToCurrentAjaxCalls(jqXHR);
            });
        } else {

            // Issue the ajax call based on the provided parameters
            var jqXHR = $.ajax(ajaxSettings);
            addToCurrentAjaxCalls(jqXHR);
        }
    };

    var ajaxPost = function (url, postData, successCallback, errorCallback, context, crossDomain, suppressAjaxSpinner, additionalSettings) {
        /// <summary>
        /// Function used to handle basic AJAX POST calls.
        /// </summary>
        /// <param name="url" type="string">The path to the controller and action</param>
        /// <param name="postData" type="object">The data to be posted to the server</param>
        /// <param name="successCallback" type="function" optional="true">The method to call if the AJAX call is successful</param>
        /// <param name="errorCallback" type="function" optional="true">The method to call if the AJAX call is not successful.  If no method is provided, a default method is used.</param>
        /// <param name="context" type="object" optional="true">The object that represents the context for any references to "this" within the successCallback and errorCallback</param>
        /// <param name="crossDomain" type="boolean" optional="true">Indicates whether the POST call is cross domain or not (default is false)</param>
        /// <param name="suppressAjaxSpinner" type="boolean" optional="true">Indicates whether the AJAX spinner should be suppressed for this call (default is false)</param>
        /// <param name="additionalSettings" type="object" optional="true">An object with additional options to include in the AJAX call</param>

        var ajaxSettings = (additionalSettings || {});

        // Determine the success callback method
        var success = (successCallback === null || successCallback === undefined ? null : successCallback);
        // Determine the error callback method
        var error = (errorCallback === null || errorCallback === undefined ? function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.statusText !== "abort") {
                SunGard.Common.ShowAjaxLoadError(jqXHR.responseText);
            }
        } : errorCallback);

        if (suppressAjaxSpinner !== null && suppressAjaxSpinner === true) {
            suppressSpinner();
        }

        // Set the cross domain as false if not passed
        if (crossDomain === null || crossDomain === undefined) {
            crossDomain = false;
        }

        ajaxSettings.url = url;
        ajaxSettings.type = "POST";
        ajaxSettings.data = postData;
        ajaxSettings.success = success;
        ajaxSettings.error = error;
        ajaxSettings.crossDomain = crossDomain;

        if (ajaxSettings.contentType === null || ajaxSettings.contentType === undefined || ajaxSettings.contentType === "") {
            if (ajaxSettings.data === undefined || ajaxSettings.data === null || jQuery.isPlainObject(ajaxSettings.data)) {
                ajaxSettings.data = JSON.stringify(ajaxSettings.data);
                ajaxSettings.contentType = "application/json; charset=UTF-8";
            }
            else {
                ajaxSettings.contentType = "application/x-www-form-urlencoded; charset=UTF-8";
            }
        }
        else if ($.type(ajaxSettings.contentType) === 'string' && ajaxSettings.contentType.indexOf("application/json") >= 0 && jQuery.isPlainObject(ajaxSettings.data)) {
            ajaxSettings.data = JSON.stringify(ajaxSettings.data);
        }

        if (context !== null && context !== undefined) {
            ajaxSettings.context = context;
        }

        __makeAjaxCall(ajaxSettings);
    };

    var ajaxGet = function (url, getData, successCallback, errorCallback, suppressAjaxSpinner, additionalSettings) {
        /// <summary>
        /// Function used to handle basic AJAX GET calls.
        /// </summary>
        /// <param name="url" type="string">The path to the controller and action</param>
        /// <param name="getData" type="object">The data to be used in the GET method to the server</param>
        /// <param name="successCallback" type="function" optional="true">The method to call if the AJAX call is successful</param>
        /// <param name="errorCallback" type="function" optional="true">The method to call if the AJAX call is not successful.  If no method is provided, a default method is used.</param>
        /// <param name="suppressAjaxSpinner" type="boolean" optional="true">Indicates whether the AJAX spinner should be suppressed for this call (default is false)</param>
        /// <param name="additionalSettings" type="object" optional="true">An object with additional options to include in the AJAX call</param>

        // Determine the success callback method
        var success = (successCallback === null || successCallback === undefined ? null : successCallback);
        var ajaxSettings = (additionalSettings || {});

        // Determine the error callback method
        var error = (errorCallback === null || errorCallback === undefined ? function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.statusText !== "abort") {
                SunGard.Common.ShowAjaxLoadError(jqXHR.responseText);
            }
        } : errorCallback);

        ajaxSettings.url = url;
        ajaxSettings.data = getData;
        ajaxSettings.type = 'GET';
        ajaxSettings.success = success;
        ajaxSettings.error = error;

        if (suppressAjaxSpinner !== null && suppressAjaxSpinner === true) {
            suppressSpinner();
        }

        __makeAjaxCall(ajaxSettings);
    };

    var addToCurrentAjaxCalls = function (jqXHR) {
        /// <summary>Adds a jqXHR object to an array of active ajax calls.</summary>
        /// <param name="studentId" type="jqXHR">The jqXHR object.</param>

        // add to the array
        _activeAJaxCalls.push(jqXHR);

        // when the call is done, remove it from the array.
        jqXHR.always(function () { removeFromCurrentAjaxCalls(jqXHR); });

        _whenAjaxCallStartsCallback.forEach(function (func, index, array) { func(); });
    };

    var removeFromCurrentAjaxCalls = function (jqXHR) {
        /// <summary>Removes the jqXHR object from the array of active ajax calls.</summary>
        /// <param name="studentId" type="jqXHR">The jqXHR object.</param>

        _activeAJaxCalls.pop(jqXHR);

        _whenAjaxCallEndsCallback.forEach(function (func, index, array) { func(); });
    };

    var abortActiveAjaxCalls = function () {
        /// <summary>Aborts all of the currently active AJAX calls on the page.</summary>

        $.each(_activeAJaxCalls, function (index, jqXHR) {
            if (jqXHR !== undefined) {
                try { jqXHR.abort(); }
                catch (ex) { }
            }
        });

        // empty the array
        _activeAJaxCalls = [];
    };

    var activeAjaxCallCount = function () {
        /// <summary>Returns the count of active AJAX calls on the current page.</summary>

        return _activeAJaxCalls.length;
    };

    var onAjaxCallStarts = function (func) {
        /// <summary>Calls the passed in function when an ajax request starts.</summary>
        /// <param name="resourceKeyfunc" type="Function">The function to call.</param>

        if (func === null) {
            _whenAjaxCallStartsCallback = [];
        } else if ($.isFunction(func)) {
            _whenAjaxCallStartsCallback.push(func);
        }
    };

    var onAjaxCallStops = function (func) {
        /// <summary>Calls the passed in function when an ajax request stops.</summary>
        /// <param name="resourceKeyfunc" type="Function">The function to call.</param>

        if (func === null) {
            _whenAjaxCallEndsCallback = [];
        } else if ($.isFunction(func)) {
            _whenAjaxCallEndsCallback.push(func);
        }
    };

    var setCustomAjaxErrorDialogWindowOptions = function (options) {
        /// <summary>
        /// Sets the application/page specific window options for the AJAX error dialog window.
        /// </summary>
        /// <param name="options" type="object">Must be an object with properties that match valid window options and corresponding values for those properties.  The values must be strings, numeric values, or a function that returns a string or numeric value.</param>

        // Default the options if the passed parameter was null or undefined
        if (options === null || options === undefined) {
            options = {};
        }

        // Verify that the options were passed in as an object
        if (!$.isPlainObject(options)) {
            throw "Invalid Argument:  options must be an object.";
        }

        // Make sure each property is either a string, number, or function
        var invalidArgs = [];
        for (var option in options) {
            var valueType = $.type(options[option]);
            if (valueType !== "null" && valueType !== "string" && valueType !== "number" && valueType !== "function") {
                invalidArgs.push(option);
            }
        }

        // If there were any invalid properties, throw an error indicating what was invalid.
        if (invalidArgs.length > 0) {
            throw "Invalid Argument:  option properties (" + invalidArgs.join(", ") + ") must be null, strings, numbers, or functions"
        }

        _customAjaxErrorDialogWindowOptions = options;
    };

    var buildAjaxErrorDialogWindowOptions = function () {
        /// <summary>
        /// Build the string of window options for the AJAX error dialog window taking into account any application/page specific settings.
        /// </summary>
        /// <returns type="string">Returns the window options string.</returns>

        // Get the list of options overriding any defaults with the application/page specific values.
        var options = $.extend({},
            {
                toolbar: "yes",
                resizable: "yes",
                scrollbars: "yes",
                location: "yes"
            },
            _customAjaxErrorDialogWindowOptions);

        // Initialize the window options string and the separator
        var windowOptions = "";
        var separator = "";

        // Process each window option
        for (var option in options) {
            var value = options[option];
            if ($.isFunction(value)) {
                value = value();
            }

            // If the value isn't null
            if (value !== null) {
                windowOptions += separator + $.trim(option) + "=" + $.trim(value);
                separator = ",";
            }
        }

        // Return the generated string of window options
        return windowOptions;
    }

    var showAjaxLoadError = function (errorHTML) {
        /// <summary>
        /// Displays a message to the user if an error occurs during an AJAX call.
        /// </summary>
        /// <param name="errorHTML">HTML to display when an error occurs during an AJAX call</param>

        var windowOptions = buildAjaxErrorDialogWindowOptions();
        var errorWindow = window.open("", "_blank", windowOptions);
        errorWindow.document.open();
        errorWindow.document.write(errorHTML);
        errorWindow.document.close();
    };

    //#endregion

    //#region AJAX Spinner Methods

    var createDefaultSpinner = function () {
        /// <summary>
        /// Creates the default markup for displaying the spinner when an AJAX call is made.
        /// </summary>
        /// <returns type="string">HTML markup</returns>

        var spinnerHtml = "";

        // Make sure SunGard.Common.Html is loaded before using it
        if (SunGard.Common.Html) {
            var tagBuilder = SunGard.Common.Html.TagBuilder("i");
            tagBuilder.AddCssClass("fa fa-spinner fa-spin");
            spinnerHtml = tagBuilder.ToString();
        }

        return spinnerHtml;
    };

    var disableSpinner = function () {
        /// <summary>
        /// Disables the AJAX spinner entirely.
        /// </summary>

        //AJAX Spinner functionality 
        $(document)
            .off("ajaxSend.sg.spinner")
            .off("ajaxStop.sg.spinner");
    };

    var showSpinnerOnAjaxSend = function () {

        // if the spinner is surpressed
        if (_suppressSpinner) {
            // hide it in case it's already showing.
            hideSpinner();

            // show the spinner next time by using the
            _suppressSpinner = false;

        } else {
            // we only need to show it once per batch,
            // so we can unbind ajaxStart since now
            // we are showing the spinner.

            _$spinner.fadeIn('fast');
        }
    };

    var showSpinner = function () {
        if (!_$spinner.is(":visible")) {
            _$spinner.fadeIn("fast");
        }
    }

    var hideSpinner = function () {
        if (_$spinner.is(":visible")) {
            _$spinner.fadeOut('slow');
        }
    };

    // Method: enableSpinner
    //      method to enable the display of the spinner
    // Parameters: None.
    // Return Value: None.
    var enableSpinner = function () {
        //AJAX Spinner functionality
        $(document)
            .off("ajaxSend.sg.spinner")
            .off("ajaxStop.sg.spinner")
            .on("ajaxSend.sg.spinner", showSpinnerOnAjaxSend)
            .on("ajaxStop.sg.spinner", hideSpinner);
    };

    var suppressSpinner = function () {
        /// <summary>
        /// Suppresses the AJAX spinner from displaying for a single AJAX call.
        /// </summary>

        _suppressSpinner = true;
    };

    //#endregion

    //#region jQuery Extensions

    var initializeExtentions = function () {
        /////////////////////////////////////////////////////////////////////////////////
        // Common Helper functions

        /* add function to jquery that returns the scrollbar width. */
        (function ($) {
            var scrollbarWidth = 0;
            $.fn.getScrollbarWidth = function () {
                if (!scrollbarWidth) {
                    var $div = $('<div />')
                        .css({ width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: -1000 })
                        .prependTo('body').append('<div />').find('div')
                        .css({ width: '100%', height: 200 });
                    scrollbarWidth = 100 - $div.width();
                    $div.parent().remove();
                }
                return scrollbarWidth;
            };

            $.fn.hasHorizontalScrollBar = function () {
                return this.get(0).scrollWidth > this.width();
            };

            $.fn.hasVerticalScrollBar = function () {
                return this.get(0).scrollHeight > this.height();
            };

            $.fn.hasScrollBar = function () {
                return this.hasHorizontalScrollBar() && this.hasVerticalScrollBar();
            };
        })(jQuery),
        // FUNCTION removeClassRegEx
        //      Like jQuery method removeClass but it uses regexes
        //      Came from: http://www.websanova.com/tutorials/jquery/jquery-remove-class-by-regular-expression
        //      To remove any class from body that begins with "sg-background-" use this:
        //          $('body').removeClassRegEx(/^sg-background-/);
        (function ($) {
            $.fn.removeClassRegEx = function (regex) {
                var classes = $(this).attr('class');
                if (!classes || !regex)
                    return false;
                var classArray = [];
                classes = classes.split(' ');
                for (var i = 0, len = classes.length; i < len; i++)
                    if (!classes[i].match(regex))
                        classArray.push(classes[i]);
                $(this).attr('class', classArray.join(' '));
                return true;
            };
        })(jQuery),
        // FUNCTION findClassRegEx
        //      Finds a css class matching the regex
        //      Find a class from body that begins with "sg-background-" use this:
        //          $('body').findClassRegEx(/^sg-background-/);
        (function ($) {
            $.fn.findClassRegEx = function (regex) {
                var classes = $(this).attr('class');
                if (!classes || !regex)
                    return "";
                classes = classes.split(' ');
                for (var i = 0, len = classes.length; i < len; i++)
                    if (classes[i].match(regex))
                        return classes[i];
                return "";
            };
        })(jQuery);
    };

    //#endregion

    //#region Array Searching

    var caseInsensitiveInArray = function (matchString, array, property) {
        /// <summary>
        /// Returns the index of the item in the passed array.
        /// </summary>
        /// <param name="matchString">String to search for using a case insensitive check</param>
        /// <param name="array">Array to search</param>
        /// <param name="property" type="string">Property name within object to check the matchString against if array is an array of objects.</param>
        /// <returns type="number">The index position where the matchString was found or -1 if not found.</returns>

        // http://stackoverflow.com/questions/143847/best-way-to-find-an-item-in-a-javascript-array
        var result = -1;
        $.each(array, function (index, value) {
            var checkValue;
            if (property === undefined) {
                checkValue = value;
            } else {
                checkValue = value[property];
            }

            if (checkValue.toLowerCase() === matchString.toLowerCase()) {
                result = index;
                return false; // returns from the each
            }
        });
        return result;
    };

    //#endregion

    //#region Validate Numeric Input

    var validateNumericInput = function (key) {
        var charCode = (key.which) ? key.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    };

    //#endregion

    //#region HTML Encoding

    var htmlEncode = function (str) {
        /// <summary>Replaces ', ", <, >, and & with html encoded equivalents</summary>
        /// <param name="str" type="string">The string to encode</param>
        /// <returns type="string">The encoded string.</returns>

        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };

    var htmlDecode = function (str) {
        /// <summary>Replaces &am;, &quot, &gt, &lt, and &apos with their decoded equivalents</summary>
        /// <param name="str" type="string">The string to decode</param>
        /// <returns type="string">The decoded string.</returns>
        return $('<div />').html(str).text();
    };

    //#endregion

    //#region Debugging Tools

    var consoleLog = function (message) {
        if (console !== undefined) {
            console.log(message);
        }
    };

    var expandObject = function (obj, indentLevel) {
        var message = '';
        if (indentLevel === undefined || indentLevel === null) {
            indentLevel = 0;
            message += '\n';
        }
        var indent = '';
        for (ctr = 0; ctr < indentLevel; ctr++) {
            indent += '\t';
        }
        for (prop in obj) {
            var propType = typeof (obj[prop]);
            if (propType === 'object') {
                message += $.validator.format('{2}{0}: {1}\n', prop, expandObject(obj[prop], indentLevel + 1), indent);
            } else if (propType === 'function') {
                message += $.validator.format('{1}function: {0}\n', prop, indent);
            } else {
                message += $.validator.format('{2}{0}: {1}\n', prop, obj[prop], indent);
            }
        }
        return message;
    };

    if (window.console && typeof (window.console.time) == "undefined") {
        console.time = function (tname, treset) {
            if (!tname) { return; }
            var time = new Date().getTime();
            if (!console.timeCounters) { console.timeCounters = {}; }
            var key = "KEY" + tname.toString();
            if (!treset && console.timeCounters[key]) { return; }
            console.timeCounters[key] = time;
        };
        console.timeEnd = function (tname) {
            var time = new Date().getTime();
            if (!console.timeCounters) { return; }
            var key = "KEY" + tname.toString();
            var timeCounter = console.timeCounters[key];
            var diff;
            if (timeCounter) {
                diff = time - timeCounter;
                var label = tname + ": " + diff + "ms";
                console.info(label);
                delete console.timeCounters[key];
            }
            return diff;
        };
    }

    var time = function (name, reset) {

        if (window.console) {
            console.time(name, reset)
        }
    };

    var timeEnd = function (name) {
        if (window.console) {
            console.timeEnd(name);
        }
    }
    //#endregion

    //#region Date Processing

    var validDateParseStrings = ["MM-DD-YY", "MM-DD-YYYY", "MMDDYY", "MMDDYYYY", "YYYY-MM-DD", "MM-DD", "MMDD"];
    var validTimeParseStrings = ["YYYY-MM-DD HH:mm:ss.SSS", "hh:mm A"];
    var validDateTimeParseStrings = ["YYYY-MM-DD HH:mm:ss.SSS"];

    var getMoment = function (dateTime, parseStrings, strict) {
        var m;

        if (strict === undefined || strict === null) {
            strict = false;
        }

        if ((dateTime !== null && dateTime !== undefined && dateTime.hasOwnProperty('_isAMomentObject'))) {
            m = dateTime;
        } else if (typeof dateTime === 'string' || dateTime instanceof String) {
            m = new moment($.trim(dateTime), parseStrings, strict);
        } else {
            m = new moment(dateTime);
        }

        return m;
    };

    var getDateMoment = function (date) {
        /// <summary>
        /// Parses the date parameter using the valid date parsing strings.  To determine if the result is valid, call the isValid() function on the return object.
        /// </summary>
        /// <param name="date">Parameter representing a date</param>
        /// <returns type="">A moment object</returns>
        return getMoment(date, validDateParseStrings);
    };

    var getTimeMoment = function (time) {
        /// <summary>
        /// Parses the time parameter using the valid time parsing strings.  To determine if the result is valid, call the isValid() function on the return object.
        /// </summary>
        /// <param name="time">Parameter representing a time</param>
        /// <returns type="">A moment object</returns>
        return getMoment(time, validTimeParseStrings);
    };

    var getDateTimeMoment = function (datetime) {
        /// <summary>
        /// Parses the datetime parameter using the valid datetime parsing strings.  To determine if the result is valid, call the isValid() function on the return object.
        /// </summary>
        /// <param name="time">Parameter representing a datetime stamp</param>
        /// <returns type="">A moment object</returns>
        return getMoment(datetime, validDateTimeParseStrings);
    };

    var formatDate = function (date, mask) {
        /// <summary>
        /// Formats a date argument as MM/DD/YYYY
        /// </summary>
        /// <param name="date">The date argument can be a javascript date object or a string which will be parsed using moment.js.  If the argument is not
        /// a valid date, an empty string will be returned.</param>
        /// <param name="mask">The moment.js format mask.  If none is passed, MM/DD/YYYY will be used</param>
        /// <returns type="string">A formatted date string as MM/DD/YYYY</returns>

        var m = getDateMoment(date);
        return m.isValid() ? m.format(mask || "MM/DD/YYYY") : '';
    };

    var formatTime = function (time, mask) {
        /// <summary>
        /// Formats a date/time argument as hh:mm A
        /// </summary>
        /// <param name="time">The date/time argument can be a javascript date object or a string which will be parsed using moment.js.  If the argument is not
        /// a valid date/time, an empty string will be returned.</param>
        /// <param name="mask">The moment.js format mask.  If none is passed, hh:mm A will be used</param>
        /// <returns type="string">A formatted time string as hh:mm A</returns>

        var m = getTimeMoment(time);
        return m.isValid() ? m.format(mask || "hh:mm A") : '';
    };

    var formatDateAndTime = function (dateTime, mask) {
        /// <summary>
        /// Formats a date and time argument as 'MM/DD/YYYY h:mm:ss A'
        /// </summary>
        /// <param name="dateTime">The date/time argument can be a javascript date object or a string which will be parsed using moment.js.  If the argument is not
        /// a valid date/time, an empty string will be returned.</param>
        /// <param name="mask">The moment.js format mask.  If none is passed, MM/DD/YYYY h:mm A will be used</param>
        /// <returns type="string">A formatted date and time string as 'MM/DD/YYYY h:mm:ss A'</returns>
        var m = getDateTimeMoment(dateTime);
        return m.isValid() ? m.format(mask || "MM/DD/YYYY h:mm A") : '';
    };

    var parseDate = function (date) {
        /// <summary>
        /// Parses a date argument
        /// </summary>
        /// <param name="date">The date string to parse</param>
        /// <returns type="string">A javascript Date object if the parse was successful, or a null value if the parse is not successful</returns>

        var m = getDateMoment(date);
        return m.isValid() ? m.toDate() : null;
    };

    var parseTime = function (time) {
        /// <summary>
        /// Parses a time argument
        /// </summary>
        /// <param name="time">The time argument to parse</param>
        /// <returns type="string">A javascript Date object if the parse was successful, or a null value if the parse is not successful</returns>

        var m = getTimeMoment(time);

        //Support legacy feature of being able to parse a 3 digit time (e.g. 430 should parse to 04:30 AM)
        if (!m.isValid() && $.trim(time).length === 3) {
            m = getTimeMoment('0' + $.trim(time));
        }

        return m.isValid() ? m.toDate() : null;
    };

    var parseDateAndTime = function (dateTime) {
        /// <summary>
        /// Parses a date and time argument
        /// </summary>
        /// <param name="dateTime">The date/time argument to parse</param>
        /// <returns type="string">A javascript Date object if the parse was successful, or a null value if the parse is not successful</returns>
        var m = getDateTimeMoment(dateTime);
        return m.isValid() ? m.toDate() : null;
    };
    //#endregion

    //#region Resizing Event Handlers

    var resizePageContent = function () {
        /// <summary>
        /// Event handler that performs any generic changes to the site content
        /// as a result of a window resize.
        /// </summary>

        // To minimize how much processing is being done for every little bit
        // the window is resized, only trigger a timer every 60ms to actually
        // do the work.
        if (!_resizeTimerSet) {
            _resizeTimerSet = true;

            clearTimeout(_resizeTimer);
            _resizeTimer = setTimeout(resizePageContentCallback, 60);
        }
    };

    var resizePageContentCallback = function () {
        /// <summary>
        /// Performs any generic page content changes as a result of the user
        /// resizing the window.
        /// </summary>

        adjustPagePadding();
        _resizeTimerSet = false;
    };

    //#endregion

    //#region Check Page Dirty Before Navigation

    var pageIsDirty = function () {
        ///<summary>Returns true if there are unsaved changes on the page.</summary>        

        var pageIsDirty = (getChangeStatus(SunGard.Common.InputFormTypes.Page) === changeStatus.UnsavedChanges);

        // When checking if changes have been made to the page, check not only the page status, but
        // also the status of any open dialogs.
        var visibleDialogs = SunGard.Bootstrap.Dialog.VisibleDialogs();

        var i = 0;
        while (!pageIsDirty && i < visibleDialogs.length) {
            pageIsDirty = (SunGard.Bootstrap.Dialog.DialogStatus(undefined, visibleDialogs[i]) === changeStatus.UnsavedChanges);
            i++;
        }
        return pageIsDirty;
    };

    var handleWindowEvent = function (navigateSettings) {
        ///<summary>Handles the windows before unload event.</summary>

        if (!navigateSettings.validatePageChange.call(this)) {
            return navigateSettings.navigateAwayMessage;
        } else {
            $(this).unbind('beforeunload.sg');
            return;
        }
    };

    //fire the event defined in the passed in options object
    var checkForChangesThenFireEvent = function (event, navigateSettings) {
        ///<summary>Checks to see if there are unsaved changes, and if so and fires the appropiate event defined in _navigateSettings.</summary>

        if (!navigateSettings.validatePageChange.call(this)) {
            return navigateSettings.ifInvalidEvent.call(this, event);
        } else {
            return navigateSettings.ifValidEvent.call(this, event);
        }
    };

    var onNavigateAway = function (options, event) {
        ///<summary>Defines the action that should occur when nagivating away from the current page.</summary>
        ///<param name="options" type="Object">An object of options defining the actions that should occur when navigating away from the current page.  Otions include:
        ///     newPageMessage: the message to display when the browser closes or is redirected to a location outside the software.
        ///     navigateAwayMessage: the message to display when changing to a new menu item/student/etc.
        ///     saveChangesDialogTitle: Title for the dialog.
        ///     validatePageChange: Function used to change if there are no unsaved changes.
        ///     ifInvalidEvent: Function called if validatePageChange returns false (there are unsaved changes)
        ///     ifValidEvent: Function called if validatePageChange returns true (there are no unsaved changes)
        ///</param>
        ///<param name="event" type="Event">The event object.</param>

        if (_defaultNavigateAwayOptions === null) {
            // sets the default options when checking for unsaved changes during browser navigation/page actions.
            _defaultNavigateAwayOptions = {
                newPageMessage: SunGard.Common.GetResourceString("NewPageMessage"), //'Changes that have been made will be lost.  Do you want to save changes?', //message when you are able to prompt to save
                navigateAwayMessage: SunGard.Common.GetResourceString("NavigateAwayMessage"), //'Changes that have been made will be lost.  Do you wish to continue?', //message when you can only prevent navigation.
                saveChangesDialogTitle: SunGard.Common.GetResourceString("SaveChangesDialogTitle"),
                validatePageChange: function () {
                    return true;
                },
                ifInvalidEvent: $.noop(),
                ifValidEvent: $.noop()
            };
        }

        var navigateSettings = $.extend({}, _defaultNavigateAwayOptions, options);

        checkForChangesThenFireEvent(event, navigateSettings);

        //Hack. IE handles this event differently than everyone else on the planet so we need actually 
        //unbind the handler rather than just return a null string from the handler like in FF/Chrome or Safari.
        $(window).off('beforeunload.sg');
    };

    var onPageUnload = function (options) {
        ///<summary>Defines the action that should occur when the user attempts to navigate away from the page via some native browser functionality</summary>
        ///<param name="options" type="Object">An object of options defining the actions that should occur when navigating away from the current page.  Otions include:
        ///     newPageMessage: the message to display when the browser closes or is redirected to a location outside the software.
        ///     navigateAwayMessage: the message to display when changing to a new menu item/student/etc.
        ///     saveChangesDialogTitle: Title for the dialog.
        ///     validatePageChange: Function used to change if there are no unsaved changes.
        ///     ifInvalidEvent: Function called if validatePageChange returns false (there are unsaved changes)
        ///     ifValidEvent: Function called if validatePageChange returns true (there are no unsaved changes)
        ///</param>

        var navigateSettings = $.extend({}, _defaultNavigateAwayOptions, options);

        $(window).off('beforeunload.sg').on('beforeunload.sg', function () { return handleWindowEvent(navigateSettings) });
    };

    var promptToSaveChanges = function (event, validatePageChangeCallback, saveFn, actionFn, cancelFn) {
        ///<summary>Prompts the user to save changes before continuing.</summary>
        ///<param name="event" type="Event">The event object.</param>
        ///<param name="validatePageChangeCallback" type="Function">The function that checks for unsaved changes.</param>
        ///<param name="saveFn" type="Function">The function that saves the data on the current page.</param>
        ///<param name="actionFn" type="Function">The function that defines the actions that should occur after the save.</param>        
        ///<param name="actionFn" type="Function">The function that defines the actions that should occur if the action is canceled.</param>        
        var baseEvent = event;

        return function () {
            SunGard.Bootstrap.Dialog.ShowDialog("unSavedChangesDialog", _defaultNavigateAwayOptions.newPageMessage, _defaultNavigateAwayOptions.saveChangesDialogTitle, SunGard.Bootstrap.Dialog.ButtonSets.YesNoCancel,
                {
                    trackChanges: SunGard.Bootstrap.Dialog.TrackChangesOption.None,
                    yesClick: function () {
                        _resetUnloadHandlers = false;
                        if ($.isFunction(saveFn)) {
                            saveFn.call();
                        }
                    },
                    noClick: function () {
                        _resetUnloadHandlers = false;
                        if ($.isFunction(actionFn)) {
                            actionFn.call();
                        }
                    },
                    cancelClick: function () {
                        _resetUnloadHandlers = true;
                        if ($.isFunction(cancelFn)) {
                            cancelFn.call(event);
                        }
                    },
                    onHide: function () {
                        if (_resetUnloadHandlers) {
                            onPageUnload({ validatePageChange: validatePageChangeCallback });
                        }
                    }
                });
        };
    };

    var setSaveOnNavigationCheck = function (menuSelector, saveFn, validatePageChangeCallback) {
        ///<summary>Prompts the user to save when clicking in the menu.</summary>
        ///<param name="menuSelector" type="String">jQuery selector for the common navigation items within the master layout for an application.</param>
        ///<param name="saveFn" type="Function">The function that defines the actions that should occur after the save.  This function must access two parameters:  the event object and a callback function.</param>
        ///<param name="validatePageChangeCallback" type="Function" optional="true">The function that checks for unsaved changes.</param>

        // Verify that a save function has been provided
        if (saveFn === null || saveFn === undefined || !$.isFunction(saveFn)) {
            throw "saveFn must be provided and must be a function";
        }

        // Store the save function for use by the checkToSaveBeforeAction method when they are the same
        _saveFn = saveFn;

        // if the callback was not defined for the function to check if changes are saved, call
        // the standard function that changes the page state
        if (validatePageChangeCallback === undefined || validatePageChangeCallback === null) {
            validatePageChangeCallback = function () {
                return !pageIsDirty();
            };
        }

        // window unload handling
        onPageUnload({
            newPageMessage: SunGard.Common.GetResourceString("NewPageMessage"), //'Changes that have been made will be lost.  Do you want to save changes?', //message when you are able to prompt to save
            navigateAwayMessage: SunGard.Common.GetResourceString("NavigateAwayMessage"), //'Changes that have been made will be lost.  Do you wish to continue?', //message when you can only prevent navigation.
            validatePageChange: validatePageChangeCallback
        });

        // if the menu selector is not defined, default it.
        if (menuSelector === undefined || menuSelector === null || menuSelector === '') {
            menuSelector = '#mega-menu a, .navbar a[href!=#], .sg-nav-home-container';
        }

        //navigating from the menu & banner
        $(document).off('click', menuSelector).on('click', menuSelector, function (e) {
            // if url does not exist or is blank, don't continue
            if (e.currentTarget.href === undefined || e.currentTarget.href === "") {
                return;
            }

            // prevent the default behavior.  We don't want to navigate until we check if there are changes.
            e.preventDefault();

            // set the function for navigating
            var url = e.currentTarget.href;
            var navigationFunction = function () {
                window.location.href = url;
            };

            if (typeof e.target != 'undefined' && typeof e.target.target != 'undefined' && e.target.target.toLowerCase() == "_blank") {
                navigationFunction = function () {
                    window.open(url);
                };
            }

            onNavigateAway({
                validatePageChange: validatePageChangeCallback,
                ifInvalidEvent: promptToSaveChanges(e, validatePageChangeCallback, function () {
                    saveFn.call(this, e, navigationFunction);
                }, navigationFunction),
                ifValidEvent: navigationFunction
            }, e);
        });
    };

    var getSaveFunction = function () {
        /// <summary>
        /// Gets a reference to the save function that was declared in the setSaveOnNavigationCheck method call.
        /// </summary>
        /// <returns type="function"></returns>

        return _saveFn;
    };

    var checkToSaveBeforeAction = function (event, actionFn, saveFn, cancelFn, validatePageChangeCallback) {
        ///<summary>Prompts the user to save changes before continuing with the specified action.</summary>
        ///<param name="event" type="Event">The event object.</param>        
        ///<param name="actionFn" type="Function">The function that defines the actions that should occur after the save.</param>        
        ///<param name="saveFn" type="Function">The function that saves the data on the current page.</param>
        ///<param name="cancelFn" type="Function">The function that should be called if the user decides to cancel.</param>
        ///<param name="validatePageChangeCallback" type="Function" optional="true">The function that checks for unsaved changes.</param>

        // Determine the save function to use or throw an error if one can't be determined
        var saveFunction = null;
        if (saveFn !== null && saveFn !== undefined && $.isFunction(saveFn)) {
            saveFunction = saveFn;
        } else if (_saveFn !== null) {
            saveFunction = _saveFn;
        } else {
            throw "A save function is required";
        }

        // if the callback was not defined for the function to check if changes are saved, call
        // the standard function that changes the page state
        if (validatePageChangeCallback === undefined || validatePageChangeCallback === null) {
            validatePageChangeCallback = function () {
                return !pageIsDirty();
            };
        }

        onNavigateAway({
            validatePageChange: validatePageChangeCallback,
            ifInvalidEvent: promptToSaveChanges(event, validatePageChangeCallback, function () {
                saveFunction.call(this, event, actionFn);
            }, actionFn, cancelFn),
            ifValidEvent: actionFn
        }, event);
    };

    //#endregion

    //#region Screen Printing

    var initializeScreenPrint = function (controller, action) {
        /// <summary>
        /// Sets the print screen url for handling the print screen event
        /// </summary>
        /// <param name="controller">The MVC controller associated with the print screen functionality</param>
        /// <param name="action">The MVC action associated with the print screen functionality</param>

        if ($.trim(controller) === '') throw "The controller parameter is required";
        if ($.trim(action) === '') throw "The action parameter is required";

        _screenPrintUrl = SunGard.Common.RootURL() + "/" + $.trim(controller) + "/" + $.trim(action);
    };

    //#endregion

    //#region Page Content Selector Properties

    var pageHeaderSelector = function (selector) {
        if (selector === undefined) {
            if (_pageHeaderSelector === null) {
                return "header";
            } else {
                return _pageHeaderSelector;
            }
        } else {
            _pageHeaderSelector = selector;
        }
    };

    var pageContentSelector = function (selector) {
        if (selector === undefined) {
            if (_pageContentSelector === null) {
                return ".sg-page-content";
            } else {
                return _pageContentSelector;
            }
        } else {
            _pageContentSelector = selector;
        }
    };

    var pageFooterSelector = function (selector) {
        if (selector === undefined) {
            if (_pageFooterSelector === null) {
                return "footer";
            } else {
                return _pageFooterSelector;
            }
        } else {
            _pageFooterSelector = selector;
        }
    };

    //#endregion

    //#region Page Scrolling

    var scrollToElement = function ($element, dialogId) {

        // Make sure an element was provided
        if ($element.length === 0) {
            return;
        }

        // Get the container that should be scrolled
        var $container = (dialogId !== null && typeof dialogId !== "undefined") ? $("#" + dialogId) : $("html, body");
        var $footer = $(".sg-footer");
        var $affix = $(".affix,.affix-top");

        // Find the top of the element
        var elementTop = $element.offset().top;
        var elementHeight = $element.hasClass("sg-select-box") ? $element.select2("container").outerHeight() : $element.outerHeight();

        // Initialize the adjustment - null means the element is already scrolled into view
        var newScrollTop = null;

        var containerScrollTop = $container.scrollTop();
        var containerHeight = $container.height();
        var footerHeight = $footer.length === 0 ? 0 : $footer.height();
        var affixHeight = $affix.length === 0 ? 0 : $affix.height();

        if (elementTop < containerScrollTop) {
            newScrollTop = elementTop;
        } else if ((elementTop + elementHeight) > (containerScrollTop + containerHeight - footerHeight)) {
            newScrollTop = elementTop + elementHeight - (containerScrollTop + containerHeight - footerHeight);
        }

        // If there is an adjustment, apply it and scroll the element into view.
        if (newScrollTop !== null && newScrollTop !== undefined) {
            $container.animate({ scrollTop: newScrollTop }, "normal");
        }
    };

    //#endregion Page Scrolling

    //#region Auto Focus on Page Load

    var focusOnLoadEnabled = function (enabled) {
        /// <summary>
        /// Gets or Sets whether applying focus should happen on load of page or dialog.
        /// </summary>
        /// <param name="enabled" type="boolean" optional="true">When provided, sets the flag indicating if focus should be applied.  Passing null will apply default setting of <c>true</c>.</param>
        /// <returns type="boolean">When enabled parameter is not provided, returns <c>true</c> if focus should be applied on load, otherwise <c>false</c>.</returns>

        // If the enabled parameter wasn't provided, then return the current settings
        if (enabled === undefined) {
            return _focusOnLoadEnabled;
            // Otherwise, apply setting
        } else {
            // Make sure a valid boolean was provided and if not, set it to the default of true.
            if (enabled === null || enabled !== false) {
                enabled = true;
            }

            // Apply the setting
            _focusOnLoadEnabled = enabled;
        }
    };

    var isElementVisible = function ($element) {
        /// <summary>
        /// Check if the provided element is visible.
        /// </summary>
        /// <param name="$element" type="jQuery">jQuery object of the element to check.</param>
        /// <returns type="boolean">Returns <c>true</c> if visible, otherwise <c>false</c></returns>

        // Check if the element appears visible by jQuery standards
        if ($element.is(":visible")) {
            // If the element is a select2 search box, then this really isn't visible
            if ($element.hasClass("select2-focusser") && $element.hasClass("select2-offscreen")) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    };

    var isElementEnabled = function ($element) {
        /// <summary>
        /// Checks if the provided element is enabled.
        /// </summary>
        /// <param name="$element" type="jQuery">jQuery object of the element to check.</param>
        /// <returns type="boolean">Returns <c>true</c> if enabled, otherwise <c>false</c></returns>

        // Check if the element is disabled by jQuery standards
        if ($element.is(":disabled")) {
            return false;
            // Check if the element is rendered readonly through the sg-text-readonly class
        } else if ($element.hasClass("sg-text-readonly")) {
            return false;
            // Check if the element is readonly
        } else if ($element.prop("readonly") === true) {
            return false;
            // Check if the element is in a grid row that is marked as deleted
        } else if ($element.closest("td").length !== 0 && $element.closest("td").children(".sg-deleted-cell-overlay").length > 0) {
            return false;
        } else {
            return true;
        }
    };

    var applyFocusOnLoad = function (context) {
        /// <summary>
        /// If focusing on a field on page load is enabled, then apply the intended focus.
        /// </summary>
        /// <param name="context" type="object">Element or jQuery object to search within for the element to apply focus to.</param>

        // Declare variables for the various selectors to use for finding focusable elements
        var preselectedFocusableElementSelector = "input.sg-focus-on-load, select.sg-focus-on-load, textarea.sg-focus-on-load";
        var genericFocusableElementSelector = "input, select, textarea";

        // If applying focus when the page loads is disabled, then stop any further processing
        if (!_focusOnLoadEnabled) {
            return;
        }

        // Set the context to null if one wasn't provided.
        if (context === undefined) {
            context = $(pageContentSelector());
        }

        // Check if a specific field was flagged as the one that should receive focus
        var $focusableElements = context === null ? $(preselectedFocusableElementSelector) : $(preselectedFocusableElementSelector, context);

        // If there wasn't a field flagged to receive the focus, then get a list of focusable fields
        if ($focusableElements.length === 0) {
            $focusableElements = context === null ? $(genericFocusableElementSelector) : $(genericFocusableElementSelector, context);
        }

        // If there is at least one focusable element based on a basic search, let's check in more detail
        // to find the actual element to focus on.
        if ($focusableElements.length > 0) {
            // Perform initializations
            var elementIndex = 0;
            var elementCount = $focusableElements.length;
            var elementFound = false;
            var $element = null;

            // Loop through the elements until the element we should apply focus to is found or until
            // we run out of elements
            while (!elementFound && elementIndex < elementCount) {
                // Get a reference to the element
                $element = $($focusableElements[elementIndex]);

                // Determine if the element is part of a toggle button group
                var isToggleButton = false;
                if ($element.prop("tagName").toLowerCase() === "input" && $element.attr("type") === "radio") {
                    isToggleButton = $element.closest(".btn-group").length !== 0;
                }

                // Check if the element is not a toggle button, is visible, and is enabled and exit the loop if it
                // meets all of these conditions
                if (!isToggleButton && isElementVisible($element) && isElementEnabled($element)) {
                    elementFound = true;
                }

                // Increment to the next element
                elementIndex++;
            }

            // If an element was found, apply focus
            if (elementFound) {
                scrollToElement($element);
                if ($element.hasClass("sg-select-box")) {
                    $element.select2("focus");
                } else {
                    $element.focus();
                }
            }
        }
    }

    //#endregion Auto Focus on Page Load

    var handleApiError = function (jqXHR, textStatus, errorThrown) {
        /// <summary>
        /// Handles an error returned by an internal eSchoolPLUS API call.
        /// </summary>
        /// <param name="jqXHR" type="type">The jQuery XML HTTP Request object.</param>
        /// <param name="textStatus" type="type">The request's status as text.</param>
        /// <param name="errorThrown" type="type">The error thrown.</param>

        if (jqXHR.statusText !== "abort") {
            if (jqXHR.status === 500) {
                var error = jqXHR.responseJSON;
                var referenceId = error.ReferenceId;
                if (typeof referenceId == "undefined" || referenceId === null) referenceId = "UNKNOWN";
                var errorMessage = $.validator.format(SunGard.Common.GetResourceString("AjaxBatchError"), referenceId);
                if (typeof SunGard.Bootstrap !== "undefined" && typeof SunGard.Bootstrap.Dialog !== "undefined") {
                    SunGard.Bootstrap.Dialog.ShowAlert("batchEror", errorMessage, SunGard.Common.GetResourceString("AjaxBatchErrorTitle"));
                } else {
                    alert(errorMessage);
                }
                $("#AjaxSpinner").fadeOut('slow');
                return;
            }
        }
    };

    //#region Exposed Properties and Methods

    return {
        // Enumerations
        UseTokenWhenTypes: UseTokenWhenTypes,
        UserAccessType: userAccessType,
        ChangeStatus: changeStatus,
        InputFormTypes: inputFormTypes,

        // Initialization Method
        Init: init,

        // Adjust Page Padding
        AdjustPagePadding: adjustPagePadding,

        // Element Height/Width Methods
        GetElementHeight: getElementHeight,
        GetElementWidth: getElementWidth,

        // Root URL
        RootURL: rootURL,
        RootApiURL: rootApiURL,

        // Access Online Help
        ShowOnlineHelp: showOnlineHelp,

        // Page Actions (Timestamps and Dirty Status Messages)
        SetPageTimestamp: setPageTimestamp,
        PageTrackingChanges: pageTrackingChanges,
        SetTrackedContent: setTrackedContent,
        InitializeChangeStatus: initializeChangeStatus,
        GetChangeStatus: getChangeStatus,
        SetDirty: setDirty,
        SetSaved: setSaved,
        ClearChangeStatus: clearChangeStatus,

        // Client-side Localization
        AddResource: addResource,
        GetResourceString: getResourceString,

        // User Access
        SetDefaultUserAccess: setDefaultUserAccess,
        GetDefaultUserAccess: getDefaultUserAccess,

        // Ajax Methods
        AjaxPost: ajaxPost,
        AjaxGet: ajaxGet,
        AddToCurrentAjaxCalls: addToCurrentAjaxCalls,
        RemoveFromCurrentAjaxCalls: removeFromCurrentAjaxCalls,
        AbortActiveAjaxCalls: abortActiveAjaxCalls,
        ActiveAjaxCallCount: activeAjaxCallCount,
        OnAjaxCallStarts: onAjaxCallStarts,
        OnAjaxCallStops: onAjaxCallStops,
        SetCustomAjaxErrorDialogWindowOptions: setCustomAjaxErrorDialogWindowOptions,
        ShowAjaxLoadError: showAjaxLoadError,
        HandleApiError: handleApiError,

        // AJAX Spinner Methods
        DisableSpinner: disableSpinner,
        EnableSpinner: enableSpinner,
        SuppressSpinner: suppressSpinner,
        ShowSpinner: showSpinner,
        HideSpinner: hideSpinner,

        // jQuery Extensions

        // Array Searching
        CaseInsensitiveInArray: caseInsensitiveInArray,

        // Validate Numeric Input
        ValidateNumericInput: validateNumericInput,

        // HTML Encoding
        HtmlEncode: htmlEncode,
        HtmlDecode: htmlDecode,

        // Debugging Tools
        ConsoleLog: consoleLog,
        ExpandObject: expandObject,
        Time: time,
        TimeEnd: timeEnd,

        // Data Processing - note these are not currently implemented
        GetDateMoment: getDateMoment,
        FormatDate: formatDate,
        ParseDate: parseDate,
        GetTimeMoment: getTimeMoment,
        FormatTime: formatTime,
        ParseTime: parseTime,
        GetDateTimeMoment: getDateTimeMoment,
        FormatDateAndTime: formatDateAndTime,
        ParseDateAndTime: parseDateAndTime,

        // Check Page Dirty Before Navigation
        SetSaveOnNavigationCheck: setSaveOnNavigationCheck,
        GetSaveFunction: getSaveFunction,
        CheckToSaveBeforeAction: checkToSaveBeforeAction,
        OnNavigateAway: onNavigateAway,
        OnPageUnload: onPageUnload,

        // Authentication Token Processing
        GetAuthenticationToken: null,
        UseTokenWhen: UseTokenWhenTypes.BOTH,
        UseTokenForAjaxCalls: function () {
            return this.GetAuthenticationToken !== undefined && this.GetAuthenticationToken !== null &&
                    (this.UseTokenWhen == UseTokenWhenTypes.AJAX || this.UseTokenWhen == UseTokenWhenTypes.BOTH);
        },
        UseTokenForLegacyCalls: function () {
            return this.GetAuthenticationToken !== undefined && this.GetAuthenticationToken !== null &&
                    (this.UseTokenWhen == UseTokenWhenTypes.LEGACY || this.UseTokenWhen == UseTokenWhenTypes.BOTH);
        },

        // Screen Printing
        InitializeScreenPrint: initializeScreenPrint,
        GetScreenPrintUrl: function () {
            return _screenPrintUrl;
        },

        // Page Content Selector Properties
        PageHeaderSelector: pageHeaderSelector,
        PageContentSelector: pageContentSelector,
        PageFooterSelector: pageFooterSelector,

        // Auto Focus on Page Load
        FocusOnLoadEnabled: focusOnLoadEnabled,
        ApplyFocusOnLoad: applyFocusOnLoad
    };

    //#endregion

}();