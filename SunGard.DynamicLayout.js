(function ($, window, document, undefined) {

    $.widget("SunGard.dynamiclayout",
        {
            options: {
                bootstrap_size_class: 'col-md-',
                columnLimit: 4,
                saveElement: '#layout_save',
                addRowElement: '#layout_add_row',
                editModeElement: '#layout_edit',
                revertElement: "#layout_revert",
                useDefaultPanelEditor: true,
                editPanelDialogName: 'editPanelDialogName',
                addWidgetDialog:
                    {
                        widgetBuilder: null,
                        widgetData: null
                    },
                openAddWidgetDialog: null,
                pageId: 0,
                availableWidgets: []
            },
            _create: function () {
                this._privateVars = {
                    hasBeenChanged: false,
                    initialWidgetCount: 0,
                    registeredWidgets: 0,
                    validationInitialized: false
                };
                // Store a reference to the widget
                var self = this;

                // Locate the dynamic layout
                self.element.addClass('dynamic-layout');

                $(self.options.editModeElement).on('click', $.proxy(self.toggleRootEditMode, self));
                $(self.options.saveElement).on('click', $.proxy(self.saveLayout, self));
                $(self.options.revertElement).on('click', $.proxy(self.revertLayout, self));

                // Initialize Buttons for Panel Buttons
                self.editModePanelButtons = SunGard.Common.Html.TagBuilder("div").AddCssClass('btn-group pull-right layout-editor-btn-grp');
                var editButton = SunGard.Common.Html.TagBuilder("button")
                                .MergeAttributes({ title: SunGard.Common.GetResourceString("EditTitle"), type: 'button' })
                                .AddCssClass('btn sg-btn-icon layout-container-edit')
                                .SetInnerHtml(SunGard.Common.Html.TagBuilder("i").AddCssClass('sg-icon-md sg-icon fa fa-pencil').ToString());
                var addButton = SunGard.Common.Html.TagBuilder("button")
                                .MergeAttributes({ title: SunGard.Common.GetResourceString("AddColumn"), type: 'button' })
                                .AddCssClass('btn sg-btn-icon layout-container-add-container')
                                .SetInnerHtml(SunGard.Common.Html.TagBuilder("i").AddCssClass('sg-icon-md sg-icon fa fa-plus-circle').ToString());
                var deleteButton = SunGard.Common.Html.TagBuilder("button")
                                .MergeAttributes({ title: SunGard.Common.GetResourceString("RemoveCard"), type: 'button' })
                                .AddCssClass('btn sg-btn-icon layout-container-delete')
                                .SetInnerHtml(SunGard.Common.Html.TagBuilder("i").AddCssClass('sg-icon-md sg-icon fa fa-trash-o').ToString());
                self.editModePanelButtons.SetInnerHtml(addButton.ToString() + editButton.ToString() + deleteButton.ToString());

                if (self.options.useDefaultPanelEditor) {
                    // Edit/Add Panel Name Dialog
                    var panelNameInput = SunGard.Common.Html.InputExtensions.SunGardTextBox("setPanelName", null, null, SunGard.Common.UserAccessType.ReadWrite, false);
                    dialogBody = SunGard.Common.Html.TagBuilder("div").MergeAttribute("id", "setPanelNameBody").SetInnerHtml(panelNameInput);
                    SunGard.Bootstrap.Dialog.InitializeDialog(self.options.editPanelDialogName, SunGard.Common.GetResourceString("NameCardTitle"), SunGard.Bootstrap.Dialog.ButtonSets.OkCancel, { okClick: $.proxy(self.setPanelName, self), trackChanges: SunGard.Bootstrap.Dialog.TrackChangesOption.None }, dialogBody.ToString());
                    SunGard.Bootstrap.DropDownList.Init("#selectWidgetBody");
                }

                if (self.options.openAddWidgetDialog === null) {
                    self.options.openAddWidgetDialog = $.proxy(self.openAddWidgetDialogDefault, self);

                    // Add Widget Dialog
                    var widgetSelect = SunGard.Common.Html.SelectExtensions.SunGardDropDownList('widgetSelector', self.options.addWidgetDialog.widgetData, null, SunGard.Common.UserAccessType.ReadWrite, SunGard.Common.Html.SelectDisplayFormat.Description, false);
                    var dialogBody = SunGard.Common.Html.TagBuilder('div').MergeAttribute("id", "selectWidgetBody").SetInnerHtml(widgetSelect);
                    SunGard.Bootstrap.Dialog.InitializeDialog('addWidgetDialog', "Select a Widget", SunGard.Bootstrap.Dialog.ButtonSets.OkCancel, { okClick: $.proxy(self.processSelectedWidget, self), cancelClick: $.proxy(self.cancelWidgetAdd, self) }, dialogBody.ToString());
                }

                // Start the widget registration process
                this.registerWidgets();
            },
            // Common Header Creation method
            _createHeader: function (containerType) {
                var self = this;

                if (containerType == this.containerTypes.Panel.value)
                    return '';

                var html = SunGard.Common.Html;
                var header = SunGard.Common.Html.TagBuilder('div').AddCssClass('layout-container-header');
                var title = SunGard.Common.Html.TagBuilder('span').AddCssClass('layout-container-header-title');
                var buttonGroup = SunGard.Common.Html.TagBuilder('div').AddCssClass('btn-group pull-right layout-editor-btn-grp');
                var buttons = '';

                if (containerType === this.containerTypes.Row.value) {
                    title.SetInnerText('Row');
                    buttons = html.TagBuilder("div").AddCssClass('btn-group').SetInnerHtml(
                                    html.TagBuilder('button').MergeAttributes({ title: SunGard.Common.GetResourceString("AddItem"), type: 'button', 'data-toggle': 'dropdown' }).AddCssClass('btn sg-btn-icon dropdown-toggle').SetInnerHtml(
                                        html.TagBuilder('i').AddCssClass('sg-icon-md sg-icon fa fa-plus-circle').ToString()
                                    ).ToString() +
                                    html.TagBuilder('ul').AddCssClass('dropdown-menu pull-right').MergeAttribute('role', 'menu').SetInnerHtml(
                                        html.TagBuilder('li').AddCssClass('presentation').SetInnerHtml(
                                            html.TagBuilder('a').AddCssClass('layout-container-add-container').MergeAttribute('href', '#').SetInnerText(SunGard.Common.GetResourceString("AddCard")).ToString()
                                        ).ToString() +
                                        html.TagBuilder('li').AddCssClass('presentation').SetInnerHtml(
                                            html.TagBuilder('a').AddCssClass('layout-container-add-item').MergeAttribute('href', '#').SetInnerText(SunGard.Common.GetResourceString("AddWidget")).ToString()
                                        ).ToString()
                                   ).ToString()
                            ).ToString();
                    buttons += html.TagBuilder('button').MergeAttributes({ title: SunGard.Common.GetResourceString('RemoveRow'), type: 'button' }).AddCssClass('btn sg-btn-icon layout-container-delete').SetInnerHtml(
                                html.TagBuilder('i').AddCssClass('sg-icon-md sg-icon fa fa-trash-o').ToString()
                    ).ToString();
                } else {
                    if (containerType === this.containerTypes.Column.value) {
                        title.SetInnerText('Column');
                    }
                    buttons = html.TagBuilder('button').MergeAttributes({ title: SunGard.Common.GetResourceString("AddWidget"), type: 'button' }).AddCssClass('btn sg-btn-icon layout-container-add-item').SetInnerHtml(
                                    html.TagBuilder('i').AddCssClass('sg-icon-md sg-icon fa fa-plus-circle').ToString()
                        ).ToString();
                    buttons += html.TagBuilder('button').MergeAttributes({ title: SunGard.Common.GetResourceString('RemoveColumn'), type: 'button' }).AddCssClass('btn sg-btn-icon layout-container-delete').SetInnerHtml(
                                html.TagBuilder('i').AddCssClass('sg-icon-md sg-icon fa fa-trash-o').ToString()
                    ).ToString();
                }
                
                buttonGroup.SetInnerHtml(buttons);

                header.SetInnerHtml(title.ToString() + buttonGroup.ToString());

                return header.ToString();
            },
            // Event handler triggered when the resize of a column container begins
            _startResize: function (e, ui) {
                // Store a reference to the widget
                var self = this;
                SunGard.Common.ConsoleLog('start width: ' + ui.size.width);

                // Locate the element
                var $element = $(ui.element);

                // Determine the minimum size
                var minSize = 1;
                if ($element.hasClass('resizable-container')) {
                    minSize = $element.data('minimum-size');
                    SunGard.Common.ConsoleLog('minimum size: ' + minSize);
                    if (minSize === undefined || minSize === null) {
                        minSize = 1;
                    }
                }

                // Determine the size of a single bootstrap column at the current screen size
                var increment = self.getMediaSize();

                var minWidth = minSize * increment;
                $element.css('min-width', minWidth + 'px');
            },

            // Event handler triggered when the resize of a column container ends
            _stopResize: function (e, ui) {
                // Store a reference to the widget
                var self = this;
                // Determine the size of a single bootstrap column at the current screen size
                var increment = self.getMediaSize();

                // Locate the element
                var $element = $(ui.element);

                // Determine the minimum size
                var minSize = 1;
                if ($element.hasClass('resizable-container')) {
                    minSize = $element.data('minimum-size');
                    SunGard.Common.ConsoleLog('minimum size: ' + minSize);
                    if (minSize === undefined || minSize === null) {
                        minSize = 1;
                    }
                }
                SunGard.Common.ConsoleLog('minimum size: ' + minSize);

                // Determine the current with of the element being resized
                var currentWidth = ui.size.width;
                SunGard.Common.ConsoleLog('new width: ' + currentWidth);

                // Initialize the new Size class value
                var newClass = self.options.bootstrap_size_class;
                // Determine the number of columns required to contain the new element size
                var colNum = Math.round((currentWidth / increment));

                if (colNum < minSize) colNum = minSize;

                // Append the column number to the new class size
                newClass += colNum;
                SunGard.Common.ConsoleLog('new class: ' + newClass);

                // Remove the old bootstrap size class, add the new size class, update the start-size data attribute, and remove the height/width css values
                $element.removeClass($element.data('start-size')).addClass(newClass).data('start-size', newClass).css('width', '').css('height', '').css('min-width', '');
                this._privateVars.hasBeenChanged = true;
            },

            // Event handler triggered when a sortable event begins.
            // Used to force the class and height values for the placehold element to be set based on the element being moved.
            _layoutWidgetStartSort: function (e, ui) {
                // Store a reference to the widget
                var self = this;
                // Locate the placeholder
                var $placeholder = $(ui.placeholder);
                // Locate the target element
                var $target = $(ui.item);
                // Update the class attribute of the placeholder
                SunGard.Common.ConsoleLog('target class: ' + $target[0].className);
                $placeholder.removeClass().addClass($target[0].className).addClass('layout-widget-placeholder');
                SunGard.Common.ConsoleLog('placeholder class: ' + $placeholder[0].className);
                // Update the height attribute of the placeholder
                $placeholder.height($target.height());
            },
            editContainerEvent: null,
            activeElement: null,
            editModePanelButtons: null,
            containerTypes: {
                Widget: { value: 1 },
                Column: { value: 2 },
                Panel: { value: 3 },
                Row: { value: 4 }
            },
            getActiveElementType: function () {
                var elementType = -1;
                if (this.activeElement !== null) {
                    var $parent = this.activeElement.closest('.layout-container');
                    if ($parent.hasClass('layout-row')) {
                        elementType = this.containerTypes.Row.value;
                    } else if ($parent.hasClass('layout-panel')) {
                        elementType = this.containerTypes.Panel.value;
                    } else if ($parent.hasClass('layout-column')) {
                        elementType = this.containerTypes.Column.value;
                    }
                }
                return elementType;
            },
            getMediaSize: function () {
                var containerWidth = $('.container').width();
                var singleCol = (containerWidth / 12);
                SunGard.Common.ConsoleLog('getMediaSize: ' + singleCol);
                return singleCol;
            },
            checkColumnLimit: function ($src) {
                // Store a reference to the widget
                var self = this;
                if (!$src.hasClass('layout-container-add-container'))
                    $src = $src.closest('.layout-container-add-container');

                var $srcPanel = $src.parents('.panel');
                // Find the column container element
                var $container = $srcPanel.find('.panel-body:first .row');
                // Determine the current number of columns
                var currentCols = $container.find('.layout-column').length;

                if (currentCols >= self.options.columnLimit) {
                    $src.addClass('disabled').prop('disabled', 'disabled');
                } else {
                    $src.removeClass('disabled').prop('disabled', '');
                }
            },
            // Method: _isPageValid
            //  Private method to determine if all data on the page is valid.  It locates the closest form and validates it.  If the form is not valid, a dialog box is displayed.
            _isPageValid: function () {
                var $form = this.element.closest('form');
                var isValid = true;
                // Detemine if we have a form
                if ($form.length > 0) {
                    isValid = $form.valid();
                    // If the form isn't valid
                    if (!isValid) {
                        // Determine if the dialog box has been initialized
                        if ($("#cannotEditLayout").length === 0) {
                            // Initialize the dialog box
                            SunGard.Bootstrap.Dialog.InitializeDialog("cannotEditLayout", SunGard.Common.GetResourceString("CannotEditLayout_InvalidForm_Title"), SunGard.Bootstrap.Dialog.ButtonSets.OkOnly, null, SunGard.Common.GetResourceString("CannotEditLayout_InvalidForm"));
                        }
                        // Show the alert
                        SunGard.Bootstrap.Dialog.ShowAlert("cannotEditLayout");
                    }
                }
                // Return the result
                return isValid;
            },
            // Method: toggleRootEditMode
            //  Method used to toggle the dynamic portion of the page into edit mode
            toggleRootEditMode: function (e) {
                if (this.element.hasClass('edit-mode') && this._privateVars.hasBeenChanged) {
                    window.location.reload();
                } else {
                    if (this._isPageValid()) this.toggleEditMode(e);
                }
            },
            // Method: toggleEditMode
            //  Method used to start the toggle process
            toggleEditMode: function (e) {
                var self = this;

                // Determine if edit mode has been enabled
                var editMode = !self.element.hasClass('edit-mode');

                // Locate all child containers, and toggle the edit mode of each
                $(self.element).children('.layout-container').each(function (idx, ele) { self.toggleContainer($(ele), editMode); });

                // Locate all child widgets, and toggle the edit mode of each
                $(self.element).children('.layout-container-widget').children('.layout-widget').each(function (idx, ele) { self.toggleWidget($(ele), editMode); });


                // If we're in edit mode
                if (editMode) {
                    // Page Options
                    $(self.options.saveElement).parent().removeClass('disabled');
                    //$(self.options.revertElement).parent().removeClass('disabled');
                    $(self.options.addRowElement).parent().removeClass('disabled').on('click', $.proxy(self.addContainer, self));
                    $(self.options.editModeElement).text('Discard Changes');

                    // Enable the sorting of the rows
                    $(self.element).sortable({ handle: '.layout-container-header:first', start: $.proxy(self._layoutWidgetStartSort, self), placeholder: 'layout-widget-placeholder', opacity: '0.5', helper: 'clone' }).disableSelection();

                } else {
                    // Destroy the sortable functionality of the rows
                    $(self.element).sortable('destroy');

                    // Page Options
                    $(self.options.saveElement).parent().addClass('disabled');
                    //$(self.options.revertElement).parent().addClass('disabled');
                    $(self.options.addRowElement).parent().addClass('disabled').off('click', $.proxy(self.addContainer, self));
                    $(self.options.editModeElement).text(SunGard.Common.GetResourceString('EnableEdit'));
                }

                // Toggle the edit-mode on any dynamic layout container
                self.element.toggleClass('edit-mode');
            },
            // Method: toggleContainer
            //  Method used to toggle the edit mode of a layout container(Row, Panel, Column)
            toggleContainer: function ($container, editMode) {
                var self = this;
                var $body;
                var $header;
                var handles = null;
                var connectWith = null;
                var sortableOptions = { start: $.proxy(self._layoutWidgetStartSort, self), placeholder: 'layout-widget-placeholder', helper: 'clone', opacity: '0.5' }

                SunGard.Common.ConsoleLog('toggleContainer:  ' + $container[0].className);
                var $parentContainer = $container.parents('.layout-container');
                if ($container.hasClass('layout-row')) {
                    connectWith = '.row.layout-container > .layout-container-body';
                    handles = '.panel > .panel-heading, .row-item-handle';
                } else if ($container.hasClass('layout-column')) {
                    connectWith = ".layout-column > .layout-container-body";
                    handles = '.layout-widget > .layout-widget-header';
                }

                // Determine the type of container we're dealing with
                if ($container.hasClass('layout-panel')) {
                    $body = $container.children('.panel').find('.panel-body:first').children('.row');
                    $header = $container.children('.panel').children('.panel-heading');
                    handles = ".layout-container-header";
                    sortableOptions['axis'] = 'x';

                    // If editing is enabled
                    if (editMode) {
                        // Determine the size of a single bootstrap column at the current screen size
                        var increment = self.getMediaSize();
                        // Determine the maximum size that a Column Container may be
                        var maxWidth = (increment * 12);

                        // Enable resizing on the column container
                        $container.resizable({ minWidth: increment, maxWidth: maxWidth, start: $.proxy(self._startResize, self), stop: $.proxy(self._stopResize, self), handles: "e" });

                        // Hide any existing buttons
                        $('.btn-group', $header).addClass('hidden');
                        // Add buttons to the column container
                        $('.panel-title', $header).append(self.editModePanelButtons.ToString());

                        //handles = $body.children('.layout-container').children('.layout-container-header');
                    } else {
                        // Destroy the resize functionality of the column container
                        $container.resizable('destroy');
                        // Remove the button group in the column container
                        $('.layout-editor-btn-grp', $header).remove();
                        // Show and existing buttons that are not specific to edit mode
                        $('.editable-panel .btn-group', $container).removeClass('hidden');
                    }
                } else {
                    $header = $container.children('.layout-container-header');
                    $body = $container.children('.layout-container-body');
                }

                this.toggleButtons($header, editMode);
                SunGard.Common.ConsoleLog('    Handles: ' + handles);
                if (editMode) {
                    sortableOptions['handle'] = handles;
                    if (connectWith !== null) sortableOptions['connectWith'] = connectWith;
                    $body.sortable(sortableOptions).disableSelection();

                } else {
                    $body.sortable('destroy');
                }

                // Locate containers in this container
                $body.children('.layout-container').each(function (idx, ele) { self.toggleContainer($(ele), editMode); });

                // Locate any widgets in this container
                $body.children('.layout-container-widget').children('.layout-widget').each(function (idx, ele) { self.toggleWidget($(ele), editMode); });

            },
            // Method: toggleWidget
            //  Method used to toggle the edit mode of a widget
            toggleWidget: function ($widget, editMode) {
                var self = this;

                var $header = $widget.children('.layout-widget-header');
                self.toggleButtons($header, editMode);

                var $parent = $widget.parent();

                if ($parent.hasClass('resizable-container')) {
                    // Determine the size of a single bootstrap column at the current screen size
                    var increment = self.getMediaSize();
                    // Determine the maximum size that a Column Container may be
                    var maxWidth = (increment * 12);

                    $parent.resizable({ minWidth: increment, maxWidth: maxWidth, start: $.proxy(self._startResize, self), stop: $.proxy(self._stopResize, self), handles: "e" });
                }
            },
            // Method: toggleButtons
            //  Method used to toggle the edit mode of the buttons in various containers and widgets
            toggleButtons: function ($container, editMode) {
                var self = this;
                if (editMode) {
                    $('.layout-container-delete', $container).on('click', $.proxy(self.deleteContainer, self));
                    $('.layout-container-add-container', $container).on('click', $.proxy(self.addContainer, self));
                    $('.layout-container-add-item', $container).on('click', $.proxy(self.beforeOpenAddWidgetDialog, self));
                    $('.layout-container-edit', $container).on('click', $.proxy(self.editPanel, self));

                } else {
                    $('.layout-container-delete', $container).off('click', $.proxy(self.deleteContainer, self));
                    $('.layout-container-add-container', $container).off('click', $.proxy(self.addContainer, self));
                    $('.layout-container-add-item', $container).off('click', $.proxy(self.beforeOpenAddWidgetDialog, self));
                    $('.layout-container-edit', $container).off('click', $.proxy(self.editPanel, self));
                }
            },

            // Method: deleteContainer
            //  Method used to remove a container from the layout
            deleteContainer: function (e) {
                // Indicate that the layout has changed
                this._privateVars.hasBeenChanged = true;
                var self = this;
                // Locate the current target
                var $target = $(e.target).closest('.layout-container, .layout-container-widget');
                var $parent = null;
                // If the container is a column
                if ($target.hasClass('layout-column')) {
                    // Locate the closest row
                    $parent = $target.closest('.row');
                    // Compute the current column count in the parent row
                    var currentColCount = $parent.children('.layout-column').length;
                    // Determine the current bootstrap class
                    var currentColClass = self.options.bootstrap_size_class + (12 / currentColCount);
                    // Determine the new bootstrap class
                    var newColClass = self.options.bootstrap_size_class + (12 / (currentColCount - 1));

                    // Find all columns in the parent row, remove the old bootstrap class, and add the new bootstrap class
                    $parent.children('.layout-column').removeClass(currentColClass).addClass(newColClass);
                }
                // Remove the indicated container
                $target.remove();
                // If the target is a column
                if ($target.hasClass('layout-column')) {
                    // Update the button information
                    this.checkColumnLimit($parent.closest('.panel').children('.panel-heading').find('.layout-container-add-container:first'));
                }
            },

            // Method: addContainer
            //  Method used to add a container to the layout
            addContainer: function (e) {
                this._privateVars.hasBeenChanged = true;
                var self = this;
                var $src = $(e.target);
                var $parentContainer = $src.parents('.layout-container:first');
                var $parent = null;
                var newContainer;
                var containerType = this.containerTypes.Column.value;
                var newBody = null;
                var panelId = null;

                // toggle edit mode during the add
                this.toggleEditMode();

                // If no parent container can be found, we're adding a new row
                if ($parentContainer.length === 0) {
                    containerType = this.containerTypes.Row.value;
                    $parentContainer = self.element;
                    $parent = $parentContainer;
                } else {
                    // If the parent is a row
                    if ($parentContainer.hasClass('layout-row')) {
                        // We're adding a panel
                        containerType = this.containerTypes.Panel.value;
                        $parent = $('.layout-container-body:first', $parentContainer);
                    } else {
                        // We're adding a column
                        $parent = $('.panel-body:first .row:first', $parentContainer);
                    }
                }
                // Create the new body for the container
                newBody = SunGard.Common.Html.TagBuilder('div').AddCssClass('layout-container-body').ToString();
                if (containerType === this.containerTypes.Row.value) {
                    // Create the container for a row
                    newContainer = SunGard.Common.Html.TagBuilder("div").AddCssClass('layout-container row layout-row').MergeAttribute('data-container-type', this.containerTypes.Row.value);
                }
                else if (containerType === this.containerTypes.Panel.value) {
                    // Create the container for a panel
                    newContainer = SunGard.Common.Html.TagBuilder("div").AddCssClass('layout-container layout-panel resizable-container ' + self.options.bootstrap_size_class + "6")
                            .MergeAttribute("data-start-size", self.options.bootstrap_size_class + "6").MergeAttribute('data-container-type', this.containerTypes.Panel.value);

                    // Determine the new panel ID
                    var $panels = self.element.find('.panel[id*="dynamic-panel-"]');
                    panelId = "dynamic-panel-" + ($panels.length);

                    // Create a new body for the panel
                    newBody = SunGard.Common.Html.PanelExtensions.SunGardPanel(SunGard.Common.Html.PanelLevel.Level1, SunGard.Common.GetResourceString("DefaultNewCardTitle"), panelId);
                    var $tmpBody = $(newBody);
                    var $panelBody = $tmpBody.find('.panel-body');
                    $panelBody.append(SunGard.Common.Html.TagBuilder('div').AddCssClass('row').ToString());
                    newBody = $tmpBody[0].outerHTML;

                }
                else if (containerType === this.containerTypes.Column.value) {
                    // Create the container for a column
                    newContainer = SunGard.Common.Html.TagBuilder("div").AddCssClass('layout-container layout-column').MergeAttribute('data-container-type', this.containerTypes.Column.value);

                    // Determine the current number of columns
                    var currentColCount = $parent.children('.layout-column').length;
                    // Determine the current bootstrap class for the existing columns in this panel
                    var currentColClass = self.options.bootstrap_size_class + (12 / currentColCount);
                    // Determine the new bootstrap class for all columns in this panel
                    var newColClass = self.options.bootstrap_size_class + (12 / (currentColCount + 1));
                    newContainer.MergeAttribute('data-start-size', newColClass);

                    newContainer.AddCssClass(newColClass);

                    // Update all columns in the panel, removing the old bootstrap class, adding the new bootstrap class, and updating the start-size data element
                    $parent.children('.layout-column').removeClass(currentColClass).addClass(newColClass).data('start-size', newColClass);
                }

                // Update the new container to container a header and the new body
                newContainer.SetInnerHtml(this._createHeader(containerType) + newBody);

                // Add the new container to the parent
                $parent.append(newContainer.ToString());

                // Toggle the edit mode
                this.toggleEditMode();

                // If we were dealing with a column
                if (containerType === this.containerTypes.Column.value) {
                    // Update the parent buttons
                    this.checkColumnLimit($parent.closest('.panel').children('.panel-heading').find('.layout-container-add-container:first'));
                } else if (containerType === this.containerTypes.Panel.value) {
                    // If we were dealing with a panel, trigger the add button to automatically add a column
                    $('#' + panelId).children('.panel-heading').find('.layout-container-add-container').trigger('click');
                }
            },

            // Event handler used to edit a panel, specifically the title of the panel
            editPanel: function (e) {
                // Store a reference to the widget
                var self = this;
                self.editContainerEvent = e;

                var $panel = $(e.target).parents('.panel');
                var $title = $panel.find('.panel-title:first a');
                self.getPanelName($title.text());
            },

            // Method used to update the name of an existing panel, or add a new panel using the name entered in the dialog
            setPanelName: function () {
                this._privateVars.hasBeenChanged = true;
                // Store a reference to the widget
                var self = this;
                // Get the updated panel title
                var panelTitle = $('#setPanelName').val();

                // Locate the indicated panel
                var $panel = $(self.editContainerEvent.target).closest('.panel');
                // Locate the title element
                var $title = $panel.find('.panel-title:first a');
                // Update the title value
                $title.text(panelTitle);

                // Force event elements to false
                self.editContainerEvent = null;
            },

            // Method used to show the dialog that allows a panel title to be entered
            getPanelName: function (panelName) {
                // Store a reference to the widget
                var self = this;
                if (panelName === undefined && panelName === null) {
                    panelName = "";
                }
                $('#setPanelName').val(panelName);
                SunGard.Bootstrap.Dialog.ShowDialog(self.options.editPanelDialogName);
            },

            // Method: processSelectedWidget
            //  Method used to process a selected widget in the add widget dialog
            processSelectedWidget: function () {
                // Store a reference to the widget
                var self = this;
                var $col = $(self.editContainerEvent.target).parents('.layout-widget-col');
                var $body = $col.find('.layout-widget-col-body');

                self.editContainerEvent = null;
                var selectedData = $('#widgetSelector').select2('data');
                var selectedValue = selectedData.id;
                var selectedText = selectedData.text;
                var selectedWidget = this.findWidget(selectedValue);


                if (self.options.addWidgetDialog.widgetBuilder !== null && typeof self.options.addWidgetDialog.widgetBuilder === 'function') {
                    self.addWidget(self.options.addWidgetDialog.widgetBuilder(selectedWidget, selectedText), $body);
                } else {
                    // Complain
                    alert('A widget builder was not provided(option: widgetBuilder).');
                }
            },

            // Method: addWidget
            //  Method used to process add widget requests.
            addWidget: function (widget, parentElement) {
                this._privateVars.hasBeenChanged = true;
                // Store a reference to the widget
                var self = this;
                if (parentElement === undefined || parentElement === null) parentElement = self.activeElement;
                var $parentElement = $(parentElement);
                var $container = $(parentElement).closest('.layout-container');
                var $widgetContainer = $(widget);
                $parentElement.append($widgetContainer);

                var $widget = $widgetContainer.children('.layout-widget');
                self.toggleWidget($widget, true);
                SunGard.Bootstrap.Init();
                self._trigger('widgetAdded', null, { newElement: $widget });
            },
            // Method: cancelWidgetAdd
            //  Event Handler used when the user cancel's the addition of a new widget
            cancelWidgetAdd: function () {
                // Store a reference to the widget
                var self = this;
                _addEvent = null;
            },
            // Method: beforeOpenAddWidgetDialog
            //  Default event handler for when a user wants to open the Add Widget dialog.  Allows for customization of the Add Dialog window.
            //  This method triggers the 'openAddWidgetDialog' method, which can be overriden in inherited objects and a custom event handler can be provided on initialization.
            beforeOpenAddWidgetDialog: function (e) {
                // Store a reference to the widget
                var self = this;
                self.editContainerEvent = e;
                var $src = $(self.editContainerEvent.target);
                var $col, $body;
                var $container = $src.closest('.layout-container');
                $body = $container.children('.layout-container-body');
                self.activeElement = $body;

                self._trigger("openAddWidgetDialog", e, {});
            },
            // Method: openAddWidgetDialogDefault
            //  Default event handler for the 'openAddWidgetDialog' event
            openAddWidgetDialogDefault: function (e) {
                // Store a reference to the widget
                var self = this;
                SunGard.Bootstrap.DropDownList.Init($('#addWidgetDialog'));
                SunGard.Bootstrap.Dialog.ShowDialog('addWidgetDialog');
            },
            // Method: pageId
            //  Method used to retrieve the page id used to identify this layout
            pageId: function () {
                return this.options.pageId;
            },

            // Method: findWidget
            //  Method used to find and available widget by ID
            findWidget: function (widgetId) {
                var result = null;
                $.each(this.options.availableWidgets, function (index, value) {
                    var checkValue = value['WidgetId'];

                    if (checkValue === widgetId) {
                        result = value;
                        return false; // returns from the each
                    }
                });
                return result;
            },
            // Method: revertLayout
            //  Event handler used to revert the current layout to it's default values
            revertLayout: function (e) {
                this.saveLayout(e, true);
            },
            // Method: saveLayout
            //  Method used to save layout changes to the database.
            saveLayout: function (e, revert) {
                // If the revert parameter wasn't passed, set it to false
                if (revert === undefined || revert === null) revert = false;
                // Create the initial layout object
                var layoutObject = [];
                // If we are not reverting the layout, parse the existing layout
                if (!revert) layoutObject = this.parseLayout(this.element, 0);
                // Create the postData object
                var postData = {
                    layoutItems: layoutObject,
                    pageId: this.options.pageId,
                    revert: revert
                }

                // Define the url for saving the layout
                var url = SunGard.Common.RootURL() + "/DynamicLayout/SaveDynamicLayout";

                // Ajax post to save the layout
                SunGard.Common.AjaxPost(url, postData, $.proxy(this.saveLayoutPostback, this),
                        function (jqXHR, textStatus, errorThrown) {
                            alert("jqXHR" + jqXHR + "  Status: " + textStatus + "  error: " + errorThrown);
                        }
                    );
            },

            // Method: saveLayoutPostback
            //  Callback method used to reload the page after the layout as been saved.
            saveLayoutPostback: function (data) {
                window.location.reload();
            },
            // Method: parseLayout
            //  Recurssive method use to build the object structure that defines this layout.
            //  Collects all container and widget information needed to save and instance the layout.
            parseLayout: function (rootElement, depth) {
                var self = this;
                var layoutItems = [];
                var logPadding = depth === 0 ? '' : new Array(depth + 1).join('  ');
                var pageId = self.options.pageId;
                SunGard.Common.ConsoleLog(logPadding + 'Parsing Layout');
                SunGard.Common.ConsoleLog(logPadding + '  Root: id=' + rootElement.attr('id') + '  class=' + rootElement.attr('class'));

                // Determine the body for the current element
                var $body = rootElement;
                if (depth > 0) {
                    if (rootElement.hasClass('layout-panel')) {
                        $body = $('.panel-body:first', rootElement);
                    } else {
                        $body = $('.layout-container-body:first', rootElement);
                    }
                }
                SunGard.Common.ConsoleLog(logPadding + '  body class: ' + $body.attr('class'));
                // Determine the containers that need to be processed
                var $containers;
                if (rootElement.hasClass('layout-panel')) {
                    $containers = $body.children('.row').children('.layout-container, .layout-container-widget');
                } else {
                    $containers = $body.children('.layout-container, .layout-container-widget');
                }

                SunGard.Common.ConsoleLog(logPadding + '  Containers: ' + $containers.length)

                // For each container
                $containers.each(function (idx, ele) {
                    var $container = $(ele);
                    // Initialize the layout object
                    var layoutEntry = {
                        LayoutItem: {
                            ContainerTypeId: -1,
                            Width: 12,
                            Title: '',
                            Order: 1,
                            WidgetId: null,
                            InstanceId: null,
                            PageId: pageId,
                            LayoutId: null,
                            ParentLayoutId: null
                        },
                        Settings: null,
                        Children: null
                    };

                    // Set container type
                    layoutEntry.LayoutItem.ContainerTypeId = $container.data('container-type');
                    // Set Order
                    layoutEntry.LayoutItem.Order = idx + 1;

                    // If we're not dealing with a Row container
                    if (layoutEntry.LayoutItem.ContainerTypeId !== 4) {
                        // Set the width
                        layoutEntry.LayoutItem.Width = parseInt($container.data('start-size').replace(/^(?:col-)(?:\w{2}-)(\d*)$/i, '$1'), 10);
                    }

                    // If we're dealing with a widget
                    if (layoutEntry.LayoutItem.ContainerTypeId === 1) {
                        var $layoutWidget = $container.children('.layout-widget');
                        layoutEntry.LayoutItem.WidgetId = $layoutWidget.data('widget-id');
                        layoutEntry.LayoutItem.InstanceId = $layoutWidget.data('widget-instance-id');
                        if ($container.data($container.data('sg-widget-name')) != undefined) {
                            layoutEntry.Settings = $container.data($container.data('sg-widget-name')).getSettings();
                        }
                    } else if (layoutEntry.LayoutItem.ContainerTypeId === 3) {
                        var $panelTitle = $container.find('.panel:first > .panel-heading > .panel-title > a');
                        layoutEntry.LayoutItem.Title = $.trim($panelTitle.text());
                    } else {
                        // It's not a widget.  Locate the title.
                        var $headerTitle = $container.children('.layout-container-header').children('.layout-widget-col-header-title');
                        layoutEntry.LayoutItem.Title = $.trim($headerTitle.text());
                    }

                    // Generate the layout for any child elements of this element
                    layoutEntry.Children = self.parseLayout($container, depth + 1)

                    // Add the current layout entry to the list
                    layoutItems.push(layoutEntry);
                });

                // Return the goodies
                return layoutItems;
            },

            // Method: getParentContainerType
            //  Determines the container type of the closest container to the provided widget
            getParentContainerType: function ($widget) {
                var $parentContainer = $widget.closest('.layout-container');
                if ($parentContainer.hasClass('layout-row')) {
                    return "Row";
                }
                if ($parentContainer.hasClass('layout-panel')) {
                    return "Panel";
                }
                if ($parentContainer.hasClass('layout-column')) {
                    return "Column";
                }
                return "Unknown";
            },

            // Method: registerWidgets
            //  Method used to force all active widgets to register themselves with the layout
            registerWidgets: function () {
                var self = this;
                // Locate the closest form
                var $form = this.element.closest('form');
                // If a form exists
                if ($form.length > 0) {
                    // If unobtrusive validation has been initialized on the form
                    if ($form.data('validator') !== undefined) {
                        SunGard.Common.ConsoleLog('Register Widgets');
                        // Find all widgets within the layout
                        var $widgets = $('.layout-widget', this.element);
                        this._privateVars.initialWidgetCount = $widgets.length;
                        // Process widgets
                        $widgets.each(function (idx, ele) {
                            var $widget = $(ele).parent();
                            // Determine the exact type of this widget
                            var widgetObject = $widget.data($widget.data('sg-widget-name'));
                            // Force the widget to register
                            widgetObject.registerWithLayout();
                        });
                    } else {
                        // The form isn't ready for registration yet.  Wait a bit, and try again
                        window.setTimeout($.proxy(self.registerWidgets, this), 100);
                    }
                }
            },
            // Method: registerWidget
            //  Method that widgets use to register themselves with the layout
            registerWidget: function () {
                // Increment the number of existing widgets
                this._privateVars.registeredWidgets += 1;

                // If validation hasn't been initialized yet
                if (!this._privateVars.validationInitialized) {
                    // If all widgets have registered
                    if (this._privateVars.registeredWidgets === this._privateVars.initialWidgetCount) {
                        // Indicate that validation has been initialized
                        this._privateVars.validationInitialized = true;
                        // Find the form
                        var $form = this.element.closest('form');
                        // If a form exists, intiialize validation
                        if ($form.length > 0) SunGard.Common.Validation.Init($form);
                    }
                }
            }
        });
})(jQuery, window, document);
