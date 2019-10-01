var SunGard = (SunGard || {});
SunGard.eSchoolPLUS = (SunGard.eSchoolPLUS || {});
$.extend(SunGard.eSchoolPLUS, function () {

    var _area = "";
    var _controller = "";
    var _action = "";
    var _yearMode = null;
    var _applicationType = null;

    var init = function (listMaximum, appType) {
        /// <summary>
        /// Performs any initialization for pages within the eSchoolPLUS site.
        /// </summary>
        /// <param name="listMaximum">The maximum number of records to appear in one page of a grid.</param>

        _applicationType = appType;
        // Perform any Twitter/SunGard Bootstrap initializations.
        SunGard.Bootstrap.Init();
        SunGard.Bootstrap.Dialog.DialogContainer($(".sg-page-content .hidden-xs"));

        // disable ajax caching by default
        $.ajaxSetup({ cache: false });

        if (typeof listMaximum != "undefined") {
            // build the default list of values for records per page.
            var rowList = [10, 20, 50, 100, 200];

            // if the list maximum isn't in the list, add it.
            if ($.inArray(listMaximum, rowList) < 0) {
                rowList.push(listMaximum);
                rowList.sort(function (a, b) { return (a - b) });
            }

            // set the default row number max & list of rows per page for grids.
            $.extend($.jgrid.defaults, {
                rowNum: listMaximum,
                rowList: rowList
            });
        }

        //AJAX Spinner functionality 
        SunGard.Common.EnableSpinner();

        // Set the page content selector
        SunGard.Common.PageContentSelector(".sg-page-content > .hidden-xs");

        // Initialize the screen print functionality
        SunGard.Common.InitializeScreenPrint("Common", "ScreenPrint");

        // Handle the print screen click event
        $('.sg-screen-print-icon').click(function () {
            var screenSize = SunGard.Bootstrap.GetPageSize();
            var orientation;
            switch (screenSize) {
                case "lg":
                case "xl":
                    orientation = SunGard.Bootstrap.ScreenPrint.PageOrientation.Landscape;
                    break;

                default:
                    orientation = SunGard.Bootstrap.ScreenPrint.PageOrientation.Portrait;
                    break;
            }
            SunGard.Bootstrap.ScreenPrint.Capture(orientation);
        });

        // Attach event handlers for support options available via the username menu
        $(document).on("click", "#efTracing", efTracing);

        // Override the default AJAX load error settings
        SunGard.Common.SetCustomAjaxErrorDialogWindowOptions({
            width: function () {
                // Size the error window based on the size of the current window.  However, make the minimum
                // width it opens in is 768 so the error window doesn't get the "your browser is too small"
                // message.  This is necessary in case the user's default window size is smaller than 768.
                var currentWindowWidth = $(window).width();
                var errorWindowSize = (currentWindowWidth * 0.9).toFixed();
                if (errorWindowSize < 768) {
                    errorWindowSize = 768;
                }
                return errorWindowSize;
            }
        });
    };

    var area = function (area) {
        if (typeof area === 'undefined') {
            return _area;
        } else {
            _area = area;
        }
    };

    var controller = function (ctrlr) {
        if (typeof ctrlr === 'undefined') {
            return _controller;
        } else {
            _controller = ctrlr;
        }
    };

    var action = function (action) {
        if (typeof action === 'undefined') {
            return _action;
        } else {
            _action = action;
        }
    };

    var setSaveOnNavigationCheck = function (saveFn, validatePageChangeCallback) {
        ///<summary>Prompts the user to save when clicking in the menu.</summary>        
        ///<param name="saveFn" type="Function">The function that defines the actions that should occur after the save.  This function must access two parameters:  the event object and a callback function.</param>
        ///<param name="validatePageChangeCallback" type="Function" optional="true">The function that checks for unsaved changes.</param>

        SunGard.Common.SetSaveOnNavigationCheck('#mega-menu a, .navbar a[href!=#], .sg-nav-home-container, #espMenuFavoritesContainer a', saveFn, validatePageChangeCallback);

        // check for changes before changing environment or navigating after a quicksearch.
        if (typeof SunGard.eSchoolPLUS.Environment !== "undefined") {
            SunGard.eSchoolPLUS.Environment.CheckToSaveBeforeChanging(saveFn, validatePageChangeCallback);
        }
        if (typeof SunGard.eSchoolPLUS.QuickSearch !== "undefined") {
            SunGard.eSchoolPLUS.QuickSearch.CheckToSaveBeforeNavigation(saveFn, validatePageChangeCallback);
        }
    };

    var openStudentSummary = function (studentId) {
        if ($.trim(studentId) != "") {
            var url = SunGard.Common.RootURL() + "/Student/Registration/StudentSummary?dialog=true&studentId=" + $.trim(studentId);
            window.open(url, "StudentSummary", "width=830, height=600, menubar=no, status=no, scrollbars=yes, toolbar=no, location=no");
        }
    };

    var selectedYearMode = function (yearMode) {
        if (yearMode === undefined) {
            if (_yearMode === null) {
                return SunGard.eSchoolPLUS.Enumerations.YearMode.CurrentYear;
            } else {
                return _yearMode;
            }
        } else {
            _yearMode = yearMode;
        }
    };

    var displayPageLoadErrors = function (errors) {
        /// <summary>
        /// Displays errors found during page load
        /// </summary>
        /// <param name="errors" type="SunGard.Common.Models.ValidationErrorMessage[]">Array of validation error message objects.</param>

        // Localize each error message and display it, as appropriate
        $(errors).each(function (index, error) {
            var message = SunGard.Common.Validation.LocalizeMessage(error);
            SunGard.Common.Validation.AddClientValidationSummaryMessage(message.message, error.GlobalMessageId);
        });
    };

    var efTracing = function (e) {
        /// <summary>
        /// Event handler that fires when the user clicks on the EF Tracing option to toggle the setting.
        /// </summary>
        /// <param name="e" type="object">Event object</param>

        // Make the AJAX call to toggle the EF Tracing setting.  This process should run synchronously so the user
        // doesn't perform any action until this process completes.
        SunGard.Common.AjaxPost(SunGard.Common.RootURL() + "/SupportTools/ToggleDefaultEFTracing", null, function (response, status, jqXHR) {
            // If the setting was toggled successfully on the server, update the UI accordingly
            if (response.success) {
                var $debugOn = $("#efTracingOn");
                var $debugOff = $("#efTracingOff");

                if (response.tracingOn) {
                    $debugOn.removeClass("hidden");
                    $debugOff.addClass("hidden");
                } else {
                    $debugOn.addClass("hidden");
                    $debugOff.removeClass("hidden");
                }
            // If an error occurred while toggling the setting, tell the user about the error.
            } else {
                var dialogMessage = "The following error occurred while attempting to toggle the 'EF Tracing' setting:<ul><li>" + response.message + "</li></ul>";
                SunGard.Bootstrap.Dialog.ShowAlert("efTracingError", dialogMessage, "Error");
            }
        }, undefined, undefined, undefined, undefined, { async: false });
    };

    return {
        Init: init,
        Area: area,
        Controller: controller,
        Action: action,
        SetSaveOnNavigationCheck: setSaveOnNavigationCheck,
        OpenStudentSummary: openStudentSummary,
        SelectedYearMode: selectedYearMode,
        DisplayPageLoadErrors: displayPageLoadErrors,
        GetApplicationType: function () { return _applicationType; },
    };
}());