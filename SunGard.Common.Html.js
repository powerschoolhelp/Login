(function () {
    var enumIndex;

    if (SunGard === undefined) {
        window.SunGard = {};
    }
    SunGard.Common = (SunGard.Common || {});
    SunGard.Common.Html = (SunGard.Common.Html || {});

    SunGard.Common.Html.TagRenderMode = {
        Normal: 0,
        StartTag: 1,
        EndTag: 2,
        SelfClosing: 3
    };

    SunGard.Common.Html.ButtonType = {
        Button: "button",
        Submit: "submit",
        Reset: "reset"
    };

    SunGard.Common.Html.OptionInputType = {
        Inline: 0,
        Stacked: 1,
        ButtonToggle: 2,
        ButtonToggleAddon: 3
    };

    SunGard.Common.Html.StyleType = {
        Default: "default",
        Branded: "primary",
        Success: "success",
        Info: "info",
        Warning: "warning",
        Danger: "danger"
    };

    SunGard.Common.Html.SelectDisplayFormat = {
        Code: "code",
        Description: "description",
        CodeAndDescription: "codeAndDescription"
    };

    SunGard.Common.Html.TextAreaAutoSizing = {
        None: "None",
        LargerOnly: "LargerOnly",
        // Leaving these options commented for future implementation.
        //SmallerOnly: "SmallerOnly",
        //Any: "Any"
    };

    SunGard.Common.Html.HtmlDisplayType = {
        Block: 0,
        Inline: 1
    };

    SunGard.Common.Html.AlertType = {
        None: "alert",
        Success: "alert alert-success",
        Warning: "alert alert-warning",
        Danger: "alert alert-danger",
        Information: "alert alert-info"
    }

    enumIndex = 0;
    var iconType = SunGard.Common.Html.IconType = [];
    iconType[enumIndex++] = iconType.Add = { IconName: "Add", IconDetails: [{ FontClass: "fa fa-plus-circle" }] };
    iconType[enumIndex++] = iconType.Edit = { IconName: "Edit", IconDetails: [{ FontClass: "fa fa-pencil" }] };
    iconType[enumIndex++] = iconType.ToggleOn = { IconName: "ToggleOn", IconDetails: [{ FontClass: "fa fa-toggle-on" }] };
    iconType[enumIndex++] = iconType.ToggleOff = { IconName: "ToggleOff", IconDetails: [{ FontClass: "fa fa-toggle-off" }] };
    iconType[enumIndex++] = iconType.View = { IconName: "View", IconDetails: [{ FontClass: "fa fa-ban text-danger" }] };
    iconType[enumIndex++] = iconType.Save = { IconName: "Save", IconDetails: [{ FontClass: "fa fa-save" }] };
    iconType[enumIndex++] = iconType.SaveTemporary = { IconName: "Save", IconDetails: [{ FontClass: "fa fa-ban text-danger" }] };
    iconType[enumIndex++] = iconType.Finish = { IconName: "Finish", IconDetails: [{ FontClass: "fa fa-check-circle text-success" }] };
    iconType[enumIndex++] = iconType.Delete = { IconName: "Delete", IconDetails: [{ FontClass: "fa fa-trash-o" }] };
    iconType[enumIndex++] = iconType.Undelete = { IconName: "Undelete", IconDetails: [{ FontClass: "fa fa-trash-o fa-rotate-270" }] };
    iconType[enumIndex++] = iconType.Run = { IconName: "Run", IconDetails: [{ FontClass: "fa fa-play-circle-o" }] };
    iconType[enumIndex++] = iconType.Group = { IconName: "Group", IconDetails: [{ FontClass: "fa fa-sitemap fa-rotate-270" }] };
    iconType[enumIndex++] = iconType.LeftRight = { IconName: "LeftRight", IconDetails: [{ FontClass: "fa fa-arrows-h" }] };
    iconType[enumIndex++] = iconType.UpDown = { IconName: "UpDown", IconDetails: [{ FontClass: "fa fa-arrows-v" }] };
    iconType[enumIndex++] = iconType.Up = { IconName: "Up", IconDetails: [{ FontClass: "fa fa-arrow-up" }] };
    iconType[enumIndex++] = iconType.Down = { IconName: "Down", IconDetails: [{ FontClass: "fa fa-arrow-down" }] };
    iconType[enumIndex++] = iconType.Copy = { IconName: "Copy", IconDetails: [{ FontClass: "fa fa-files-o" }] };
    iconType[enumIndex++] = iconType.Cancel = { IconName: "Cancel", IconDetails: [{ FontClass: "fa fa-times-circle-o" }] };
    iconType[enumIndex++] = iconType.Favorite = { IconName: "Favorite", IconDetails: [{ FontClass: "fa fa-star" }] };
    iconType[enumIndex++] = iconType.Search = { IconName: "Search", IconDetails: [{ FontClass: "fa fa-search" }] };
    iconType[enumIndex++] = iconType.SearchFavorite = { IconName: "SearchFavorite", IconDetails: [{ FontClass: "fa fa-star fa-stack-2x" }, { FontClass: "fa fa-search fa-stack-1x fa-inverse" }] };
    iconType[enumIndex++] = iconType.List = { IconName: "List", IconDetails: [{ FontClass: "fa fa-list-ul" }] };
    iconType[enumIndex++] = iconType.Checklist = { IconName: "Checklist", IconDetails: [{ FontClass: "fa fa-edit" }] };
    iconType[enumIndex++] = iconType.Checked = { IconName: "Checked", IconDetails: [{ FontClass: "fa fa-check" }] };
    iconType[enumIndex++] = iconType.Detail = { IconName: "Detail", IconDetails: [{ FontClass: "fa fa-file-text-o" }] };
    iconType[enumIndex++] = iconType.Summary = { IconName: "Summary", IconDetails: [{ FontClass: "fa fa-file-text" }] };
    iconType[enumIndex++] = iconType.PersonDrawer = { IconName: "PersonDrawer", IconDetails: [{ FontClass: "fa fa-user" }] };
    iconType[enumIndex++] = iconType.Home = { IconName: "Home", IconDetails: [{ FontClass: "fa fa-home" }] };
    iconType[enumIndex++] = iconType.Activity = { IconName: "Activity", IconDetails: [{ FontClass: "fa fa-child" }] };
    iconType[enumIndex++] = iconType.PerformancePLUS = { IconName: "PerformancePLUS", IconDetails: [{ FontClass: "fa fa-dashboard" }] };
    iconType[enumIndex++] = iconType.ReportBar = { IconName: "ReportBar", IconDetails: [{ FontClass: "fa fa-bar-chart-o" }] };
    iconType[enumIndex++] = iconType.ReportPie = { IconName: "ReportPie", IconDetails: [{ FontClass: "fa fa-pie-chart" }] };
    iconType[enumIndex++] = iconType.Dashboard = { IconName: "Dashboard", IconDetails: [{ FontClass: "fa fa-dashboard" }] };
    iconType[enumIndex++] = iconType.Flag = { IconName: "Flag", IconDetails: [{ FontClass: "fa fa-flag" }] };
    iconType[enumIndex++] = iconType.Warning = { IconName: "Warning", IconDetails: [{ FontClass: "fa fa-exclamation-triangle" }] };
    iconType[enumIndex++] = iconType.NavigateTo = { IconName: "NavigateTo", IconDetails: [{ FontClass: "fa fa-bolt" }] };
    iconType[enumIndex++] = iconType.NewWindow = { IconName: "NewWindow", IconDetails: [{ FontClass: "fa fa-external-link" }] };
    iconType[enumIndex++] = iconType.ExpandView = { IconName: "ExpandView", IconDetails: [{ FontClass: "fa fa-expand" }] };
    iconType[enumIndex++] = iconType.CollapseView = { IconName: "CollapseView", IconDetails: [{ FontClass: "fa fa-compress" }] };
    iconType[enumIndex++] = iconType.Menu = { IconName: "Menu", IconDetails: [{ FontClass: "fa fa-navicon" }] };
    iconType[enumIndex++] = iconType.Back = { IconName: "Back", IconDetails: [{ FontClass: "fa fa-arrow-circle-left" }] };
    iconType[enumIndex++] = iconType.Next = { IconName: "Next", IconDetails: [{ FontClass: "fa fa-arrow-circle-right" }] };
    iconType[enumIndex++] = iconType.Birthday = { IconName: "Birthday", IconDetails: [{ FontClass: "fa fa-birthday-cake" }] };
    iconType[enumIndex++] = iconType.Attach = { IconName: "Attach", IconDetails: [{ FontClass: "fa fa-paperclip" }] };
    iconType[enumIndex++] = iconType.Attachment = { IconName: "Attachment", IconDetails: [{ FontClass: "fa fa-file-o fa-stack-2x" }, { FontClass: "fa fa-paperclip fa-stack-1x" }] };
    iconType[enumIndex++] = iconType.Documents = { IconName: "Documents", IconDetails: [{ FontClass: "fa fa-file-o" }] };
    iconType[enumIndex++] = iconType.Comment = { IconName: "Comment", IconDetails: [{ FontClass: "fa fa-comment" }] };
    iconType[enumIndex++] = iconType.Comments = { IconName: "Comments", IconDetails: [{ FontClass: "fa fa-comments-o" }] };
    iconType[enumIndex++] = iconType.Notes = { IconName: "Notes", IconDetails: [{ FontClass: "fa fa-list-alt" }] };
    iconType[enumIndex++] = iconType.Email = { IconName: "Email", IconDetails: [{ FontClass: "fa fa-paper-plane" }] };
    iconType[enumIndex++] = iconType.Load = { IconName: "Load", IconDetails: [{ FontClass: "fa fa-refresh" }] };
    iconType[enumIndex++] = iconType.Download = { IconName: "Download", IconDetails: [{ FontClass: "fa fa-download" }] };
    iconType[enumIndex++] = iconType.Upload = { IconName: "Upload", IconDetails: [{ FontClass: "fa fa-upload" }] };
    iconType[enumIndex++] = iconType.Backup = { IconName: "Backup", IconDetails: [{ FontClass: "fa fa-database" }] };
    iconType[enumIndex++] = iconType.Restore = { IconName: "Restore", IconDetails: [{ FontClass: "fa fa-ban text-danger" }] };
    iconType[enumIndex++] = iconType.SummerSchool = { IconName: "SummerSchool", IconDetails: [{ FontClass: "fa fa-sun-o sg-text-summer-school" }] };
    iconType[enumIndex++] = iconType.Print = { IconName: "Print", IconDetails: [{ FontClass: "fa fa-print" }] };
    iconType[enumIndex++] = iconType.ReportPdf = { IconName: "ReportPdf", IconDetails: [{ FontClass: "fa fa-file-pdf-o" }] };
    iconType[enumIndex++] = iconType.ReportExcel = { IconName: "ReportExcel", IconDetails: [{ FontClass: "fa fa-file-excel-o" }] };
    iconType[enumIndex++] = iconType.Start = { IconName: "Start", IconDetails: [{ FontClass: "fa fa-circle fa-stack-2x" }, { FontClass: "fa fa-star fa-stack-1x fa-inverse" }] };
    iconType[enumIndex++] = iconType.Restart = { IconName: "Restart", IconDetails: [{ FontClass: "fa fa-circle fa-stack-2x" }, { FontClass: "fa fa-fast-backward fa-stack-1x fa-inverse" }] };
    iconType[enumIndex++] = iconType.Suspend = { IconName: "Suspend", IconDetails: [{ FontClass: "fa fa-circle fa-stack-2x" }, { FontClass: "fa fa-pause fa-stack-1x fa-inverse" }] };
    iconType[enumIndex++] = iconType.Resume = { IconName: "Resume", IconDetails: [{ FontClass: "fa fa-play-circle" }] };
    iconType[enumIndex++] = iconType.Stop = { IconName: "Stop", IconDetails: [{ FontClass: "fa fa-circle fa-stack-2x" }, { FontClass: "fa fa-stop fa-stack-1x fa-inverse" }] };
    iconType[enumIndex++] = iconType.CancelDoc = { IconName: "CancelDoc", IconDetails: [{ FontClass: "fa fa-stack-2x fa-file-o fa-flip-horizontal" }, { FontClass: "fa fa-lg fa-times-circle-o sg-canceldoc-stackoffset" }] };
    iconType[enumIndex++] = iconType.Preview = { IconName: "Preview", IconDetails: [{ FontClass: "fa fa-binoculars" }] };
    iconType[enumIndex++] = iconType.Delegate = { IconName: "Delegate", IconDetails: [{ FontClass: "fa fa-mail-forward" }] };
    iconType[enumIndex++] = iconType.Calendar = { IconName: "Calendar", IconDetails: [{ FontClass: "fa fa-calendar" }] };
    iconType[enumIndex++] = iconType.DateTimeStamp = { IconName: "DateTimeStamp", IconDetails: [{ FontClass: "fa fa-clock-o" }] };
    iconType[enumIndex++] = iconType.Notifications = { IconName: "Notifications", IconDetails: [{ FontClass: "fa fa-envelope" }] };
    iconType[enumIndex++] = iconType.Help = { IconName: "Help", IconDetails: [{ FontClass: "fa fa-question" }] };
    iconType[enumIndex++] = iconType.LogOut = { IconName: "LogOut", IconDetails: [{ FontClass: "fa fa-lock" }] };
    iconType[enumIndex++] = iconType.Settings = { IconName: "Settings", IconDetails: [{ FontClass: "fa fa-wrench" }] };
    iconType[enumIndex++] = iconType.Options = { IconName: "Options", IconDetails: [{ FontClass: "fa fa-chevron-circle-down" }] };

    SunGard.Common.Html.IconSize = {
        Medium: "sg-icon-md",
        Large: "sg-icon-lg"
    };

    SunGard.Common.Html.PanelLevel = {
        Level1: '1',
        Level2: '2',
        Level3: '3',
        Display: 'display',
        Other: 'other'
    };

    SunGard.Common.Html.DropdownSortOrder = {
        UseDefault: "0",
        Code: "1",
        Description: "2",
        None: "3"
    }
})();

