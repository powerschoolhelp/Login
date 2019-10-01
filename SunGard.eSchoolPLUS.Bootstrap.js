//#region File Info
/*
 * ------------------------------------------------------------------------------------------------
 * © Copyright 1990-2014 SunGard K-12 Education, All Rights Reserved.
 * This program is PROPRIETARY and CONFIDENTIAL information of SunGard K-12 Education, and may not
 * be disclosed or used except as expressly authorized in a license agreement controlling such use
 * and disclosure.  Unauthorized use of this program will result in legal proceedings, civil
 * damages, and possible criminal prosecution.
 * ------------------------------------------------------------------------------------------------
 * System Name: eSchoolPLUS
 * ------------------------------------------------------------------------------------------------
 * File Name: SunGard.eSchoolPLUS.Bootstrap.js
 * ------------------------------------------------------------------------------------------------
 * File Description:
 *   JavaScript file that includes eSchoolPLUS-specific Bootstrap related properties/methods.
 * ------------------------------------------------------------------------------------------------
 */
//#endregion

//#region Create parent namespaces

var SunGard = (SunGard || {});
SunGard.eSchoolPLUS = (SunGard.eSchoolPLUS || {});
SunGard.eSchoolPLUS.Bootstrap = (SunGard.eSchoolPLUS.Bootstrap || {});

//#endregion

