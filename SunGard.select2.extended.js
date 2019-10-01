//#region File Header
/*
 * ------------------------------------------------------------------------------------------------
 * © Copyright 1990-2015 SunGard K-12 Education, All Rights Reserved.
 * This program is PROPRIETARY and CONFIDENTIAL information of SunGard K-12 Education, and may not
 * be disclosed or used except as expressly authorized in a license agreement controlling such use
 * and disclosure.  Unauthorized use of this program will result in legal proceedings, civil
 * damages, and possible criminal prosecution.
 * ------------------------------------------------------------------------------------------------
 * System Name: SunGard K-12 Education
 * ------------------------------------------------------------------------------------------------
 * File Name: Sungard.select2.extended.js
 * ------------------------------------------------------------------------------------------------
 * File Description:
 *   jQuery script file that includes SunGard processing that is called by Select2 control logic.
 * ------------------------------------------------------------------------------------------------
 */
//#endregion

var SunGard = $.extend({}, SunGard);

SunGard.Select2 = function () {

    var sunGardDataProcessing = function (element, dataFn) {
        /// <summary>
        /// Determines how to process the data options for a select2 control.
        /// </summary>
        /// <param name="element" type="object">The element the select2 control is linked to.</param>
        /// <param name="dataFn" type="function">The data function to call that retrieves the initial set of options for the control.</param>
        /// <returns type="object">Returns the data object in the format expected by select2 after any application business rules have been applied.</returns>

        // Get a reference to the jQuery object for the element
        var $element = $(element);

        // Get the initial set of options for the control.
        var data = dataFn.call(element);

        // If the element is configured to call a function to process the data, then do so
        if ($.isFunction($element.data("sg-process-data-options"))) {
            // If the element has flagged that the data object should be cloned and then
            // processed as opposed to modifed as is, then clone it.
            if ($element.data("sg-clone-data")) {
                data = $.extend(true, [], data);
            }

            // Perform any application business rules to the data options
            data = $element.data("sg-process-data-options").call(element, data);
        }

        // Return the data options to select2
        return data;
    };

    return {
        SunGardDataProcessing: sunGardDataProcessing
    }

}();