SunGard.Common.Html.TagBuilder = function (tagName) {
    /// <summary>Creates a new tag that has the specified tag name</summary>
    /// <param name="tagName" type="string">The tag name without the "<", "/", or ">" delimiters</param>
    /// <returns></returns>

    var _tagName = tagName;
    var _attributes = {};
    var _innerHtml = '';

    function mergeAttribute(name, value, replaceExisting) {
        /// <summary>Adds a new attribute or optionally replaces an existing attribute in the opening tag.</summary>
        /// <param name="name" type="string">The key for the attribute</param>
        /// <param name="value" type="string">The value of the attribute</param>
        /// <param name="replaceExisting" type="bool">true to replace an existing attribute if an attribute exists that has the specified key value, or false to leave the original attribute unchanged</param>
        /// <returns></returns>

        if (name === null) {
            throw 'mergeAttribute(): The name parameter is required';
        }

        if (replaceExisting || !_attributes[name]) {
            _attributes[name] = value;
        }

        return this;
    }

    function mergeAttributes(attributes, replaceExisting) {
        /// <summary>Adds new attributes or optionally replaces existing attributes in the tag.</summary>
        /// <param name="attributes" type="object">The collection of attributes to add or replace</param>
        /// <param name="replaceExisting" type="bool">For each attribute in attributes, true to replace the attribute if an attribute already exists that has the same key, or false to leave the original attribute</param>
        /// <returns></returns>

        if (attributes !== null && typeof attributes === 'object') {
            $.each(attributes, function (name, value) {

                // if the value is actually a function, call the function now.
                // used mostly for knockout binding.
                if ($.isFunction(value)) {
                    value = value.apply();
                }

                mergeAttribute(name, value, replaceExisting);
            });
        }

        return this;
    }

    function addCssClass(cssClass) {
        /// <summary>Adds a CSS class to the list of CSS classes in the tag.</summary>
        /// <param name="cssClass" type="string">The CSS class to add</param>
        /// <returns></returns>

        if (_attributes['class']) {
            _attributes['class'] += ' ' + cssClass;
        } else {
            _attributes['class'] = cssClass;
        }

        return this;
    }

    function setInnerHtml(innerHtml) {
        /// <summary>Sets the inner HTML of the tag to value of the specified string</summary>
        /// <param name="innerHtml" type="string">The string to use as the inner HTML</param>
        /// <returns></returns>
        _innerHtml = innerHtml;

        return this;
    }

    function setInnerText(innerText) {
        /// <summary>Sets the inner text of the tag to the HTML-encoded version of the specified string</summary>
        /// <param name="innerText" type="string">The string to HTML-encode</param>
        /// <returns></returns>

        _innerHtml = htmlEncode(innerText);

        return this;
    }

    function generateId(name) {
        /// <summary>Generates a sanitized ID attribute for the tag by using the specified name.</summary>
        /// <param name="name" type="string">The name to use to generate the ID attrbute</param>
        /// <returns></returns>

        if (name === null || $.trim(name) === '') {
            name = _attributes['name'];
        }

        if (!_attributes['id']) {
            var value = SunGard.Common.Html.HtmlExtensionMethods.CreateSanitizedId(name);
            if ($.trim(value) !== '') {
                _attributes['id'] = value;
            }
        }

        return this;
    }

    function appendAttributes() {
        var htmlString = '';
        $.each(_attributes, function (n, v) {
            htmlString += formatAttribute(n, v);
        });
        return htmlString;
    }

    function formatAttribute(name, value) {
        if (name !== 'id' || (value !== null && $.trim(value) !== '')) {
            return ' ' + name + '=\'' + htmlEncode(value) + '\'';
        }

        return '';
    }

    function toString(renderMode) {
        /// <summary>Renders the HTML tag by using the specified render mode.  If no render mode is passed, Normal render mode will default.</summary>
        /// <param name="renderMode" type="string">The render mode</param>
        /// <returns></returns>

        var htmlString;

        if (renderMode === undefined) {
            renderMode = SunGard.Common.Html.TagRenderMode.Normal;
        }

        switch (renderMode) {
            case SunGard.Common.Html.TagRenderMode.StartTag:
                htmlString = '<' + _tagName + appendAttributes() + ' >';
                break;
            case SunGard.Common.Html.TagRenderMode.EndTag:
                htmlString = '</' + _tagName + '>';
                break;
            case SunGard.Common.Html.TagRenderMode.SelfClosing:
                htmlString = '<' + _tagName + appendAttributes() + ' />';
                break;
            default:
                htmlString = '<' + _tagName + appendAttributes() + ' >' +
                    _innerHtml + '</' + _tagName + '>';
                break;
        }

        return htmlString;
    }

    function htmlEncode(str) {
        /// <summary>Replaces ', ", <, >, and & with html encoded equivalents</summary>
        /// <param name="str" type="string">The string to encode</param>
        /// <returns type="string">The encoded string.</returns>

        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    return {
        SetInnerText: setInnerText,
        SetInnerHtml: setInnerHtml,
        MergeAttribute: mergeAttribute,
        MergeAttributes: mergeAttributes,
        AddCssClass: addCssClass,
        GenerateId: generateId,
        ToString: toString
    };
};

SunGard.Common.Html.HtmlExtensionMethods = function () {

    function isValidButtonType(buttonType) {
        /// <summary>
        /// Validates that the passed value is a valid ButtonType value
        /// </summary>
        /// <param name="buttonType" type="SunGard.Common.Html.ButtonType" optional="false">Button type to evaluate.</param>
        /// <returns type="boolean">Returns true if the parameter is a member of the enumeration.</returns>

        switch (buttonType) {
            case SunGard.Common.Html.ButtonType.Button:
            case SunGard.Common.Html.ButtonType.Submit:
            case SunGard.Common.Html.ButtonType.Reset:
                return true;

            default:
                return false;
        }
    }

    function isValidOptionInputType(optionInputType) {
        /// <summary>
        /// Validates that the passed value is a valid OptionInputType value
        /// </summary>
        /// <param name="optionInputType" type="SunGard.Common.Html.OptionInputType" optional="false">Option input type to evaluate.</param>
        /// <returns type="boolean">Returns true if the parameter is a member of the enumeration.</returns>

        switch (optionInputType) {
            case SunGard.Common.Html.OptionInputType.Inline:
            case SunGard.Common.Html.OptionInputType.Stacked:
            case SunGard.Common.Html.OptionInputType.ButtonToggle:
            case SunGard.Common.Html.OptionInputType.ButtonToggleAddon:
                return true;

            default:
                return false;
        }
    }

    function isValidStyleType(styleType) {
        /// <summary>
        /// Validates that the passed value is a valid StyleType value
        /// </summary>
        /// <param name="styleType" type="SunGard.Common.Html.StyleType" optional="false">Style type to evaluate.</param>
        /// <returns type="boolean">Returns true if the parameter is a member of the enumeration.</returns>

        switch (styleType) {
            case SunGard.Common.Html.StyleType.Default:
            case SunGard.Common.Html.StyleType.Branded:
            case SunGard.Common.Html.StyleType.Success:
            case SunGard.Common.Html.StyleType.Info:
            case SunGard.Common.Html.StyleType.Warning:
            case SunGard.Common.Html.StyleType.Danger:
                return true;

            default:
                return false;
        }
    }

    function isValidIconType(iconType) {
        /// <summary>
        /// Validates that the passed value is a valid StyleType value
        /// </summary>
        /// <param name="iconType" type="SunGard.Common.Html.IconType" optional="false">Icon type to evaluate.</param>
        /// <returns type="boolean">Returns true if the parameter is a member of the enumeration.</returns>

        if (iconType.IconName === undefined || iconType.IconName === null || Object.keys(SunGard.Common.Html.IconType).indexOf(iconType.IconName) < 0) {
            return false;
        } else {
            return true;
        }
    }

    function isValidIconSize(iconSize) {
        /// <summary>
        /// Validates that the passed value is a valid IconSize value
        /// </summary>
        /// <param name="iconSize" type="SunGard.Common.Html.IconSize" optional="false">Icon size to evaluate.</param>
        /// <returns type="boolean">Returns true if the parameter is a member of the enumeration.</returns>

        switch (iconSize) {
            case SunGard.Common.Html.IconSize.Medium:
            case SunGard.Common.Html.IconSize.Large:
                return true;

            default:
                return false;
        }
    }

    function isValidSelectDisplayFormat(displayFormat) {
        /// <summary>
        /// Validates that the passed value is a valid SelectDisplayFormat value
        /// </summary>
        /// <param name="displayFormat" type="SunGard.Common.Html.SelectDisplayFormat" optional="false">Display type to evaluate.</param>
        /// <returns type="boolean">Returns true if the parameter is a member of the enumeration.</returns>

        switch (displayFormat) {
            case SunGard.Common.Html.SelectDisplayFormat.Code:
            case SunGard.Common.Html.SelectDisplayFormat.Description:
            case SunGard.Common.Html.SelectDisplayFormat.CodeAndDescription:
                return true;

            default:
                return false;
        }
    }

    function isValidAutoSizeOption(size) {
        /// <summary>
        /// Validates that the passed value is a valid TextAreaAutoSizing value
        /// </summary>
        /// <param name="size" type="SunGard.Common.Html.TextAreaAutoSizing" optional="false">Textarea auto-size value to evaluate.</param>
        /// <returns type="boolean">Returns true if the parameter is a member of the enumeration.</returns>

        switch (size) {
            case SunGard.Common.Html.TextAreaAutoSizing.None:
            case SunGard.Common.Html.TextAreaAutoSizing.LargerOnly:
            // Leaving these options commented for future implementation.
            //case SunGard.Common.Html.TextAreaAutoSizing.SmallerOnly:
            //case SunGard.Common.Html.TextAreaAutoSizing.Any:
                return true;

            default:
                return false;
        }
    };

    function isValidHtmlDisplayType(displayType) {
        /// <summary>
        /// Validates that the passed value is a valid HtmlDisplayType value
        /// </summary>
        /// <param name="displayType" type="SunGard.Common.Html.HtmlDisplayType" optional="false">HTML display type to evaluate.</param>
        /// <returns type="boolean">Returns true if the parameter is a member of the enumeration.</returns>

        switch (displayType) {
            case SunGard.Common.Html.HtmlDisplayType.Block:
            case SunGard.Common.Html.HtmlDisplayType.Inline:
                return true;

            default:
                return false;
        }
    }

    function isValidAlertType(alertType) {
        /// <summary>
        /// Validates that the passed value is a valid AlertType value
        /// </summary>
        /// <param name="alertType" type="SunGard.Common.Html.AlertType" optional="false">Alert type to evaluate.</param>
        /// <returns type="boolean">Returns true if the parameter is a member of the enumeration.</returns>

        switch (alertType) {
            case SunGard.Common.Html.AlertType.None:
            case SunGard.Common.Html.AlertType.Success:
            case SunGard.Common.Html.AlertType.Warning:
            case SunGard.Common.Html.AlertType.Danger:
            case SunGard.Common.Html.AlertType.Information:
                return true;

            default:
                return false;
        }
    }

    function isValidDropdownSortOrder(sortOrder) {
        /// <summary>
        /// Validates that the passed value is a valid DropdownSortOder value
        /// </summary>
        /// <param name="sortOrder" type="SunGard.Common.Html.DropdownSortOrder" optional="false">Sort order to evaluate.</param>
        /// <returns></returns>

        switch (sortOrder) {
            case SunGard.Common.Html.DropdownSortOrder.UseDefault:
            case SunGard.Common.Html.DropdownSortOrder.Code:
            case SunGard.Common.Html.DropdownSortOrder.Description:
            case SunGard.Common.Html.DropdownSortOrder.None:
                return true;

            default:
                return false;
        }
    }

    function convertDataAttributes(htmlAttributes) {
        /// <summary>
        /// Convert the data attribute keys from camel case to "-" separated
        /// </summary>
        /// <param name="htmlAttributes">An htmlAttribute object</param>
        /// <returns type=""></returns>
        var attributes = {};
        if (htmlAttributes === null || htmlAttributes === undefined) {
            return attributes;
        }

        if ($.type(htmlAttributes) !== 'object') {
            throw 'The htmlAttributes argument must be an object.';
        }

        for (var current in htmlAttributes) {
            if (!current.match("^data-")) {
                attributes[current] = htmlAttributes[current];
                continue;
            }

            key = '';
            for (var i = 0; i < current.length; i++) {
                var c = current[i];
                key += c.match(/^[A-Z]$/) ? "-" + c.toLowerCase() : c;
            }

            attributes[key] = htmlAttributes[current];
        }

        return attributes;
    }

    function createGridCollectionName(collectionPropertyName, index, propertyName) {
        /// <summary>
        /// Converts a standard control name into a unique name for use in grids.
        /// </summary>
        /// <param name="collectionPropertyName" type="string">The base property name of the list.</param>
        /// <param name="index" type="number">The row index within the grid.</param>
        /// <param name="propertyName" type="string">The base property name of the field.</param>
        /// <returns type="string">Control name for a field formatted for use in a grid.</returns>

        var intIndex = parseInt(index);
        if (isNaN(intIndex) || intIndex < 0) {
            throw "createCollectionName(): The index parameter must be a positive integer";
        }

        var name;
        if (collectionPropertyName === undefined || collectionPropertyName === null || $.trim(collectionPropertyName) === '') {
            name = $.trim(propertyName) + "[" + index + "]";
        } else {
            name = $.trim(collectionPropertyName) + "[" + index + "]." + $.trim(propertyName);
        }

        return name;
    }

    function getDisabledName(name) {
        /// <summary>
        /// Alters the name of a control as appropriate if it's disabled.
        /// </summary>
        /// <param name="name" type="string">Base control name to convert to the disabled name</param>
        /// <returns type="string">Converted control name.</returns>

        if (name === undefined || name === null) {
            throw "getDisabledName(): The name parameter is required";
        }

        return $.trim(name) + "Disabled";
    }

    function createSanitizedId(originalId, invalidCharReplacement) {

        if (originalId === null || $.trim(originalId) === '') {
            return '';
        }

        invalidCharReplacement = invalidCharReplacement || '_';

        var firstChar = originalId[0];
        if (!isLetter(firstChar)) {
            return '';
        }

        var id = firstChar;
        for (var i = 1; i < originalId.length; i++) {
            var nextChar = originalId[i];
            if (isValidIdCharacter(nextChar)) {
                id += nextChar;
            } else {
                id += invalidCharReplacement;
            }
        }
        return id;
    }

    function isLetter(c) {
        return ('A' <= c && c <= 'Z') || ('a' <= c && c <= 'z');
    }

    function isDigit(c) {
        return '0' <= c && c <= '9';
    }

    function isAllowableSpecialCharacter(c) {
        return c == '-' || c == ':' || c == '_';
    }

    function isValidIdCharacter(c) {
        return isLetter(c) || isDigit(c) || isAllowableSpecialCharacter(c);
    }

    return {
        IsValidButtonType: isValidButtonType,
        IsValidOptionInputType: isValidOptionInputType,
        IsValidStyleType: isValidStyleType,
        IsValidIconType: isValidIconType,
        IsValidIconSize: isValidIconSize,
        IsValidSelectDisplayFormat: isValidSelectDisplayFormat,
        IsValidAutoSizeOption: isValidAutoSizeOption,
        IsValidHtmlDisplayType: isValidHtmlDisplayType,
        IsValidAlertType: isValidAlertType,
        IsValidDropdownSortOrder: isValidDropdownSortOrder,
        ConvertDataAttributes: convertDataAttributes,
        CreateGridCollectionName: createGridCollectionName,
        CreateSanitizedId: createSanitizedId,
        GetDisabledName: getDisabledName
    };

}();

SunGard.Common.Html.AlertExtensions = function () {
    function sunGardAlert(htmlAttributes, dismissable, alertType, displayType) {
        /// <summary>
        /// Returns an Alert container element.  If displayType is Inline, dismissable is false.
        /// </summary>
        /// <param name="htmlAttributes" type="object" optional="true">An object that contains the HTML attributes to set on the Alert element</param>
        /// <param name="dismissable" type="boolean" optional="true">If set to true the alert is dismissable (default is false).</param>
        /// <param name="alertType" type="SunGard.Common.Html.AlertType" optional="true">The type of alert to create (default is Danger).</param>
        /// <param name="displayType" type="SunGard.Common.Html.HtmlDisplayType" optional="true">The HTML display type to use (default is Block).</param>
        /// <returns type=""></returns>

        // Perform necessary validation
        htmlAttributes = htmlAttributes || {};

        if (alertType === null || alertType === undefined) {
            alertType = SunGard.Common.Html.AlertType.Danger;
        }

        if (displayType === null || displayType === undefined) {
            displayType = SunGard.Common.Html.HtmlDisplayType.Block;
        }

        if (dismissable === null || dismissable === undefined || dismissable !== true) {
            dismissable = false;
        }

        if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidAlertType(alertType)) {
            throw "The provided alertType is invalid";
        }

        if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidHtmlDisplayType(displayType)) {
            throw "The provided displayType is invalid";
        }

        // Determine what tag to use for creating the alert
        var alertTag = "div";
        if (displayType === SunGard.Common.Html.HtmlDisplayType.Inline) {
            alertTag = "span";
        }

        // Get the attributes that should be applied to the alert tag
        htmlAttributes = $.extend({}, htmlAttributes, { role: "alert" });

        // Build the alert tag wrapper
        var wrapperBuilder = SunGard.Common.Html.TagBuilder(alertTag)
            .MergeAttributes(htmlAttributes)
            .AddCssClass(alertType);

        // If the alert is supposed to be dismissable, add the dismiss "X".
        var dismissButton = "";
        if (dismissable) {
            var dismissButtonBuilder = SunGard.Common.Html.TagBuilder("button")
                .AddCssClass("close")
                .MergeAttributes({ "type": "button", "data-dismiss": "alert" });

            var dismisserTag = SunGard.Common.Html.TagBuilder("span")
                .MergeAttribute("aria-hidden", "true")
                .SetInnerHtml("&times;");

            var screenReaderTag = SunGard.Common.Html.TagBuilder("span")
                .AddCssClass("sr-only")
                .SetInnerText("Close");

            dismissButtonBuilder.SetInnerHtml(dismisserTag.ToString() + screenReaderTag.ToString());
            dismissButton = dismissButtonBuilder.ToString();
        }

        // Create a SPAN tag to put the message content so it can be easily
        // accessed via jQuery to update the text if necessary.
        var messageTagBuilder = SunGard.Common.Html.TagBuilder("span")
            .AddCssClass("sg-alert-content");

        // Add the dismiss button, if appropriate, and the message container to the contents
        // of the alert wrapper.
        wrapperBuilder.SetInnerHtml(dismissButton + messageTagBuilder.ToString());

        // Generate the alert tag and return it
        return wrapperBuilder.ToString();
    }

    return {
        SunGardAlert: sunGardAlert
    }
}();