SunGard.eSchoolPLUS.Bootstrap.DropDownList = function () {

    //#region Option Processing Methods

    var processDataOptions = function (data) {
        /// <summary>
        /// Processes the data options to add/remove options based on application business rules.
        /// </summary>
        /// <param name="data" type="object[]">Data options to process</param>
        /// <returns type="object[]">The data options for the dropdown control after applying the application business rules.</returns>

        // Get a reference to the element the data options are for
        var $element = $(this);

        // Check if we're supposed to filter out inactive values and do so, if applicable
        if ($element.data("sg-filter-inactives")) {
            var activeProperty = $element.data("sg-active-property");
            data.results = filterOutInactives.call(this, data.results, activeProperty);
        }

        // Perform the base processing of the data options
        data = SunGard.Bootstrap.DropDownList.ProcessDataOptions.call(this, data);

        // Return the data after all processing has been done
        return data;
    };

    var limitValidationResults = function (data) {
        // Handle the base processing
        data = processDataOptions.call(this, data);

        // If we have more than 500 results
        if (data.results.length > 500) {
            var $this = $(this);
            var selectData = $(this).data();
            var code = selectData.sgIdProperty;
            var text = selectData.sgTextProperty;
            var searchValue = '';
            var limitValues = true;
            // If we have select2 data
            if (selectData.select2 && selectData.select2.search) {
                // Determine if a search value was entered
                searchValue = $.trim(selectData.select2.search.val());
                // If the length of the search item is greater than 1
                if (searchValue.length > 1) {
                    // Don't bother filtering.  The select2 object will handle it well enough
                    limitValues = false;
                }
            }
            // IF the value list should be limited
            if (limitValues) {
                // Save the full results
                var fullResults = data.results;

                // If the length of the filter is 1
                if (searchValue.length === 1) {
                    // Create a regular expression to search for the filter
                    var searchExp = new RegExp(searchValue, 'i');
                    // Limit the values based on the search value
                    data.results = fullResults.filter(function (ele) {
                        var search = $.trim(ele[text]) === "" ? $.trim(ele[code]) : $.trim(ele[code]) + ' - ' + $.trim(ele[text]);
                        return searchExp.test(search);
                    });
                }

                // Limit the data to the first 500 entries
                if (data.results.length > 500) data.results = data.results.slice(0, 500);

                // Check if a value has been selected.
                if ($.trim($this.val()) !== '') {
                    var selectedValue = $this.val();

                    // Try to locate the selected value
                    var exists = $.grep(data.results, function (ele, idx) {
                        return $.trim(ele[data.id]) === $.trim(selectedValue);
                    });

                    // If the selected value is not in the limited results
                    if (exists.length === 0) {
                        // Locate the selected value in the full result set
                        var selectedObj = $.grep(fullResults, function (ele, idx) {
                            return $.trim(ele[data.id]) === $.trim(selectedValue);
                        });
                        // If we found an entry, add it to the limited results
                        if (selectedObj.length > 0) {
                            data.results.push(selectedObj[0]);
                        }
                    }
                }
            }
        }
        return data;
    };

    var addDataProcessingAttributes = function (activeProperty) {
        /// <summary>
        /// Get the necessary data attributes so the eSchoolPLUS business rules will be applied to the data options.
        /// </summary>
        /// <param name="activeProperty" type="string" optional="true">The name of the active property on each data option object</param>
        /// <returns type="object">An object with the necessary data attributes for telling a dropdown/listbox control to process the application business rules for the data options.</returns>

        activeProperty = (activeProperty || "Active");

        return {
            "data-sg-process-data-options": "SunGard.eSchoolPLUS.Bootstrap.DropDownList.ProcessDataOptions",
            "data-sg-filter-inactives": true,
            "data-sg-active-property": activeProperty
        };
    };

    //#endregion

    //#region Data Filtering Methods

    var filterOutInactives = function (data, activeProperty) {
        /// <summary>
        /// Filters out any inactive validation table entries as appropriate for the year mode.
        /// </summary>
        /// <param name="data" type="object[]">Data that should be filtered.</param>
        /// <param name="activeProperty" type="string" optional="true">Name of the active property if it is not 'Active'.</param>
        /// <returns type="object[]">Returns the passed in data with the inactive options filtered out, as appropriate.</returns>

        // Get a reference to the control the data is being provided for.
        var $element = $(this);

        // Only continue if the control is for a Select2 control.
        if ($element.hasClass("select2-offscreen")) {
            // Get the year mode that should be used for the control.
            var yearMode = SunGard.eSchoolPLUS.SelectedYearMode();
            var elementData = $element.data();
            if (elementData.yearMode !== undefined) {
                yearMode = elementData.yearMode;
            }

            // Get the name of the 'Active' property.
            activeProperty = activeProperty === null || activeProperty === undefined ? "Active" : activeProperty;

            switch (yearMode) {
                // No values get filtered out in prior year mode.
                case SunGard.eSchoolPLUS.Enumerations.YearMode.PriorYear:
                    break;

                // Filter out inactive options for current and next year modes unless the control's
                // currently selected value is an inactive option.
                case SunGard.eSchoolPLUS.Enumerations.YearMode.CurrentYear:
                case SunGard.eSchoolPLUS.Enumerations.YearMode.NextYear:
                    // Build an array of the currently selected value/values
                    var selectedValue = $element.val();
                    var selectedValues;
                    if (isNaN(selectedValue) && selectedValue.indexOf(",") >= 0) {
                        selectedValues = selectedValue.split(',');
                    } else {
                        selectedValues = [ selectedValue ];
                    }
                    for (var index in selectedValues) {
                        selectedValues[index] = $.trim(selectedValues[index]);
                    }

                    // Filter out the inactive codes as appropriate
                    var inactiveData = $.grep(data, function (option, index) {
                        var code = optionCode($element, option);
                        return (option.hasOwnProperty(activeProperty) &&
                                ((typeof option[activeProperty] === "string" &&
                                  option[activeProperty].toLowerCase() !== "true") ||
                                 (typeof option[activeProperty] === "boolean" &&
                                  option[activeProperty] !== true)) &&
                                  SunGard.Common.CaseInsensitiveInArray(code, selectedValues) === -1);
                    });
                    $(inactiveData).each(function (index, option) {
                        var indexToRemove = $.inArray(option, data);
                        data.splice(indexToRemove, 1);
                    })
                    break;

                default:
                    throw "FilterOutInactives:  Invalid year mode provided (" + yearMode + ")";
            }
        }

        // Return the filtered data
        return data;
    }

    //#endregion

    //#region Private Methods

    var optionCode = function (element, option) {
        var code = "";
        var idProperty = element.data().sgIdProperty;

        if (option[idProperty] === undefined || option[idProperty] === null) {
            if (option.attr !== undefined) {
                code = option.attr("value");
            }
        } else {
            code = option[idProperty];
        }

        return $.trim(code);
    };

    //#endregion

    return {
        ProcessDataOptions: processDataOptions,
        LimitValidationResults: limitValidationResults,
        AddDataProcessingAttributes: addDataProcessingAttributes,
        FilterOutInactives: filterOutInactives
    };

}();