SunGard.Common.Html.ButtonExtensions = function () {

    function sunGardButton(label, htmlAttributes, name, value, buttonType, styleType) {
        /// <summary>
        /// Returns an HTML button element.
        /// </summary>
        /// <param name="label" type="string">The text to display on the button</param>
        /// <param name="htmlAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the element</param>
        /// <param name="name" type="string" optional="true">The name of the form field and the ViewDataDictionary key that is used to look up the value</param>
        /// <param name="value" type="string" optional="true">The value of the input element</param>
        /// <param name="buttonType" type="SunGard.Common.Html.ButtonType" optional="true">Type of the button</param>
        /// <param name="styleType" type="SunGard.Common.Html.StyleType" optional="true">Style that should be used when rendering the button</param>
        /// <returns type="string">HTML string for a button element</returns>

        if (label === undefined) {
            throw "The label parameter is required";
        }

        if (buttonType === undefined) {
            buttonType = SunGard.Common.Html.ButtonType.Button;
        }

        if (styleType === undefined) {
            styleType = SunGard.Common.Html.StyleType.Branded;
        }

        if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidButtonType(buttonType)) {
            throw "The provided buttonType is invalid";
        }

        if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidStyleType(styleType)) {
            throw "The provided styleType is invalid";
        }

        htmlAttributes = htmlAttributes || {};

        var tagBuilder = SunGard.Common.Html.TagBuilder("button")
            .MergeAttributes($.extend({}, htmlAttributes, { type: buttonType, value: evaluateValue(value) }))
            .GenerateId(name)
            .SetInnerHtml(label)
            .AddCssClass("btn btn-" + styleType);

        return tagBuilder.ToString();
    }

    function sunGardLinkButton(label, htmlAttributes, name, url, styleType) {
        /// <summary>
        /// Returns an HTML button element.
        /// </summary>
        /// <param name="label" type="string">The text to display on the button</param>
        /// <param name="htmlAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the element</param>
        /// <param name="name" type="string" optional="true">The name of the form field and the ViewDataDictionary key that is used to look up the value</param>
        /// <param name="url" type="string" optional="true">The URL to navigate to when the link is clicked</param>
        /// <param name="styleType" type="SunGard.Common.Html.StyleType" optional="true">Style that should be used when rendering the button</param>
        /// <returns type="string">HTML string for a button element</returns>

        if (label === undefined) {
            throw "The label parameter is required";
        }

        if (styleType === undefined) {
            styleType = SunGard.Common.Html.StyleType.Branded;
        }

        if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidStyleType(styleType)) {
            throw "The provided styleType is invalid";
        }

        htmlAttributes = htmlAttributes || {};

        url = url || "#";

        var tagBuilder = SunGard.Common.Html.TagBuilder("a")
            .MergeAttributes($.extend({}, htmlAttributes, { role: "button", href: url }))
            .GenerateId(name)
            .SetInnerHtml(label)
            .AddCssClass("btn btn-" + styleType);

        return tagBuilder.ToString();
    }

    function sunGardLink(label, htmlAttributes, name) {
        /// <summary>
        /// Returns an HTML button element styled as a link
        /// </summary>
        /// <param name="label" type="string">The text to display on the button</param>
        /// <param name="htmlAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the element</param>
        /// <param name="name" type="string" optional="true">The name of the form field and the ViewDataDictionary key that is used to look up the value</param>
        /// <returns type="string">HTML string for a button element</returns>

        if (label === undefined)
            throw "The label parameter is required";

        htmlAttributes = htmlAttributes || {};

        var tagBuilder = SunGard.Common.Html.TagBuilder("button")
            .MergeAttributes($.extend({}, htmlAttributes))
            .GenerateId(name)
            .SetInnerText(label)
            .AddCssClass("btn btn-link");

        return tagBuilder.ToString();
    }

    function sunGardIconButton(iconType, name, iconAttributes, buttonAttributes, styleType, value, iconSize, buttonType) {
        /// <summary>
        /// Returns an HTML button element.
        /// </summary>
        /// <param name="iconType" type="SunGard.Common.Html.IconType">The icon to display on the button.</param>
        /// <param name="name" type="string" optional="true">The name of the form field and the ViewDataDictionary key that is used to look up the value</param>
        /// <param name="iconAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the icon</param>        
        /// <param name="buttonAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the button</param>        
        /// <param name="styleType" type="SunGard.Common.Html.StyleType" optional="true">Style that should be used when rendering the button</param>
        /// <param name="value" type="object" optional="true">The value of the input element</param>
        /// <param name="iconSize" type="SunGard.Common.Html.IconSize" optional="true">The size of the icon</param>
        /// <param name="buttonType" type="SunGard.Common.Html.ButtonType" optional="true">Type of the button</param>
        /// <returns type="string">HTML string for a button element</returns>

        if (iconType === null || iconType === undefined) {
            throw "The iconType parameter is required";
        } else if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidIconType(iconType)) {
            throw "The provided iconType is invalid";
        }

        if (styleType === null || styleType === undefined) {
            styleType = "";
        } else {
            if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidStyleType(styleType)) {
                throw "The provided styleType is invalid";
            }
            styleType = " btn-" + styleType;
        }

        if (buttonType === null || buttonType === undefined) {
            buttonType = SunGard.Common.Html.ButtonType.Button;
        } else if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidButtonType(buttonType)) {
            throw "The provided buttonType is invalid";
        }

        if (iconSize === null || iconSize === undefined) {
            iconSize = SunGard.Common.Html.IconSize.Medium;
        } else if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidIconSize) {
            throw "The provided iconSize is invalid";
        }

        iconAttributes = iconAttributes || {};
        buttonAttributes = buttonAttributes || {};

        var tagBuilder = SunGard.Common.Html.TagBuilder("button")
            .MergeAttributes($.extend({}, { title: SunGard.Common.GetResourceString(iconType.IconName + "OptionTooltip") }, buttonAttributes, { name: name, type: buttonType, value: evaluateValue(value) }))
            .GenerateId()
            .SetInnerHtml(SunGard.Common.Html.ImageExtensions.SunGardIcon(iconType, iconAttributes, iconSize))
            .AddCssClass("btn sg-btn-icon" + styleType);

        return tagBuilder.ToString();
    }

    function sunGardIconLinkButton(iconType, name, url, iconAttributes, buttonAttributes, iconSize, styleType) {
        /// <summary>
        /// Returns an HTML link element that is styled like an icon button.
        /// </summary>
        /// <param name="iconType" type="SunGard.Common.Html.IconType">The icon to display on the button.</param>
        /// <param name="name" type="string" optional="true">The name of the form field and the ViewDataDictionary key that is used to look up the value</param>
        /// <param name="url" type="string" optional="true">The URL to navigate to when the link is clicked</param>
        /// <param name="iconAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the icon</param>        
        /// <param name="buttonAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the button</param>        
        /// <param name="iconSize" type="SunGard.Common.Html.IconSize" optional="true">The size of the icon</param>
        /// <param name="styleType" type="SunGard.Common.Html.StyleType" optional="true">Style that should be used when rendering the button</param>
        /// <returns type=""></returns>

        if (iconType === null || iconType === undefined) {
            throw "The iconType parameter is required";
        } else if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidIconType(iconType)) {
            throw "The provided iconType is invalid";
        }

        if (styleType === null || styleType === undefined) {
            styleType = "";
        } else {
            if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidStyleType(styleType)) {
                throw "The provided styleType is invalid";
            }
            styleType = " btn-" + styleType;
        }

        if (iconSize === null || iconSize === undefined) {
            iconSize = SunGard.Common.Html.IconSize.Medium;
        } else if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidIconSize) {
            throw "The provided iconSize is invalid";
        }

        iconAttributes = iconAttributes || {};
        buttonAttributes = buttonAttributes || {};

        url = url || "#";

        var tagBuilder = SunGard.Common.Html.TagBuilder("a")
            .MergeAttributes($.extend({}, buttonAttributes, { name: name, role: "button", href: url, title: SunGard.Common.GetResourceString(iconType.IconName + "OptionTooltip") }))
            .GenerateId()
            .SetInnerHtml(SunGard.Common.Html.ImageExtensions.SunGardIcon(iconType, iconAttributes, iconSize))
            .AddCssClass("btn sg-btn-icon" + styleType);

        return tagBuilder.ToString();
    }

    function evaluateValue(value) { return (value == undefined || value == null) ? "" : value; }

    return {
        SunGardButton: sunGardButton,
        SunGardLinkButton: sunGardLinkButton,
        SunGardLink: sunGardLink,
        SunGardIconButton: sunGardIconButton,
        SunGardIconLinkButton: sunGardIconLinkButton
    };

}();

SunGard.Common.Html.ImageExtensions = function () {

    function sunGardIcon(iconType, htmlAttributes, iconSize) {
        /// <summary>
        /// Returns an HTML icon element.
        /// </summary>
        /// <param name="iconType" type="SunGard.Common.Html.IconType">The icon to display</param>
        /// <param name="htmlAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the icon</param>
        /// <param name="iconSize" type="SunGard.Common.Html.IconSize" optional="true">The size of the icon</param>
        /// <returns type=""></returns>

        if (iconType === undefined) {
            throw "The iconType parameter is required";
        } else if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidIconType(iconType)) {
            throw "The provided iconType is invalid";
        }

        var iconFontInformation = iconType;
        var tagBuilder;

        htmlAttributes = htmlAttributes || {};

        if (iconFontInformation.IconDetails.length === 1) {
            var iconDetail = iconFontInformation.IconDetails[0];
            tagBuilder = SunGard.Common.Html.TagBuilder("i")
                .MergeAttributes(htmlAttributes)
                .AddCssClass(iconDetail.FontClass)
                .AddCssClass("sg-icon");
        } else {
            var iconTags = "";

            $.each(iconFontInformation.IconDetails, function (index, value) {
                var iconTag = SunGard.Common.Html.TagBuilder("i")
                    .AddCssClass(value.FontClass)
                    .AddCssClass("sg-icon");
                iconTags += iconTag.ToString();
            });

            tagBuilder = SunGard.Common.Html.TagBuilder("span")
                .MergeAttributes(htmlAttributes)
                .AddCssClass("fa-stack")
                .SetInnerHtml(iconTags);
        }

        tagBuilder.AddCssClass(iconSize);

        return tagBuilder.ToString();
    }

    return {
        SunGardIcon: sunGardIcon
    }

}();

SunGard.Common.Html.InputExtensions = function () {

    function sunGardTextBox(name, value, htmlAttributes, userAccess, trackChanges) {
        /// <summary>
        /// Returns a text input element by using the name of the form field, the value, and the HTML attributes.
        /// </summary>
        /// <param name="name" type="string">The name of the form field and the ViewDataDictionary key that is used to look up the value.</param>
        /// <param name="value" type="object" optional="true">The value of the text input element.</param>
        /// <param name="htmlAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the element.</param>
        /// <param name="userAccess" type="SunGard.Common.UserAccessType" optional="true">An optional parameter used to decide what access a user has to a the control</param>
        /// <param name="trackChanges" type="boolean" optional="true">If set to true changes will be tracked and an "Unsaved Changes" message will be displayed.</param>
        /// <returns type="string">HTML string for a text input element</returns>

        if (name === undefined) {
            throw "The name parameter is required";
        }

        userAccess = userAccess || SunGard.Common.GetDefaultUserAccess();
        htmlAttributes = htmlAttributes || {};

        if (userAccess == SunGard.Common.UserAccessType.NoAccess) {
            return "";
        }

        if (trackChanges === null || trackChanges === undefined || trackChanges !== false) {
            trackChanges = true;
        }

        var tagBuilder = SunGard.Common.Html.TagBuilder("input")
            .MergeAttributes($.extend({ "data-val": true, "data-val-sgvalid": "", "data-sgvalid-isvalid": true }, htmlAttributes, { type: "text", name: name, value: evaluateValue(value) }))
            .GenerateId()
            .AddCssClass("form-control");

        if (trackChanges) {
            tagBuilder.AddCssClass("sg-track-changes");
        }

        if (userAccess == SunGard.Common.UserAccessType.ReadOnly) {
            tagBuilder.AddCssClass("sg-text-readonly");
            tagBuilder.MergeAttribute("autocomplete", "off");
        }

        return tagBuilder.ToString(SunGard.Common.Html.TagRenderMode.SelfClosing);
    }

    function sunGardHidden(name, value, htmlAttributes) {
        /// <summary>
        /// Returns a hidden input element by using the name of the form field, the value, and the HTML attributes.
        /// </summary>
        /// <param name="name" type="string">The name of the form field and the ViewDataDictionary key that is used to look up the value.</param>
        /// <param name="value" type="object" optional="true">The value of the text input element. If this value is null, the value of the element is retrieved from the ViewDataDictionary object. If no value exists there, the value is retrieved from the ModelStateDictionary object.</param>
        /// <param name="htmlAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the element.</param>
        /// <returns type="string">HTML string for a hidden input element</returns>

        if (name === undefined) {
            throw "The name parameter is required";
        }

        htmlAttributes = htmlAttributes || {};

        var tagBuilder = SunGard.Common.Html.TagBuilder("input")
            .MergeAttributes($.extend({}, htmlAttributes, { type: "hidden", name: name, value: evaluateValue(value) }))
            .GenerateId();

        return tagBuilder.ToString(SunGard.Common.Html.TagRenderMode.SelfClosing);
    }

    function sunGardCheckBox(name, isChecked, htmlAttributes, userAccess, label, optionInputType, styleType, trackChanges) {
        /// <summary>
        /// Returns a check box input element by using the name of the form field, a value to indicate whether the check box is selected, and the HTML attributes.
        /// </summary>
        /// <param name="name" type="string">The name of the form field.</param>
        /// <param name="isChecked" type="boolean" optional="true">true to select the check box; otherwise, false.</param>
        /// <param name="htmlAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the element.</param>
        /// <param name="userAccess" type="SunGard.Common.UserAccessType" optional="true">An optional parameter used to decide what access a user has to a the control</param>
        /// <param name="label" type="string" optional="true">Label that should display next to the checkbox</param>
        /// <param name="optionInputType" type="SunGard.Common.Html.OptionInputType" optional="true">Flag indicating how the input options will be displayed relative to the other options for this field</param>
        /// <param name="styleType" type="SunGard.Common.Html.StyleType" optional="true">Style that should be used when rendering the checkbox</param>
        /// <param name="trackChanges" type="boolean" optional="true">If set to true changes will be tracked and an "Unsaved Changes" message will be displayed.</param>
        /// <returns type="string">HTML string for a boolean input element</returns>

        if (name === undefined) {
            throw "The name parameter is required";
        }

        if (label === undefined) {
            label = "";
        }

        if (optionInputType === undefined) {
            optionInputType = SunGard.Common.Html.OptionInputType.Stacked;
        }

        if (styleType === undefined) {
            styleType = SunGard.Common.Html.StyleType.Branded;
        }

        if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidOptionInputType(optionInputType)) {
            throw "The provided optionInputType is invalid";
        }

        if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidStyleType(styleType)) {
            throw "The provided styleType is invalid";
        }

        if (isChecked === undefined) {
            isChecked = false;
        }

        userAccess = userAccess || SunGard.Common.GetDefaultUserAccess();
        htmlAttributes = htmlAttributes || {};

        if (userAccess == SunGard.Common.UserAccessType.NoAccess) {
            return "";
        }

        if (trackChanges === null || trackChanges === undefined || trackChanges !== false) {
            trackChanges = true;
        }

        var labelBuilder = SunGard.Common.Html.TagBuilder("label");

        if (optionInputType === SunGard.Common.Html.OptionInputType.Inline) {
            labelBuilder.AddCssClass("checkbox-inline");
        } else if (optionInputType === SunGard.Common.Html.OptionInputType.ButtonToggle || optionInputType === SunGard.Common.Html.OptionInputType.ButtonToggleAddon) {
            labelBuilder.AddCssClass("btn btn-" + styleType + (isChecked ? " active" : ""));
        }

        if (optionInputType === SunGard.Common.Html.OptionInputType.ButtonToggleAddon) {
            labelBuilder.AddCssClass('input-group-addon');
        }

        var checkboxName = name;
        if (userAccess == SunGard.Common.UserAccessType.ReadOnly) {
            checkboxName = SunGard.Common.Html.HtmlExtensionMethods.GetDisabledName(name);
        }

        var tagBuilder = SunGard.Common.Html.TagBuilder("input")
            .MergeAttributes($.extend({ "data-val": false }, { value: "true" }, htmlAttributes, { type: "checkbox", name: checkboxName }))
            .GenerateId();

        if (isChecked) {
            tagBuilder.MergeAttribute("checked", "checked");
        }

        var hiddenInput = "";
        if (!htmlAttributes["value"] || htmlAttributes["value"] === "true") {
            hiddenInput = sunGardHidden(name, "false", { "data-val": false });
        }

        if (userAccess == SunGard.Common.UserAccessType.ReadOnly) {
            tagBuilder.MergeAttribute("disabled", "disabled");
        }

        if (trackChanges) {
            tagBuilder.AddCssClass("sg-track-changes");
        }

        var checkboxHtml = labelBuilder.SetInnerHtml(tagBuilder.ToString(SunGard.Common.Html.TagRenderMode.SelfClosing) + label + hiddenInput)
            .ToString();

        if (optionInputType === SunGard.Common.Html.OptionInputType.Stacked) {
            var wrapperBuilder = SunGard.Common.Html.TagBuilder("div")
                .AddCssClass("checkbox")
                .SetInnerHtml(checkboxHtml);
            checkboxHtml = wrapperBuilder.ToString();
        }

        return checkboxHtml;
    }

    function sunGardRadioButton(name, value, isChecked, htmlAttributes, userAccess, label, optionInputType, styleType, trackChanges) {
        /// <summary>
        /// Returns a radio button input element that is used to present mutually exclusive options.
        /// </summary>
        /// <param name="name" type="string">The name of the form field and the ViewDataDictionary key that is used to look up the value.</param>
        /// <param name="value" type="object">If this radio button is selected, the value of the radio button that is submitted when the form is posted.</param>
        /// <param name="isChecked" type="boolean" optional="true">true to select the radio button; otherwise, false.</param>
        /// <param name="htmlAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the element.</param>
        /// <param name="userAccess" type="SunGard.Common.UserAccessType" optional="true">An optional parameter used to decide what access a user has to a the control</param>
        /// <param name="label" type="string" optional="true">Label that should display next to the checkbox</param>
        /// <param name="optionInputType" type="SunGard.Common.Html.OptionInputType" optional="true">Flag indicating how the input options will be displayed relative to the other options for this field</param>
        /// <param name="styleType" type="SunGard.Common.Html.StyleType" optional="true">Style that should be used when rendering the checkbox</param>
        /// <param name="trackChanges" type="boolean" optional="true">If set to true changes will be tracked and an "Unsaved Changes" message will be displayed.</param>
        /// <returns type="string">HTML string for a radio button input element</returns>

        if (name === undefined) {
            throw "The name parameter is required";
        }

        if (value === undefined) {
            throw "The value parameter is required";
        }

        if (label === undefined) {
            label = "";
        }

        if (optionInputType === undefined) {
            optionInputType = SunGard.Common.Html.OptionInputType.Stacked;
        }

        if (styleType === undefined) {
            styleType = SunGard.Common.Html.StyleType.Branded;
        }

        if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidOptionInputType(optionInputType)) {
            throw "The provided optionInputType is invalid";
        }

        if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidStyleType(styleType)) {
            throw "The provided styleType is invalid";
        }

        if (isChecked === undefined) {
            isChecked = false;
        }

        userAccess = userAccess || SunGard.Common.GetDefaultUserAccess();
        htmlAttributes = htmlAttributes || {};

        if (userAccess == SunGard.Common.UserAccessType.NoAccess) {
            return "";
        }

        if (trackChanges === null || trackChanges === undefined || trackChanges !== false) {
            trackChanges = true;
        }

        var labelBuilder = SunGard.Common.Html.TagBuilder("label");

        if (optionInputType === SunGard.Common.Html.OptionInputType.Inline) {
            labelBuilder.AddCssClass("radio-inline");
        } else if (optionInputType === SunGard.Common.Html.OptionInputType.ButtonToggle) {
            labelBuilder.AddCssClass("btn btn-" + styleType + (isChecked ? " active" : ""));
        }

        var radioButtonName = name;
        if (userAccess == SunGard.Common.UserAccessType.ReadOnly) {
            radioButtonName = name + "Disabled";
        }

        var tagBuilder = SunGard.Common.Html.TagBuilder("input")
            .MergeAttributes($.extend({ "data-val": true, "data-val-sgvalid": "", "data-sgvalid-isvalid": true }, htmlAttributes, { type: "radio", name: radioButtonName, value: evaluateValue(value) }))
            .GenerateId(radioButtonName + "-" + evaluateValue(value));

        var hiddenInput = "";
        if (isChecked) {
            tagBuilder.MergeAttribute("checked", "checked");
            if (userAccess === SunGard.Common.UserAccessType.ReadOnly) {
                hiddenInput = sunGardHidden(name, value);
            }
        }

        if (userAccess == SunGard.Common.UserAccessType.ReadOnly) {
            tagBuilder.MergeAttribute("disabled", "disabled");
        }

        if (trackChanges) {
            tagBuilder.AddCssClass("sg-track-changes");
        }

        var radioButtonHtml = labelBuilder.SetInnerHtml(tagBuilder.ToString(SunGard.Common.Html.TagRenderMode.SelfClosing) + label + hiddenInput)
            .ToString();

        if (optionInputType === SunGard.Common.Html.OptionInputType.Stacked) {
            var wrapperBuilder = SunGard.Common.Html.TagBuilder("div")
                .AddCssClass("radio")
                .SetInnerHtml(radioButtonHtml);
            radioButtonHtml = wrapperBuilder.ToString();
        }

        return radioButtonHtml;
    }

    function sunGardDatepicker(name, value, htmlAttributes, userAccess, showCalendarIcon, trackChanges) {
        /// <summary>
        /// Returns a datepicker element by using the name of the form field, the value, and the HTML attributes.
        /// </summary>
        /// <param name="name">The name of the form field and the ViewDataDictionary key that is used to look up the value.</param>
        /// <param name="value">The value of the text input element.</param>
        /// <param name="htmlAttributes">An object that contains the HTML attributes to set for the element.</param>
        /// <param name="userAccess">An optional parameter used to decide what access a user has to a the control</param>
        /// <param name="showCalendarIcon">True to activate the datepicker by clicking a calendar icon, false to activate when field is focused</param>
        /// <param name="trackChanges" type="boolean" optional="true">If set to true changes will be tracked and an "Unsaved Changes" message will be displayed.</param>
        /// <returns></returns>

        if (name === undefined) {
            throw "The name parameter is required";
        }

        userAccess = userAccess || SunGard.Common.GetDefaultUserAccess();
        //htmlAttributes = htmlAttributes || {};
        htmlAttributes = SunGard.Common.Html.HtmlExtensionMethods.ConvertDataAttributes(htmlAttributes);

        if (userAccess == SunGard.Common.UserAccessType.NoAccess) {
            return '';
        }

        if (trackChanges === null || trackChanges === undefined || trackChanges !== false) {
            trackChanges = true;
        }

        if (userAccess === SunGard.Common.UserAccessType.ReadOnly) {
            return sunGardTextBox(name, value, htmlAttributes, userAccess, trackChanges);
        }

        if (showCalendarIcon === null || showCalendarIcon === undefined || showCalendarIcon !== false) {
            showCalendarIcon = true;
        }

        var autoCloseAttribute = {
            "data-autoclose": true
        };
        if (htmlAttributes.hasOwnProperty("data-multidate") && (htmlAttributes["data-multidate"] === "true" || htmlAttributes["data-multidate"] === true)) {
            autoCloseAttribute = {};
        }

        var defaultAttributes = $.extend(
            autoCloseAttribute,
            {
                "data-today-highlight": true,
                "data-force-parse": false
            });

        htmlAttributes["class"] = $.trim("sg-datepicker-input " + $.trim(htmlAttributes["class"]));

        if (!showCalendarIcon) {
            htmlAttributes["class"] += " sg-datepicker-init";

            htmlAttributes = $.extend(defaultAttributes, htmlAttributes);

            return sunGardTextBox(name, value, htmlAttributes, userAccess, trackChanges);
        }

        var datePickerAttributes = {};
        for (var attribute in htmlAttributes) {
            if (attribute.match("^data-") && !attribute.match("^data-val")) {
                datePickerAttributes[attribute] = htmlAttributes[attribute];
            }
        }

        var tagBuilder = SunGard.Common.Html.TagBuilder('div')
            .AddCssClass("input-group date")
            .AddCssClass("sg-datepicker-init")
            .MergeAttributes(datePickerAttributes)
            .MergeAttributes(defaultAttributes);

        var groupAddOn = new SunGard.Common.Html.TagBuilder('span')
            .AddCssClass("input-group-addon");

        var icon = new SunGard.Common.Html.TagBuilder('i')
            .AddCssClass("fa fa-calendar sg-icon sg-icon-md");

        groupAddOn.SetInnerHtml(icon.ToString());

        tagBuilder.SetInnerHtml(sunGardTextBox(name, value, htmlAttributes, userAccess, trackChanges) + groupAddOn.ToString());

        return tagBuilder.ToString();
    }

    function sunGardTimepicker(name, value, htmlAttributes, userAccess, useSeconds, trackChanges) {
        /// <summary>
        /// Returns a timepicker element by using the name of the form field, the value, and the HTML attributes.
        /// </summary>
        /// <param name="name" type="string">The name of the form field and the ViewDataDictionary key that is used to look up the value.</param>
        /// <param name="value" type="object" optional="true">The value of the timepicker input element. If not empty, must be in the following format: mm:hh AM/PM.</param>
        /// <param name="htmlAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the element.</param>
        /// <param name="userAccess" type="SunGard.Common.UserAccessType" optional="true">An optional parameter used to decide what access a user has to a the control</param>
        /// <param name="useSeconds">True to include seconds in the picker, false otherwise</param>
        /// <param name="trackChanges" type="boolean" optional="true">If set to true changes will be tracked and an "Unsaved Changes" message will be displayed.</param>
        /// <returns type="string">HTML string for a text input element</returns>

        if (name === undefined) {
            throw "The name parameter is required";
        }

        userAccess = userAccess || SunGard.Common.GetDefaultUserAccess();
        htmlAttributes = SunGard.Common.Html.HtmlExtensionMethods.ConvertDataAttributes(htmlAttributes);

        if (userAccess == SunGard.Common.UserAccessType.NoAccess) {
            return '';
        }

        if (trackChanges === null || trackChanges === undefined || trackChanges !== false) {
            trackChanges = true;
        }

        var formatMask = "hh:mm A";
        if (useSeconds) {
            formatMask = "hh:mm:ss A";
        }

        var inputBuilder = SunGard.Common.Html.TagBuilder('input')
            .MergeAttributes($.extend({ "data-val": true, "data-val-sgvalid": "", "data-sgvalid-isvalid": true }, htmlAttributes, { type: 'text', name: name, value: SunGard.Common.FormatTime(value, formatMask) }))
            .AddCssClass("form-control")
            .GenerateId();

        if (trackChanges) {
            inputBuilder.AddCssClass("sg-track-changes");
        }

        if (userAccess == SunGard.Common.UserAccessType.ReadOnly) {
            inputBuilder.MergeAttribute("autocomplete", "off");
            inputBuilder.AddCssClass('sg-text-readonly');
            return inputBuilder.ToString(SunGard.Common.Html.TagRenderMode.SelfClosing);
        }

        var defaultAttributes = { 'data-pick-date': 'false' };

        inputBuilder.AddCssClass("sg-timepicker-input");

        var tagBuilder = SunGard.Common.Html.TagBuilder('div')
            .AddCssClass("input-group date")
            .AddCssClass("sg-timepicker-init");

        //Copy the data- attributes to another container.
        var datePickerAttributes = {};
        for (var current in htmlAttributes) {
            if (current.match("^data-") && !current.match("^data-val")) {
                datePickerAttributes[current] = htmlAttributes[current];
                continue;
            }
        }

        tagBuilder.MergeAttributes(datePickerAttributes, false);
        tagBuilder.MergeAttributes(defaultAttributes, false);
        if (useSeconds) {
            tagBuilder.MergeAttribute('data-use-seconds', true, false);
        }
        tagBuilder.MergeAttribute("data-date-format", formatMask, false);

        var groupAddOn = new SunGard.Common.Html.TagBuilder('span')
            .AddCssClass("input-group-addon");

        var icon = new SunGard.Common.Html.TagBuilder('i')
            .AddCssClass("glyphicon glyphicon-time");

        groupAddOn.SetInnerHtml(icon.ToString());

        tagBuilder.SetInnerHtml(inputBuilder.ToString(SunGard.Common.Html.TagRenderMode.SelfClosing) + groupAddOn.ToString());
        return tagBuilder.ToString();
    }

    function sunGardAdvancedSearch(name, inputMethod, outputMethod, searchType, htmlAttributes, userAccess, value, trackChanges) {
        /// <summary>
        /// Returns an advanced search text input element by using the name of the form field, the value, and the HTML attributes.
        /// </summary>
        /// <param name="name" type="string">The name of the form field and the ViewDataDictionary key that is used to look up the value.</param>
        /// <param name="inputMethod" type="string">The name of the method that the widget will call to retrieve the advanced search inputs.</param>
        /// <param name="outputMethod" type="string">The name of the method that the widget will call to send back the output of the advanced search.</param>
        /// <param name="searchType" type="string">The type of search to execute and display in the dialog if necessary.</param>
        /// <param name="htmlAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the element.</param>
        /// <param name="userAccess" type="SunGard.Common.UserAccessType" optional="true">An optional parameter used to decide what access a user has to a the control</param>
        /// <param name="value" type="object" optional="true">The value of the text input element.</param>
        /// <param name="trackChanges" type="boolean" optional="true">If set to true changes will be tracked and an "Unsaved Changes" message will be displayed.</param>
        /// <returns type="string">HTML string for an advanced search text input element</returns>

        userAccess = userAccess || SunGard.Common.GetDefaultUserAccess();
        htmlAttributes = htmlAttributes || {};

        if (userAccess == SunGard.Common.UserAccessType.NoAccess) {
            return "";
        }

        var textBox = sunGardTextBox(name, value, htmlAttributes, userAccess, trackChanges);

        var returnHtml = textBox;

        if (userAccess === SunGard.Common.UserAccessType.ReadWrite) {
            var tagBuilder = SunGard.Common.Html.TagBuilder('div')
                .MergeAttributes(htmlAttributes)
                .AddCssClass("input-group sg-advanced-search-input")
                .MergeAttribute("data-input-method", inputMethod, true)
                .MergeAttribute("data-output-method", outputMethod, true)
                .MergeAttribute("data-search-type", searchType, true);

            var groupAddOn = new SunGard.Common.Html.TagBuilder('span')
                .AddCssClass("input-group-addon");

            var icon = new SunGard.Common.Html.TagBuilder('i')
                .AddCssClass("glyphicon glyphicon-search");

            groupAddOn.SetInnerHtml(icon.ToString());

            tagBuilder.SetInnerHtml(textBox + groupAddOn.ToString());

            returnHtml = tagBuilder.ToString();
        }

        return returnHtml;
    }

    function sunGardColorpicker(name, value, htmlAttributes, userAccess, trackChanges, hideTextInput) {
        /// <summary>
        /// Returns an advanced search text input element by using the name of the form field, the value, and the HTML attributes.
        /// </summary>
        /// <param name="name" type="string">The name of the form field and the ViewDataDictionary key that is used to look up the value.</param>
        /// <param name="value" type="object" optional="true">The value of the text input element.</param>
        /// <param name="htmlAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the element.</param>
        /// <param name="userAccess" type="SunGard.Common.UserAccessType" optional="true">An optional parameter used to decide what access a user has to a the control</param>
        /// <param name="trackChanges" type="boolean" optional="true">If set to true changes will be tracked and an "Unsaved Changes" message will be displayed.</param>
        /// <param name="hideTextInput" type="boolean" optional="true">If set to true the text input portion of the control will not be displayed.  Default is false.</param>
        /// <returns type="string">HTML string for an advanced search text input element</returns>

        if (name === undefined) {
            throw "The name parameter is required";
        }

        userAccess = userAccess || SunGard.Common.GetDefaultUserAccess();
        htmlAttributes = htmlAttributes || {};

        if (userAccess == SunGard.Common.UserAccessType.NoAccess) {
            return "";
        }

        if (trackChanges === null || trackChanges === undefined || trackChanges !== false) {
            trackChanges = true;
        }

        if (hideTextInput === null || hideTextInput === undefined || hideTextInput !== true) {
            hideTextInput = false;
        }

        hideButtonReadOnly = !hideTextInput;

        var textBoxName = name;
        if (userAccess === SunGard.Common.UserAccessType.ReadWrite) {
            textBoxName += "-tb";
        }

        var textboxAttributes = $.extend({}, htmlAttributes);
        if (hideTextInput) {
            if (textboxAttributes.hasOwnProperty("class")) {
                textboxAttributes["class"] += " hidden";
            } else {
                textboxAttributes["class"] = "hidden";
            }
        }

        var textBox = sunGardTextBox(textBoxName, value, textboxAttributes, userAccess, trackChanges);

        var replacerClassName = "input-group-addon";
        if (userAccess === SunGard.Common.UserAccessType.ReadOnly && !hideTextInput && hideButtonReadOnly) {
            return textBox;
        }

        var div = SunGard.Common.Html.TagBuilder('div')
            .AddCssClass('sg-color-picker sg-color-picker-init')
            .MergeAttribute('id', name);

        if (!hideTextInput) {
            div.AddCssClass("input-group");
        } else {
            replacerClassName = "";
        }

        var pickerAttributes = $.extend({},
            {
                "type": "hidden",
                "data-show-buttons": false,
                "data-clickout-fires-change": true,
                "data-preferred-format": "hex",
                "data-replacer-class-name": replacerClassName,
                "data-show-palette-only": true,
                "data-toggle-palette-only": true
            }, htmlAttributes,
            {
                "id": name + "-cp",
                "name": name
            });
        if (userAccess === SunGard.Common.UserAccessType.ReadOnly) {
            pickerAttributes["disabled"] = true;
        }

        var colorPicker = SunGard.Common.Html.TagBuilder('input')
            .MergeAttributes(pickerAttributes);

        div.SetInnerHtml(textBox + colorPicker.ToString());

        return div.ToString();
    }

    function evaluateValue(value) { return (value == undefined || value == null) ? "" : value; }

    return {
        SunGardTextBox: sunGardTextBox,
        SunGardHidden: sunGardHidden,
        SunGardCheckBox: sunGardCheckBox,
        SunGardRadioButton: sunGardRadioButton,
        SunGardDatepicker: sunGardDatepicker,
        SunGardTimepicker: sunGardTimepicker,
        SunGardAdvancedSearch: sunGardAdvancedSearch,
        SunGardColorpicker: sunGardColorpicker
    };
}();

SunGard.Common.Html.LabelExtensions = function () {

    function sunGardLabel(expression, htmlAttributes, userAccess, labelText, isRequired, url) {
        /// <summary>
        /// Returns an HTML label element.
        /// </summary>
        /// <param name="expression" type="string">An expression that identifies the element the label is for.</param>
        /// <param name="htmlAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the element</param>
        /// <param name="userAccess" type="SunGard.Common.UserAccessType" optional="true">Indicates an security override to the page level security</param>
        /// <param name="labelText" type="string" optional="true">The label text to display</param>
        /// <param name="isRequired" type="boolean" optional="true">Indicates if the field is required for input</param>
        /// <param name="url" type="string" optional="true">The URL to navigate to when clicking the label</param>
        /// <returns type="string">HTML string for a label element</returns>

        if (labelText === undefined) {
            return "";
        }

        userAccess = userAccess || SunGard.Common.GetDefaultUserAccess();
        htmlAttributes = htmlAttributes || {};

        if (userAccess === SunGard.Common.UserAccessType.NoAccess) {
            return "";
        }

        if (expression === undefined) {
            throw "The expression parameter is required";
        }

        if (isRequired === null || isRequired === undefined || isRequired !== true) {
            isRequired = false;
        }

        var labelInnerHtml = labelText;
        if (url !== null && url !== undefined && $.trim(url) !== "") {
            var aName = expression + "-link";
            var aBuilder = SunGard.Common.Html.TagBuilder("a")
                .AddCssClass("sg-label-link")
                .MergeAttribute("href", url)
                .MergeAttribute("name", aName)
                .GenerateId()
                .SetInnerHtml(labelInnerHtml);
            labelInnerHtml = aBuilder.ToString();
        }

        var tagBuilder = SunGard.Common.Html.TagBuilder("label")
            .MergeAttributes($.extend({}, htmlAttributes, { "for": expression }))
            .SetInnerHtml(labelInnerHtml)
            .AddCssClass("control-label")
            .GenerateId();

        if (isRequired && userAccess === SunGard.Common.UserAccessType.ReadWrite) {
            tagBuilder.AddCssClass("sg-required-field");
        }

        return tagBuilder.ToString();
    }

    function sunGardRequiredIndicator() {
        if (SunGard.Common.ConsoleLog !== null && SunGard.Common.ConsoleLog !== undefined) {
            SunGard.Common.ConsoleLog("SunGard.Common.Html.LabelExtensions.SunGardRequiredIndicate has been deprecated.  Use SunGard.Common.Html.LabelExtensions.SunGardDisplayAsRequired instead.");
        }

        return " " + SunGard.Common.Html.TagBuilder("span")
            .AddCssClass("sg-required-indicator")
            .SetInnerText("*")
            .ToString();
    }

    function sunGardDisplayAsRequired(labelText) {
        /// <summary>
        /// Provided label text will be enclosed in a SPAN tag and will have the text flagged as required.
        /// </summary>
        /// <param name="labelText" type="string">Label text to flag as required</param>

        return SunGard.Common.Html.TagBuilder("span")
            .AddCssClass("sg-required-field")
            .SetInnerHtml(labelText)
            .ToString();
    }

    return {
        SunGardLabel: sunGardLabel,
        SunGardRequiredIndicator: sunGardRequiredIndicator,
        SunGardDisplayAsRequired: sunGardDisplayAsRequired
    };

}();

SunGard.Common.Html.SelectExtensions = function () {

    function sunGardDropDownList(name, selectList, htmlAttributes, userAccess, displayFormat, trackChanges, sortOrder) {
        /// <summary>Returns a single-selection select element using the name of the form field.</summary>
        /// <param name="name" type="String">The name of the form field to return.</param>
        /// <param name="selectList">The object used to populate the drop-down list. This argument can be passed in one of two ways: 
        /// (1) an array of objects with properties 'text' and 'value'
        ///   For example, [{ text: 'First Option', value: '1' }, { text: 'Second Option', value: '2', selected: 'selected' }]
        /// You can also pass optional grouping properties to create groups within your select options:
        ///   For example, [{ text: 'First Option', groupId: 'group1', groupLabel: 'Group 1', value: '1' }, { text: 'Second Option', value: '2', , groupId: 'group2', groupLabel: 'Group 2', selected: 'selected' }]
        /// (2) an object in the following format { options: [array of objects], textName: 'the name of the text property in the object', valueName: 'the name of the value property', selectedValue: 'the default selection' }
        ///   For example, { options: [{ desc: 'First Option', id: '1' }, { desc: 'Second Option', id: '2' }], textName: 'desc', valueName: 'id', selectedValue: '2' }
        /// You can also pass optional grouping properties to create groups within your select options:
        ///   For example, { options: [{ desc: 'First Option', id: '1', gId: 'group1', gLabel: 'Group 1' }, { desc: 'Second Option', id: '2', gId: 'group1', gLabel: 'Group 1' }], textName: 'desc', valueName: 'id', groupIdName: 'gId', groupLabelName: 'gLabel', selectedValue: '2' }
        /// </param>
        /// <param name="htmlAttributes">An object that contains the HTML attributes to set for the element.</param>
        /// <param name="userAccess">An optional parameter used to decide what access a user has to a the control</param>
        /// <param name="displayFormat">An enumerated type "SunGard.Common.Html.SelectDisplayFormat" used to indicate how to format the display value of the options in the list</param>
        /// <param name="trackChanges" type="boolean" optional="true">If set to true changes will be tracked and an "Unsaved Changes" message will be displayed.</param>
        /// <param name="sortOrder" type="SunGard.Common.Html.DropdownSortOrder" optional="true">Flag indicating how the options should be sorted.</param>
        /// <returns type="String">The HTML string</returns>

        if (name === undefined) {
            throw "The name parameter is required";
        }

        userAccess = userAccess || SunGard.Common.GetDefaultUserAccess();
        htmlAttributes = SunGard.Common.Html.HtmlExtensionMethods.ConvertDataAttributes(htmlAttributes);

        if (userAccess == SunGard.Common.UserAccessType.NoAccess) {
            return '';
        }

        if (trackChanges === null || trackChanges === undefined || trackChanges !== false) {
            trackChanges = true;
        }

        var options = '';

        if (selectList !== null && $.isPlainObject(selectList)) {
            var invalidSelectionsFound = addInvalidSelectionValuesAttribute(selectList.selectedValue, selectList.options, selectList.valueName, selectList.textName, htmlAttributes);
            options = createOptions(selectList.options, selectList.textName, selectList.valueName, selectList.disabledName, selectList.groupIdName, selectList.groupLabelName, selectList.selectedValue, selectList.callback);
        } else if (selectList !== null && $.isArray(selectList)) {
            options = createOptions(selectList);
        }

        var tagBuilder = SunGard.Common.Html.TagBuilder('select')
            .MergeAttributes($.extend({ "data-val": true, "data-val-sgvalid": "", "data-sgvalid-isvalid": true, "data-dropdown-Auto-Width": true }, htmlAttributes, { name: name }))
            .MergeAttributes(formatOptions(displayFormat, sortOrder), false)
            .MergeAttributes(addDataProcessingAttributes(false), false)
            .AddCssClass('sg-select-box-init')
            .AddCssClass("select2-offscreen")
            .AddCssClass("form-control")
            .GenerateId();

        if (trackChanges) {
            tagBuilder.AddCssClass("sg-track-changes");
        }

        if (invalidSelectionsFound) {
            tagBuilder.AddCssClass("sg-show-invalid-value-error");
        }

        tagBuilder.SetInnerHtml(options);

        if (userAccess == SunGard.Common.UserAccessType.ReadOnly) {
            tagBuilder.AddCssClass('sg-select-box-init-disabled');
        }

        return tagBuilder.ToString();
    }

    function sunGardListBox(name, selectList, htmlAttributes, userAccess, displayFormat, trackChanges, showSelectAll, selectAllId, sortOrder) {
        /// <summary>Returns a  multi-select select element using the name of the form field.</summary>
        /// <param name="name" type="String">The name of the form field to return.</param>
        /// <param name="selectList">The object used to populate the drop-down list. This argument can be passed in one of two ways: 
        /// (1) an array of objects with properties 'text' and 'value'
        ///   For example, [{ text: 'First Option', value: '1' }, { text: 'Second Option', value: '2', selected: 'selected' }]
        /// You can also pass optional grouping properties to create groups within your select options:
        ///   For example, [{ text: 'First Option', groupId: 'group1', groupLabel: 'Group 1', value: '1' }, { text: 'Second Option', value: '2', , groupId: 'group2', groupLabel: 'Group 2', selected: 'selected' }]
        /// (2) an object in the following format { options: [array of objects], textName: 'the name of the text property in the object', valueName: 'the name of the value property', selectedValue: 'the default selection' }
        ///   For example, { options: [{ desc: 'First Option', id: '1' }, { desc: 'Second Option', id: '2' }], textName: 'desc', valueName: 'id', selectedValues: ['1', '2'] }
        /// You can also pass optional grouping properties to create groups within your select options:
        ///   For example, { options: [{ desc: 'First Option', id: '1', gId: 'group1', gLabel: 'Group 1' }, { desc: 'Second Option', id: '2', gId: 'group1', gLabel: 'Group 1' }], textName: 'desc', valueName: 'id', groupIdName: 'gId', groupLabelName: 'gLabel', selectedValues: ['2'] }
        /// </param>
        /// <param name="htmlAttributes">An object that contains the HTML attributes to set for the element.</param>
        /// <param name="userAccess">An optional parameter used to decide what access a user has to a the control</param>
        /// <param name="displayFormat">An enumerated type "SunGard.Common.Html.SelectDisplayFormat" used to indicate how to format the display value of the options in the list</param>
        /// <param name="trackChanges" type="boolean" optional="true">If set to true changes will be tracked and an "Unsaved Changes" message will be displayed.</param>
        /// <param name="showSelectAll" type="boolean" optional="true">If set to true show select all.</param>
        /// <param name="selectAllId" type="string" optional="true">The select all button identifier.</param>
        /// <param name="sortOrder" type="SunGard.Common.Html.DropdownSortOrder" optional="true">Flag indicating how the options should be sorted.</param>
        /// <returns type="String">The HTML string</returns>

        var transformedOptions = {};
        if (selectList !== null && $.isPlainObject(selectList)) {
            transformedOptions = transformOptions(selectList.options, selectList.textName, selectList.valueName, selectList.disabledName, selectList.groupIdName, selectList.groupLabelName, selectList.selectedValues);
        } else {
            transformedOptions = transformOptions(selectList);
        }

        if (!transformedOptions.hasOwnProperty("options") || !transformedOptions.hasOwnProperty("selectedValues")) {
            throw "Provided selectList could not be transformed into an options array";
        }

        var attributes = $.extend({},
            {
                "data-select-list-options": JSON.stringify(transformedOptions.options),
                "data-data": "SunGard.Bootstrap.DropDownList.GetSelectListOptions"
            }, htmlAttributes);
        return sunGardDataListBox(name, attributes, userAccess, transformedOptions.selectedValues, displayFormat, undefined, undefined, showSelectAll, trackChanges, selectAllId, sortOrder);
    }

    function sunGardDataList(name, value, htmlAttributes, userAccess, displayFormat, idProperty, textProperty, trackChanges, sortOrder, initOnFocus) {
        /// <summary>Returns a select box element using the name of the form field.</summary>
        /// <param name="name" type="string">The name of the form field to return.</param>
        /// <param name="htmlAttributes" type="object">An object that contains the HTML attributes to set for the element.</param>
        /// <param name="userAccess" type="SunGard.Common.UserAccessType">An optional parameter used to decide what access a user has to a the control</param>
        /// <param name="displayFormat" type="SunGard.Common.Html.SelectDisplayFormat">How the options and selected value should be displayed.</param>
        /// <param name="idProperty" type="string">The property on each item object that refers to the id/code.</param>
        /// <param name="textProperty" type="string">The property on each item object that refers to the text/description.</param>
        /// <param name="trackChanges" type="boolean" optional="true">If set to true changes will be tracked and an "Unsaved Changes" message will be displayed.</param>
        /// <param name="sortOrder" type="SunGard.Common.Html.DropdownSortOrder" optional="true">Flag indicating how the options should be sorted.</param>
        /// <param name="initOnFocus" type="boolean" optional="true">Flag indicating if the control should wait to be initialized as a dropdown until the control receives focus.</param>
        /// <returns type="string">The HTML string</returns>

        if (name === undefined) {
            throw "The name parameter is required";
        }

        if (initOnFocus === null || initOnFocus === undefined || initOnFocus !== true) {
            initOnFocus = false;
        }

        userAccess = userAccess || SunGard.Common.GetDefaultUserAccess();
        htmlAttributes = SunGard.Common.Html.HtmlExtensionMethods.ConvertDataAttributes(htmlAttributes);

        if (userAccess == SunGard.Common.UserAccessType.NoAccess) {
            return '';
        }

        if (trackChanges === null || trackChanges === undefined || trackChanges !== false) {
            trackChanges = true;
        }

        if (htmlAttributes["class"]) {
            htmlAttributes["class"] += " sg-select-box-init";
        } else {
            htmlAttributes["class"] = "sg-select-box-init";
        }

        if (initOnFocus) {
            htmlAttributes["class"] += " sg-select-init-on-focus";
            if (!htmlAttributes.hasOwnProperty("data-format-selection") && !htmlAttributes.hasOwnProperty("data-formatSelection")) {
                htmlAttributes["data-format-selection"] = "SunGard.Bootstrap.DropDownList.FormatCode";
            }
        } else {
            htmlAttributes["class"] += " select2-offscreen";
        }

        if (userAccess == SunGard.Common.UserAccessType.ReadOnly) {
            htmlAttributes["class"] += " sg-select-box-init-disabled";
        }

        if (htmlAttributes.hasOwnProperty("data-sg-clone-data") && !htmlAttributes.hasOwnProperty("data-sg-always-add-invalid-values")) {
            htmlAttributes["data-sg-always-add-invalid-values"] = htmlAttributes["data-sg-clone-data"];
        }

        var attributes = $.extend(
            {
                "data-val": true,
                "data-val-sgvalid": "",
                "data-sgvalid-isvalid": true,
                "data-dropdown-Auto-Width": true
            },
            formatOptions(displayFormat, sortOrder, idProperty, textProperty),
            addDataProcessingAttributes(true),
            htmlAttributes);

        return SunGard.Common.Html.InputExtensions.SunGardTextBox(name, value, attributes, userAccess, trackChanges);
    }

    function sunGardDataListBox(name, htmlAttributes, userAccess, selectedValues, displayFormat, idProperty, textProperty, showSelectAll, trackChanges, selectAllId, sortOrder) {
        /// <summary>
        /// Returns a multi-select select element using the name of the form field.
        /// </summary>
        /// <param name="name" type="string">The name of the form field to return.</param>
        /// <param name="htmlAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the element.</param>
        /// <param name="userAccess" type="SunGard.Common.UserAccessType" optional="true">An optional parameter used to decide what access a user has to a the control</param>
        /// <param name="selectedValues" type="string|string[]" optional="true">The currently selected values as a comma-delimited string or an array of strings.</param>
        /// <param name="displayFormat" type="SunGard.Common.Html.SelectDisplayFormat" optional="true">How the options and selected value should be displayed.</param>
        /// <param name="idProperty" type="string" optional="true">The property on each item object that refers to the id/code.</param>
        /// <param name="textProperty" type="string" optional="true">The property on each item object that refers to the text/description.</param>
        /// <param name="showSelectAll" type="boolean" optional="true">If set to true show "Select All" button.</param>
        /// <param name="trackChanges" type="boolean" optional="true">If set to true changes will be tracked and an "Unsaved Changes" message will be displayed.</param>
        /// <param name="selectAllId" type="string" optional="true">The select all button identifier.</param>
        /// <param name="sortOrder" type="SunGard.Common.Html.DropdownSortOrder" optional="true">Flag indicating how the options should be sorted.</param>
        /// <returns type="string">The HTML string</returns>

        if (name === undefined || name === null) {
            throw "The name parameter is required";
        }

        userAccess = userAccess || SunGard.Common.GetDefaultUserAccess();
        htmlAttributes = SunGard.Common.Html.HtmlExtensionMethods.ConvertDataAttributes(htmlAttributes);

        if (userAccess === SunGard.Common.UserAccessType.NoAccess) {
            return "";
        }

        if (trackChanges === null || trackChanges === undefined || trackChanges !== false) {
            trackChanges = true;
        }

        if (htmlAttributes["class"]) {
            htmlAttributes["class"] += " sg-select-box-init";
        } else {
            htmlAttributes["class"] = "sg-select-box-init";
        }

        htmlAttributes["class"] += " select2-offscreen";

        if (userAccess == SunGard.Common.UserAccessType.ReadOnly) {
            htmlAttributes["class"] += " sg-select-box-init-disabled";
        }

        if (htmlAttributes.hasOwnProperty("data-sg-clone-data") && !htmlAttributes.hasOwnProperty("data-sg-always-add-invalid-values")) {
            htmlAttributes["data-sg-always-add-invalid-values"] = htmlAttributes["data-sg-clone-data"];
        }

        var attributes = $.extend(
            {
                "data-val": true,
                "data-val-sgvalid": "",
                "data-sgvalid-isvalid": true,
                "data-dropdown-Auto-Width": true,
                "data-maximum-selection-size": 0,
                "data-close-on-select": false
            },
            formatOptions(displayFormat, sortOrder, idProperty, textProperty),
            addDataProcessingAttributes(true),
            htmlAttributes,
            {
                "data-multiple": true
            });

        var values = selectedValues;
        if ($.isArray(selectedValues)) {
            values = selectedValues.join(",");
        }

        var textbox = SunGard.Common.Html.InputExtensions.SunGardTextBox(name, values, attributes, userAccess, trackChanges);

        if (showSelectAll) {
            var $textbox = $(textbox);
            var tagId = $textbox.attr("id");
            var checkAllName = (selectAllId || name + "CheckAll");
            var checkAllId = SunGard.Common.Html.HtmlExtensionMethods.CreateSanitizedId(checkAllName);
            var disabledCheckAllId = SunGard.Common.Html.HtmlExtensionMethods.GetDisabledName(checkAllId);

            $textbox.addClass("sg-select-all-select");

            var inputGroup = SunGard.Common.Html.TagBuilder('div').AddCssClass('input-group').MergeAttribute('data-toggle', 'buttons');
            if (userAccess === SunGard.Common.UserAccessType.ReadOnly) {
                inputGroup.MergeAttribute("disabled", "disabled");
                $textbox.attr("data-select-all-btn", "#" + disabledCheckAllId);
            } else {
                $textbox.attr("data-select-all-btn", "#" + checkAllId);
            }

            var inputAddOn = SunGard.Common.Html.InputExtensions.SunGardCheckBox(checkAllName, false, { class: 'sg-select-all-btn', 'data-select-name': '#' + tagId }, userAccess, '<i class="glyphicon glyphicon-asterisk"></i>', SunGard.Common.Html.OptionInputType.ButtonToggleAddon, SunGard.Common.Html.StyleType.Branded, false);

            inputGroup.SetInnerHtml($textbox[0].outerHTML + inputAddOn);

            return inputGroup.ToString();
        } else {
            return textbox;
        }
    }

    function formatOptions(displayFormat, sortOrder, idProperty, textProperty) {
        if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidSelectDisplayFormat(displayFormat)) {
            displayFormat = SunGard.Common.Html.SelectDisplayFormat.CodeAndDescription;
        }

        if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidDropdownSortOrder(sortOrder)) {
            sortOrder = SunGard.Common.Html.DropdownSortOrder.UseDefault;
        }

        var formatAttributes = {};
        switch (displayFormat) {
            case SunGard.Common.Html.SelectDisplayFormat.Code:
                formatAttributes["data-format-result"] = "SunGard.Bootstrap.DropDownList.FormatCode";
                formatAttributes["data-format-selection"] = "SunGard.Bootstrap.DropDownList.FormatCode";
                formatAttributes["data-matcher"] = "SunGard.Bootstrap.DropDownList.CodeMatcher";
                break;

            case SunGard.Common.Html.SelectDisplayFormat.Description:
                formatAttributes["data-format-result"] = "SunGard.Bootstrap.DropDownList.FormatDescription";
                formatAttributes["data-format-selection"] = "SunGard.Bootstrap.DropDownList.FormatDescription";
                formatAttributes["data-matcher"] = "SunGard.Bootstrap.DropDownList.DescriptionMatcher";
                break;

            case SunGard.Common.Html.SelectDisplayFormat.CodeAndDescription:
                formatAttributes["data-format-result"] = "SunGard.Bootstrap.DropDownList.FormatCodeDescription";
                formatAttributes["data-format-selection"] = "SunGard.Bootstrap.DropDownList.FormatCodeDescription";
                formatAttributes["data-matcher"] = "SunGard.Bootstrap.DropDownList.CodeDescriptionMatcher";
                break;
        }

        formatAttributes["data-sg-sort-order"] = sortOrder;
        formatAttributes["data-sort-results"] = "SunGard.Bootstrap.DropDownList.SortMatchesFirst";

        if (idProperty === null || idProperty === undefined) {
            idProperty = "id";
        }
        formatAttributes["data-sg-id-property"] = idProperty;

        if (textProperty === null || textProperty === undefined) {
            textProperty = "text";
        }
        formatAttributes["data-sg-text-property"] = textProperty;

        return formatAttributes;
    }

    function addDataProcessingAttributes(processInvalidSelections) {
        return {
            "data-sg-process-data-options": "SunGard.Bootstrap.DropDownList.ProcessDataOptions",
            "data-sg-process-invalid-selections": processInvalidSelections,
            "data-sg-invalid-value-option-text": "",
            "data-sg-clone-data": false,
            "data-sg-always-add-invalid-values": false
        };
    }

    function transformOptions(options, textName, valueName, disabledName, groupIdName, groupLabelName, selectedValues) {
        /// <summary>
        /// Transforms the options for a dropdown/listbox into an array that can be used for a data list/data listbox.
        /// </summary>
        /// <param name="options" type="object[]">An array of value/text pair objects and optional disabled, selected, and grouping properties.</param>
        /// <param name="textName" type="string" optional="true">The name of the text property.  Default is 'text'.</param>
        /// <param name="valueName" type="string" optional="true">The name of the value property.  Default is 'value'.</param>
        /// <param name="disabledName" type="string" optional="true">The name of the disabled property.  Default is 'disabled'.  Does not have to exist in any/all objects in the array.</param>
        /// <param name="groupIdName" type="string" optional="true">The name of the grouping ID property.  Default is 'groupId'.  Does not have to exist in any/all objects in the array.</param>
        /// <param name="groupLabelName" type="string" optional="true">The name of the grouping label property.  Default is 'groupLabel'.  Does not have to exist in any/all objects in the array.</param>
        /// <param name="selectedValues" type="string[]" optional="true">The selected values in the options list.  If not provided, they will be determined by looking for a boolean 'selected' property on the objects in the array.</param>
        /// <returns type="object">Returns an object with 2 properties:  1) options (object[]) - the options formatted for a data list;  (2) selectedValues (string[]) - the selected values.</returns>

        // Initialiize the return value
        var returnValue = {
            options: [],
            selectedValues: selectedValues
        };

        // If an array of options was passed, process it
        if (options !== null && $.isArray(options)) {
            // Initialize the value/text/disabled property names with defaults if they weren't provided.
            textName = textName || 'text';
            valueName = valueName || 'value';
            disabledName = disabledName || 'disabled';

            // Initialize variables for performing group processing.
            var NOGROUP = 'NOGROUP';
            var groups = {};
            groupIdName = groupIdName || 'groupId';
            groupLabelName = groupLabelName || 'groupLabel';

            // Determine if we need to look for selected values and if so, initialize the list.
            var checkForSelectedValues = selectedValues === null || selectedValues === undefined;
            if (checkForSelectedValues) {
                selectedValues = [];
            }

            // Process each option
            $.each(options, function (index, option) {
                // Initialize option property values
                var optionText = "";
                var optionValue = "";
                var disabled = false;

                // Set the option text if the text property was found on the object.
                if (option.hasOwnProperty(textName)) {
                    optionText = option[textName];
                }

                // Set the option value if the value property was found on the object.
                if (option.hasOwnProperty(valueName)) {
                    optionValue = option[valueName];
                }

                // Mark the option as disabled if the disabled property was found on the object and set to true.
                if (option.hasOwnProperty(disabledName) && (option[disabledName] === true || option[disabledName].toLowerCase() === "true")) {
                    disabled = true;
                }

                // If checking for selected values, add the option value to the list of selected values if the
                // option has a selected property and it's set to true.
                if (checkForSelectedValues && option.hasOwnProperty("selected") && (option["selected"] === true || option["selected"].toLowerCase() === "true")) {
                    selectedValues.push(optionValue);
                }

                // If the option has a group ID property with a value, perform the group processing.
                if (option.hasOwnProperty(groupIdName) && $.trim(option[groupIdName]) !== "") {
                    var groupId = $.trim(option[groupIdName]);

                    // Check if the grouping was already created.
                    if (groups[groupId] === undefined) {
                        // If not, create the new group option with an empty array of children
                        groups[groupId] = {
                            id: groupId,
                            text: option.hasOwnProperty(groupLabelName) ? $.trim(option[groupLabelName]) : groupId,
                            disabled: true,
                            children: []
                        }
                    }

                    // Create the new option object and add it to the list of child options for the group.
                    groups[groupId].children.push({
                        id: optionValue,
                        text: optionText,
                        disabled: disabled
                    });
                // Otherwise, create the new option object add it to the list of non-grouped options.
                } else {
                    returnValue.options.push({
                        id: optionValue,
                        text: optionText,
                        disabled: disabled
                    });
                }
            });

            // If groups were found, add each group to the array of options.
            if (!$.isEmptyObject(groups)) {
                for (var groupId in groups) {
                    returnValue.options.push(groups[groupId]);
                }
            }

            // If checked for selected values, apply the selected values array to the return object.
            if (checkForSelectedValues) {
                returnValue.selectedValues = selectedValues;
            }
        }

        // Return the generated data
        return returnValue;
    }

    function createOptions(options, textName, valueName, disabledName, groupIdName, groupLabelName, selectedValue, callback) {
        var htmlOptions = '';
        if (options !== null && $.isArray(options)) {
            textName = textName || 'text';
            valueName = valueName || 'value';
            disabledName = disabledName || 'disabled';

            var NOGROUP = 'NOGROUP';
            var groups = {};
            groupIdName = groupIdName || 'groupId';
            groupLabelName = groupLabelName || 'groupLabel';

            $.each(options, function (index, option) {

                var optionBuilder = SunGard.Common.Html.TagBuilder('option');
                if (option.hasOwnProperty(textName)) {
                    optionBuilder.SetInnerText(option[textName]);
                }

                if (option.hasOwnProperty(valueName)) {
                    optionBuilder.MergeAttribute('value', option[valueName]);
                }

                // Check if the option should be disabled
                if (option.hasOwnProperty(disabledName) && (option[disabledName] === true || option[disabledName].toLowerCase() === "true")) {
                    optionBuilder.MergeAttribute('disabled', 'disabled');
                }

                //Check for selected value(s) - this will be a case insensitive check
                if ((selectedValue !== null && (($.isArray(selectedValue) &&
                    $.inArray($.trim(option[valueName]).toLowerCase(), selectedValue.map(function (value) { return $.trim(value).toLowerCase(); })) >= 0) ||
                    $.trim(option[valueName]).toLowerCase() === $.trim(selectedValue).toLowerCase())) ||
                    option.hasOwnProperty('selected')) {
                    optionBuilder.MergeAttribute('selected', 'selected');
                }


                var optionHtml = optionBuilder.ToString();
                if (callback !== undefined && $.isFunction(callback))
                    optionHtml = callback(optionHtml, option);

                if (option.hasOwnProperty(groupIdName)) {
                    var groupId = $.trim(option[groupIdName]);
                    if (groupId === '') groupId = NOGROUP;
                    if (groups[groupId] === undefined)
                        groups[groupId] = { label: option[groupLabelName] ? $.trim(option[groupLabelName]) : groupId, options: '' };

                    groups[groupId].options += optionHtml;
                }
                htmlOptions += optionHtml;
            });

            if (!$.isEmptyObject(groups)) {
                htmlOptions = '';
                for (var groupId in groups) {
                    if (!groups.hasOwnProperty(groupId)) continue;
                    if (groupId === NOGROUP)
                        htmlOptions += groups[groupId].options;
                    else
                        htmlOptions += SunGard.Common.Html.TagBuilder("optgroup").MergeAttribute('label', SunGard.Common.HtmlEncode(groups[groupId].label)).SetInnerHtml(groups[groupId].options).ToString();
                }
            }
        }
        return htmlOptions;
    }

    function addInvalidSelectionValuesAttribute(selectedValues, options, valueName, textName, attributes) {
        /// <summary>
        /// Adds the validation attributes for invalid selected values.
        /// </summary>
        /// <param name="selectedValues" type="string|string[]">The selected value or list of selected values.</param>
        /// <param name="options" type="object[]">Array of the valid options.</param>
        /// <param name="valueName" type="string">Property name of the value for each option object.</param>
        /// <param name="textName" type="string">Property name of the description for each option object.</param>
        /// <param name="attributes" type="object">An object that contains the HTML attributes that will be getting applied to the dropdown/listbox.</param>
        /// <returns type="boolean">Flag indicating whether or not any of the selected values were invalid.</returns>

        // Initialize the list of invalid options
        var invalidOptions = [];

        var selectedOptions = selectedValues;
        var invalidSelectionsFound = false;

        textName = textName || 'text';
        valueName = valueName || 'value';

        // Only check for invalid options if valid options and selected values are provided
        if (options !== null && options !== undefined && $.isArray(options) && options.length > 0 &&
            selectedOptions !== null && selectedOptions !== undefined && (($.isArray(selectedOptions) && selectedOptions.length > 0) || (!$.isArray(selectedOptions) && $.trim(selectedOptions) !== ""))) {
            // Make sure the selected values provided is an array
            if (!$.isArray(selectedOptions)) {
                selectedOptions = [selectedOptions];
            }

            // Get an array of the values from the array of valid options
            var optionValues = options.map(function (option) { return $.trim(option[valueName]).toLowerCase(); });

            // Check each selected value to make sure it's valid.
            $(selectedOptions).each(function (index, value) {
                // If it's not found in the array of valid values, then add it to the array of invalid options
                if ($.inArray($.trim(value).toLowerCase(), optionValues) === -1) {
                    invalidOptions.push($.trim(value));
                }
            });
        }

        // If invalid options were found, add new options appropriately
        if (invalidOptions.length > 0) {
            invalidSelectionsFound = true;

            // Get the description to use for the invalid value option description
            var invalidValueOptionText = SunGard.Common.GetResourceString("InvalidValueOptionText");

            // Add each invalid option to the list of options
            $(invalidOptions).each(function (index, value) {
                var option = {};
                option[valueName] = value;
                option[textName] = invalidValueOptionText;
                options.push(option);
            });
        }

        // Add an attribute with the list of invalid options found, if any
        $.extend(attributes, { "data-val-sginvalidselections-values": JSON.stringify(invalidOptions) });

        // Return whether any invalid options were found
        return invalidSelectionsFound;
    }

    function evaluateValue(value) { return (value == undefined || value == null) ? "" : value; }

    return {
        SunGardDropDownList: sunGardDropDownList,
        SunGardListBox: sunGardListBox,
        SunGardDataList: sunGardDataList,
        SunGardDataListBox: sunGardDataListBox
    };

}();

SunGard.Common.Html.TextAreaExtensions = function () {

    function sunGardTextArea(name, value, rows, cols, htmlAttributes, userAccess, trackChanges, autoSize, preventCrLf) {
        /// <summary>
        /// Returns the specified textarea element by using the name of the form field, the text content, the number of rows and columns, and the specified HTML attributes.
        /// </summary>
        /// <param name="name" type="string">The name of the form field to return.</param>
        /// <param name="value" type="object" optional="true">The text content.</param>
        /// <param name="rows" type="number" optional="true">The number of rows.</param>
        /// <param name="cols" type="number" optional="true">The number of columns.</param>
        /// <param name="htmlAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the element.</param>
        /// <param name="userAccess" type="SunGard.Common.UserAccessType" optional="true">An optional parameter used to decide what access a user has to a the control</param>
        /// <param name="trackChanges" type="boolean" optional="true">If set to true changes will be tracked and an "Unsaved Changes" message will be displayed.</param>
        /// <param name="autoSize" type="SunGard.Common.Html.TextareaAutoSizing" optional="true">If set to true the control will increase in size to the content of the data, if appropriate.</param>
        /// <param name="preventCrLf" type="boolean" optional="true">If set to true CR/LF characters cannot be typed in the control.</param>
        /// <returns type="string">HTML string for a multi-line text input element.</returns>

        if (name === undefined) {
            throw "The name parameter is required";
        }

        userAccess = userAccess || SunGard.Common.GetDefaultUserAccess();
        htmlAttributes = htmlAttributes || {};

        if (userAccess == SunGard.Common.UserAccessType.NoAccess) {
            return '';
        }

        if (trackChanges === null || trackChanges === undefined || trackChanges !== false) {
            trackChanges = true;
        }

        // Validate the auto-sizing setting and set a default value if one is not provided.
        if (autoSize === null || autoSize === undefined || !SunGard.Common.Html.HtmlExtensionMethods.IsValidAutoSizeOption(autoSize)) {
            autoSize = SunGard.Common.Html.TextAreaAutoSizing.None;
        }

        // Validate the prevent CR/LF setting and set a default value if one is not provided.
        if (preventCrLf === null || preventCrLf === undefined || preventCrLf !== true) {
            preventCrLf = false;
        }

        var tagBuilder = SunGard.Common.Html.TagBuilder('textarea')
            .MergeAttributes($.extend({ "data-val": true, "data-val-sgvalid": "", "data-sgvalid-isvalid": true }, htmlAttributes, { name: name }))
            .GenerateId()
            .AddCssClass("form-control")
            .AddCssClass("sg-textarea-printable")
            .MergeAttribute("data-auto-size", autoSize);

        if (trackChanges) {
            tagBuilder.AddCssClass("sg-track-changes");
        }

        if (rows != undefined /** or null **/) {
            tagBuilder.MergeAttribute('rows', rows);
        }
        if (cols != undefined /** or null **/) {
            tagBuilder.MergeAttribute('cols', cols);
        }
        tagBuilder.SetInnerText(evaluateValue(value));

        if (userAccess == SunGard.Common.UserAccessType.ReadOnly) {
            tagBuilder.AddCssClass('sg-text-readonly')
                .MergeAttribute("autocomplete", "off");
        }

        // Get necessary information for the printable DIV container
        var textareaId = SunGard.Common.Html.HtmlExtensionMethods.CreateSanitizedId(name);
        var printableDivName = name + "-print-view";

        // If auto-sizing is to be done, add a class so it's done on page load
        if (autoSize !== SunGard.Common.Html.TextAreaAutoSizing.None) {
            tagBuilder.AddCssClass("sg-textarea-size-on-load");
        }

        // If preventing CR/LF, add a class to indicate the desired behavior.
        if (preventCrLf) {
            tagBuilder.AddCssClass("sg-textarea-prevent-crlf");
        }

        // Create a wrapper DIV and insert the generated TEXTAREA and printable DIV tags inside it.  This
        // is necessary to avoid causing an error when using KnockOut.
        var wrapperDiv = SunGard.Common.Html.TagBuilder("div")
            .SetInnerHtml(tagBuilder.ToString() + SunGard.Common.Html.ValueExtensions.SunGardValue(printableDivName, "", { "class": "sg-textarea-print-view hidden", "data-control-content": textareaId }, SunGard.Common.UserAccessType.ReadOnly));

        return wrapperDiv.ToString();
    }

    function evaluateValue(value) { return (value == undefined || value == null) ? "" : value; }

    return {
        SunGardTextArea: sunGardTextArea
    };
}();

SunGard.Common.Html.ValueExtensions = function () {

    function sunGardValue(name, value, htmlAttributes, userAccess, hiddenHtmlAttributes) {
        /// <summary>
        /// Returns a display-only form element with a hidden input control using the name
        /// of the form field, the value, and the HTML attributes.
        /// </summary>
        /// <param name="name" type="string">The name of the form field and the ViewDataDictionary key that is used to look up the value.</param>
        /// <param name="value" type="object" optional="true">The value of the display-only form element.</param>
        /// <param name="htmlAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the element.</param>
        /// <param name="userAccess" type="SunGard.Common.UserAccessType" optional="true">An optional parameter used to decide what access a user has to the control</param>
        /// <param name="hiddenHtmlAttributes" type="object" optional="true">An object that contains the HTML attributes to set for the hidden field.</param>
        /// <returns type="string">HTML string for a display-only form element.</returns>

        if (name === null || name === undefined) {
            throw "The name parameter is required";
        }

        userAccess = userAccess || SunGard.Common.GetDefaultUserAccess();
        htmlAttributes = htmlAttributes || {};

        if (userAccess == SunGard.Common.UserAccessType.NoAccess) {
            return "";
        }

        value = evaluateValue(value);

        var valueFieldName = $.trim(name) + "-value";
        var valueWrapper = SunGard.Common.Html.TagBuilder("div")
            .MergeAttribute("name", valueFieldName)
            .AddCssClass("sg-uneditable-value")
            .GenerateId()
            .SetInnerText(value);

        var wrapper = SunGard.Common.Html.TagBuilder("div")
            .MergeAttributes(htmlAttributes)
            .AddCssClass("sg-uneditable")
            .SetInnerHtml(valueWrapper.ToString() + SunGard.Common.Html.InputExtensions.SunGardHidden(name, value, hiddenHtmlAttributes));

        return wrapper.ToString();
    }

    function evaluateValue(value) { return (value == undefined || value == null) ? "" : value; }

    return {
        SunGardValue: sunGardValue
    };
}();

SunGard.Common.Html.SectionOptionsViewModel = function () {
    this.IncludedOptions = [];
    this.CustomOptions = [];
};

SunGard.Common.Html.IncludedSectionOption = function (option, enabled, tooltip, htmlAttributes, customOptions) {
    this.Option = option;
    this.Enabled = enabled === undefined || enabled === null ? true : enabled;
    this.Tooltip = tooltip;
    this.HtmlAttributes = htmlAttributes;
    this.CustomOptions = customOptions;
}

SunGard.Common.Html.CustomSectionOption = function (showDividerOrOptionIdOrOptionText, iconCssClassOrIsHeader, optionText, enabled, tooltip) {
    switch (typeof showDividerOrOptionIdOrOptionText) {
        case "string":
            switch (typeof iconCssClassOrIsHeader) {
                case "boolean":
                    this.OptionText = showDividerOrOptionIdOrOptionText;
                    this.IsHeader = iconCssClassOrIsHeader;
                    this.ShowDivider = false;
                    this.Enabled = true;
                    break;
                case "object":
                case "string":
                    this.OptionId = showDividerOrOptionIdOrOptionText;
                    this.IconCssClass = iconCssClassOrIsHeader || "";
                    this.OptionText = optionText || "";
                    this.Enabled = enabled === undefined || enabled === null ? true : enabled;
                    this.Tooltip = tooltip || "";
                    break;
            }
            break;
        case "boolean":
            this.ShowDivider = showDividerOrOptionIdOrOptionText;
            this.Enabled = true;
            break;
        default:
            this.Enabled = true;
    }
}

SunGard.Common.Html.PanelExtensions = function () {

    function sunGardPanel(level, title, panelId, panelHtmlAttributes, headingHtmlAttributes, contentHtmlAttributes, styleType, collapsible, showCollapsed, sectionOptions, isDeletable, titleHtmlAttributes) {
        /// <summary>
        /// Returns the specified panel with the provided options.
        /// </summary>
        /// <param name="level" type="SunGard.Common.Html.PanelLevel">The name of the form field to return.</param>
        /// <param name="title" type="string">The text to display in the heading.</param>
        /// <param name="panelId" type="string">The string to be used when generating the ids for elements in the panel.</param>
        /// <param name="panelHtmlAttributes" type="object" optional="true">The html attributes to apply to the panel element.</param>
        /// <param name="headingHtmlAttributes" type="object" optional="true">The html attributes to apply to the heading element.</param>
        /// <param name="contentHtmlAttributes" type="object" optional="true">The html attributes to apply to the content element.</param>
        /// <param name="styleType" type="SunGard.Common.Html.StyleType" optional="true">Style that should be used when rendering the panel.</param>
        /// <param name="collapsible" type="boolean" optional="true">Specifies whether the panel should be collapsible.</param>
        /// <param name="showCollapsed" type="boolean" optional="true">When the panel is collapsible, specifies whether the panel should be initially collapsed.</param>
        /// <param name="sectionOptions" type="object" optional="true">???</param>
        /// <param name="isDeletable"" type="boolean" optional="true">If set to true the Panel/Card will be created with a delete icon which when clicked will strikethrough the title, collapse the panel and disable the ability to expand.</param>
        /// <param name="titleHtmlAttributes" type="object" optional="true">The html attributes to apply to the title element.</param>
        /// <returns type="string">HTML string for a panel element.</returns>

        if (!level)
            throw "The level parameter is required";

        // title might be blank due to knockout binding.  Don't error, just make it blank.
        if (typeof title === "undefined") title = "";

        if (!panelId)
            throw "The panelId parameter is required";

        if (styleType === undefined)
            styleType = SunGard.Common.Html.StyleType.Branded;

        if (collapsible === undefined)
            collapsible = true;

        if (isDeletable === undefined)
            isDeletable = false;

        if (!SunGard.Common.Html.HtmlExtensionMethods.IsValidStyleType(styleType))
            throw "The provided styleType is invalid";

        var titleLink = SunGard.Common.Html.TagBuilder("a");

        var titleTagName;
        switch (level) {
            case SunGard.Common.Html.PanelLevel.Level1:
                titleTagName = "h2";
                break;

            case SunGard.Common.Html.PanelLevel.Level2:
                titleTagName = "h3";
                break;

            case SunGard.Common.Html.PanelLevel.Level3:
                titleTagName = "h5";
                break;

            case SunGard.Common.Html.PanelLevel.Display:
                titleTagName = "h2";
                break;

            default:
                titleTagName = "div";
        }

        var titleTag = SunGard.Common.Html.TagBuilder(titleTagName)
            .AddCssClass("panel-title")
            .AddCssClass("clearfix")
            .GenerateId(panelId + "-title");

        //Added the deletable class functionality
        if (isDeletable === true) {
            sectionOptions = sectionOptions || { IncludedOptions: [] };
            var found = $.grep(sectionOptions.IncludedOptions, function (o) {
                if (o.Option == SunGard.Common.Html.IconType.Delete) {
                    return true;
                }
            });

            var deleteOption;
            if (found && found.length) {
                deleteOption = found[0];
            }
            else {
                deleteOption = { Option: SunGard.Common.Html.IconType.Delete, Enabled: true };
                sectionOptions.IncludedOptions.push(deleteOption);
            }

            deleteOption.HtmlAttributes = deleteOption.HtmlAttributes || {};
            deleteOption.HtmlAttributes['class'] = $.trim('sg-deletable-btn sg-delete-btn ' + $.trim(deleteOption.HtmlAttributes['class']));

            found = $.grep(sectionOptions.IncludedOptions, function (o) {
                if (o.Option == SunGard.Common.Html.IconType.Undelete) {
                    return true;
                }
            });

            var undeleteOption;
            if (found && found.length) {
                undeleteOption = found[0];
            }
            else {
                undeleteOption = { Option: SunGard.Common.Html.IconType.Undelete, Enabled: true };
                sectionOptions.IncludedOptions.push(undeleteOption);
            }

            undeleteOption.HtmlAttributes = undeleteOption.HtmlAttributes || {};
            undeleteOption.HtmlAttributes['class'] = $.trim('sg-deletable-btn sg-undelete-btn hidden ' + $.trim(undeleteOption.HtmlAttributes['class']));
        }

        var optionsGroup;
        if (sectionOptions) {
            var optionsHtml = '';
            if (sectionOptions.CustomOptions && sectionOptions.CustomOptions.length) {
                var customOption;
                if (sectionOptions.IncludedOptions && sectionOptions.IncludedOptions.length) {
                    var found = $.grep(sectionOptions.IncludedOptions, function (o) {
                        if (o.Option == SunGard.Common.Html.IconType.Options) {
                            return true;
                        }
                    });
                    if (found && found.length) {
                        customOption = found[0];
                    }
                } else {
                    customOption = new SunGard.Common.Html.IncludedSectionOption(SunGard.Common.Html.IconType.Options, true, null, null, null);
                    sectionOptions.IncludedOptions = [];
                    sectionOptions.IncludedOptions.push(customOption);
                }
                if (customOption === null || customOption === undefined) {
                    customOption = new SunGard.Common.Html.IncludedSectionOption(SunGard.Common.Html.IconType.Options, true, null, null, null);
                    sectionOptions.IncludedOptions.push(customOption);
                }
                customOption.CustomOptions = sectionOptions.CustomOptions;
            }

            if (sectionOptions.IncludedOptions && sectionOptions.IncludedOptions.length) {
                var iconCount = SunGard.Common.Html.IconType.length;
                for (var i = 0; i < iconCount; ++i) {
                    var icon = SunGard.Common.Html.IconType[i];
                    var found = $.grep(sectionOptions.IncludedOptions, function (o) {
                        // if the option is actually a number, because the Razor version of this takes an enumerated type for
                        // Option, not an object, check if it's the same as the index.  If so, just set the option to the IconType for that index.
                        if (!isNaN(o.Option)) {
                            if (parseInt(o.Option, 10) === i) {
                                o.Option = icon;
                                return true;
                            }
                        }
                        else if (o.Option == icon) {
                            return true;
                        }
                    });

                    if (found && found.length) {
                        var found = found[0];
                        if (found.CustomOptions !== undefined && found.CustomOptions !== null && found.CustomOptions.length > 0) {
                            optionsHtml += generateDropdownOption(found, panelId);
                        } else {
                            optionsHtml += generateSimpleOption(found, panelId);
                        }
                    }
                }
            }

            optionsGroup = SunGard.Common.Html.TagBuilder("div")
                .AddCssClass("btn-group")
                .AddCssClass("pull-right")
                .GenerateId(panelId + "-options")
                .SetInnerHtml(optionsHtml);
        }


        var heading = SunGard.Common.Html.TagBuilder("div")
            .MergeAttributes(headingHtmlAttributes)
            .AddCssClass("panel-heading")
            .GenerateId(panelId + "-heading");

        var body = SunGard.Common.Html.TagBuilder("div")
            .MergeAttributes(contentHtmlAttributes)
            .AddCssClass("panel-body")
            .GenerateId(panelId + "-content");

        var panel = SunGard.Common.Html.TagBuilder("div")
            .MergeAttributes(panelHtmlAttributes)
            .AddCssClass("sg-panel-" + level)
            .AddCssClass("panel-" + styleType)
            .AddCssClass("panel")
            .GenerateId(panelId);

        var contentHtml;

        if (typeof titleHtmlAttributes !== "undefined") {
            // if the titleHtmlAttributes object is defined, wrap the title
            // in a DIV and set the title to the innerHTML.
            title = SunGard.Common.Html.TagBuilder("span")
                    .MergeAttributes(titleHtmlAttributes)
                    .SetInnerHtml(title).ToString();
        }

        if (collapsible) {
            var collapseIcon = SunGard.Common.Html.TagBuilder("span");

            var collapsibleContainer = SunGard.Common.Html.TagBuilder("div")
                .AddCssClass("panel-collapse")
                .AddCssClass("collapse")
                .GenerateId(panelId + "-collapsible")
                .SetInnerHtml(body.ToString());

            if (showCollapsed) {
                heading.AddCssClass("sg-panel-" + level + "-collapsed");
                titleLink.AddCssClass("collapsed");
                collapseIcon.AddCssClass("sg-icon-collapsed");
            } else {
                collapsibleContainer.AddCssClass("in");
                collapseIcon.AddCssClass("sg-icon-expanded");
            }

            titleLink
                .MergeAttributes({
                    "data-toggle": "collapse",
                    "href": "#" + panelId + "-collapsible"
                })
                .SetInnerHtml(collapseIcon.ToString() + title);

            contentHtml = collapsibleContainer.ToString();
        } else {
            titleLink.SetInnerHtml(title);
            contentHtml = body.ToString();
        }

        titleTag.SetInnerHtml(titleLink.ToString() + (optionsGroup ? optionsGroup.ToString() : ""));
        heading.SetInnerHtml(titleTag.ToString());
        panel.SetInnerHtml(heading.ToString() + contentHtml);

        return panel.ToString();
    }

    function generateSimpleOption(option, panelId) {
        /// <summary>
        /// Generates a card option that is simply an icon the user can click to trigger the
        /// intended behavior.
        /// </summary>
        /// <param name="option" type="SunGard.Common.Html.IncludedSectionOption">Information about the icon that should be rendered.</param>
        /// <param name="panelId" type="string">The ID of the panel that the naming of the icon button is based on.</param>
        /// <returns type=""></returns>

        var action = option.Option.IconName.toLowerCase();
        var tooltipAttribute = (option.Tooltip && option.Tooltip.length > 0 ? { "title": option.Tooltip } : {});
        var disabledAttribute = (!option.Enabled ? { "disabled": "disabled" } : {});
        var buttonAttributes = $.extend({}, option.HtmlAttributes, tooltipAttribute, disabledAttribute);
        return SunGard.Common.Html.ButtonExtensions.SunGardIconButton(option.Option, panelId + "-option-" + action, null, buttonAttributes);
    }

    function generateDropdownOption(option, panelId) {
        /// <summary>
        /// Generates a card option that when clicked will display a dropdown of custom options.
        /// </summary>
        /// <param name="option" type="SunGard.Common.Html.IncludedSectionOption">Information about the icon that should be rendered.</param>
        /// <param name="panelId" type="string">The ID of the panel that the naming of the icon button is based on.</param>
        /// <returns type=""></returns>

        var action = option.Option.IconName.toLowerCase();
        var buttonAttributes = {
            "data-toggle": "dropdown",
            "class": "dropdown-toggle"
        };
        var button = SunGard.Common.Html.ButtonExtensions.SunGardIconButton(option.Option, panelId + "-option-" + action, null, buttonAttributes);

        var menuItemsHtml = '';
        var optionCount = option.CustomOptions.length;
        for (var i = 0; i < optionCount; i++) {
            var customOption = option.CustomOptions[i];
            var item = SunGard.Common.Html.TagBuilder("li")
                .MergeAttribute("role", "presentation");
            if (customOption.ShowDivider) {
                item.AddCssClass("divider");
            } else if (customOption.IsHeader) {
                item.AddCssClass("dropdown-header")
                    .SetInnerHtml(customOption.OptionText);
            } else {
                var link = SunGard.Common.Html.TagBuilder("a")
                    .MergeAttributes({
                        "href": "#",
                        "title": customOption.Tooltip
                    })
                    .AddCssClass(customOption.IconCssClass)
                    .GenerateId(customOption.OptionId)
                    .SetInnerHtml(customOption.OptionText);

                item.SetInnerHtml(link.ToString());

                if (!customOption.Enabled) {
                    item.AddCssClass("disabled");
                }
            }

            menuItemsHtml += item.ToString();
        }

        var menu = SunGard.Common.Html.TagBuilder("ul")
            .AddCssClass("dropdown-menu")
            .AddCssClass("pull-right")
            .MergeAttribute("role", "menu")
            .SetInnerHtml(menuItemsHtml);

        var customOptionButtonGroup = SunGard.Common.Html.TagBuilder("div")
            .AddCssClass("btn-group")
            .SetInnerHtml(button + menu.ToString());

        return customOptionButtonGroup.ToString();
    }

    return {
        SunGardPanel: sunGardPanel
    };
}();
