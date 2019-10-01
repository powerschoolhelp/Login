// NOTE: Code changes to the core JQGRID file is required for this extenion set to work.  Without those changes, and error will be genereted when attempting to call base methods in JQGRID.
// Required Modification(jquery.jqGrid.js)
// 1) Store the method assigned to $.fn.jqGrid in a variable.
// 2) Replace all uses of $.fn.jqGrid in the file with the variable.
// 3) Set $.fn.jqGrid equal to the variable
//
// This allows us to override the default jqGrid method, but still access it internally in the jqGrid file.

// Add some options
$.extend($.jgrid.defaults, {
    sg_autoResize: true,                // Enable auto-resizing
    sg_enableHeightResize: false,       // Should the height of the grid resize based on the available screen space
    sg_minGridHeight: 200,              // Set a minimum grid height
    sg_percentGridHeight: 100,          // Percentage of available space that grid should consume
    sg_CustomHeightCalc: null,          // Custom height calculation to use for this grid
    sg_autoWidth: true,                 // Indicates if the column widths should be adjusted when the available width changes
    sg_blankRowOnAdd: false,            // Indicates if a blank row should be added to the bottom of the grid when adding data to the current bottom record.
    sg_blankRowData: null,              // Blank data or function used to get the blank data for the new row
    sg_blankRowAddFromTop: false,       // Indicates if the blank row to be added should be added to the top instead of the bottom
    sg_blankRowCheckForLastRow: null,   // Function that returns true if current row is blank.
    sg_arrowKeyNavigation: true,        // Indicates if CTRL+<arrow key> navigation should be enabled.
    sg_arrowToDisabled: false,          // Indicates if CTRL+<arrow key> navigation takes user to disabled fields.
});

// Extend jqGrid to handle resizing
$.jgrid.extend({

    // configures the auto new-row fuctionality
    configureNewRowOnAdd: function () {
        var $grid = this,
            addBlankRow = $grid.jqGrid('getGridParam', 'sg_blankRowOnAdd'),
            blankData = $grid.jqGrid('getGridParam', 'sg_blankRowData'),
            addFromTop = $grid.jqGrid('getGridParam', 'sg_blankRowAddFromTop');

        if (addBlankRow && blankData !== null) {
            var $frozenGrid = $("#" + $grid.attr('id') + "_frozen");

            if (addFromTop) {
                // when adding a row from the top, we want to make events that act like a typewriter would - click, click, click, ding!
                $grid.on('keydown', 'input, select, textarea', function (e) {
                    if (e.keyCode == 9) {
                        // is the input in the last column ?
                        var columns = $(e.target).closest('tr').find('td');
                        var lastColumn = columns.length;
                        var columnIndex = $(e.target).closest('td')[0].cellIndex + 1;
                        ;
                        if (columnIndex == lastColumn) {
                            // when TAB is pressed, while the focused on an input/cell in the last column, create a new row
                            $grid.jqGrid('addNewBlankRow', e, this, blankData, $grid);
                            e.preventDefault();
                        }
                    }
                });
            }
            else {
                $grid.on('change', 'input, select, textarea', function (e) {
                    $grid.jqGrid('addNewBlankRow', e, this, blankData, $grid);
                })
                .on('click', 'div.sg-advanced-search-input span', function (e) {
                    $grid.jqGrid('addNewBlankRow', e, this, blankData, $grid);
                })
                .on('dp.show', 'div.sg-timepicker', function (e) {
                    $grid.jqGrid('addNewBlankRow', e, this, blankData, $grid);
                });

                $frozenGrid.on('change', 'input, select, textarea', function (e) {
                    $grid.jqGrid('addNewBlankRow', e, this, blankData, $grid);
                })
                .on('click', 'div.sg-advanced-search-input span', function (e) {
                    $grid.jqGrid('addNewBlankRow', e, this, blankData, $grid);
                })
                .on('dp.show', 'div.sg-timepicker', function (e) {
                    $grid.jqGrid('addNewBlankRow', e, this, blankData, $grid);
                });
            }

            // find the blank row.
            var $blankRow = null,
                $blankFrozenRow = null;
            checkToAddRowFunc = $grid.jqGrid('getGridParam', 'sg_blankRowCheckForLastRow');
            if (typeof checkToAddRowFunc === "undefined" || checkToAddRowFunc === null || !$.isFunction(checkToAddRowFunc)) {
                if (addFromTop) {
                    $blankRow = $grid.find('tr.jqgrow:first');
                    $blankFrozenRow = $frozenGrid.find('tr.jqgrow:first');
                }
                else {
                    $blankRow = $grid.find('tr.jqgrow:last');
                    $blankFrozenRow = $frozenGrid.find('tr.jqgrow:last');
                }
            } else {
                $grid.find('tr.jqgrow').each(function () {
                    var $row = $(this);
                    if (checkToAddRowFunc.apply(undefined, [null, $row])) {
                        $blankRow = $row;
                        $blankFrozenRow = $frozenGrid.find("#" + $row.attr('id'));
                        return;
                    }
                });
            }

            // add ignore class to all inputs, selects, and dropdowns on the last row.
            $blankRow.find('input, select, textarea').addClass('sg-disable-validation-newrow');
            $blankFrozenRow.find('input, select, textarea').addClass('sg-disable-validation-newrow');
        }
    },

    // adds a new row if the row being changed is the last row in the grid.
    addNewBlankRow: function (e, element, blankData, $grid) {
        var $this = $(element),
            $row = $this.closest('tr'),
            lastEditRow = $row.attr('id'),
            checkToAddRowFunc = $grid.jqGrid('getGridParam', 'sg_blankRowCheckForLastRow'),
            addFromTop = $grid.jqGrid('getGridParam', 'sg_blankRowAddFromTop');

        // if the function for checking if this is the new row is null, use a function that
        // just checks if row is the last child of the table.
        if (typeof checkToAddRowFunc === "undefined" || checkToAddRowFunc === null || !$.isFunction(checkToAddRowFunc)) {
            // check the add from top flag
            if (addFromTop) {
                checkToAddRowFunc = function () {
                    return $grid.find('tr.jqgrow:first').is($row);
                }
            } else {
                checkToAddRowFunc = function () {
                    return $grid.find('tr.jqgrow:last').is($row);
                }
            }
        }

        // if we are on the last row, add a new row
        if (checkToAddRowFunc.apply(undefined, [element, $row])) {
            var newData = null,
                newRowId = $grid.jqGrid('getRowData').length + 1;

            // remove the ignore validation class on the current last row.
            $row.find('.sg-disable-validation-newrow').removeClass('sg-disable-validation-newrow');

            if ($.isFunction(blankData)) newData = blankData.call();
            else newData = blankData;

            if ($grid.jqGrid('getGridParam', 'subGrid')) {
                $grid.jqGrid('addRowData', newRowId, newData);
            } else {
                if (addFromTop) {
                    $grid.jqGrid('addRowData', newRowId, newData, 'before', lastEditRow);
                } else {
                    $grid.jqGrid('addRowData', newRowId, newData, 'after', lastEditRow);
                }
            }

            // add the ignore validation class on the new last row.
            $("#" + newRowId, $grid).find('input, select, textarea').addClass('sg-disable-validation-newrow');

            // resize
            if ($grid.jqGrid('getGridParam', 'sg_autoResize')) {
                $grid.jqGrid('sgResizeGrid');
            }

            $grid.trigger('sg.afterNewRowAdded');

            if (addFromTop)
                // when adding to the top, move the focus to the first input, select, textarea, etc.
                $("#" + newRowId, $grid).find('.sg-disable-validation-newrow').first().focus();
        }
    },

    // Links to resize events for the grid
    linkResize: function () {
        // store link to this object
        var self = this;
        // Get auto resize value
        var sgAutoResize = self.jqGrid('getGridParam', 'sg_autoResize');
        // If we're auto-resizing this grid
        if (sgAutoResize) {
            var selector = '#' + self.attr('id');

            var resizeMe = function (e) { self.jqGrid('sgResizeGrid'); };
            // Tie grid resize to window resize
            $(window).off('resize.' + self.attr('id')).on('resize.' + self.attr('id'), resizeMe);

            // If the grid is inside any panels
            self.parents('.panel-collapse').each(function (idx, ele) {
                // When the panel is shown, resize the grid
                $(ele).off('shown.bs.collapse.' + self.attr('id')).on('shown.bs.collapse.' + self.attr('id'), resizeMe);
            });
            // Now force an initial resize
            self.jqGrid('sgResizeGrid');
        }
    },

    // Handles resizing the grid
    sgResizeGrid: function (e) {
        // reference this object
        var self = this;

        // Locate any parent panels
        var parentPanels = self.parents('.panel-collapse');
        // Initialize isCollapsed variable to false
        var isCollapsed = false;
        // Determine if any parent panel is collapsed.
        parentPanels.each(function (idx, ele) {
            if (!$(ele).hasClass('in')) isCollapsed = true;
        });

        // If nothing above is collapsed
        if (!isCollapsed) {
            // Handle resizing the height
            self.jqGrid('sgResizeGridHeight');

            // Handle resizing the width
            self.jqGrid('sgResizeGridWidth');

            self.find('.sg-delete-row:checked').trigger('change');
        }

        self.jqGrid('sgShowHideColumns');
    },

    // Show/Hide columns based on screen size
    sgShowHideColumns: function () {
        // Make sure SunGard.Bootstrap is loaded before trying to show/hide columns based on screen size
        if (SunGard !== undefined && SunGard.Bootstrap !== undefined &&
            SunGard.Bootstrap.GetPageSize !== undefined && $.isFunction(SunGard.Bootstrap.GetPageSize)) {
            var $self = this;
            var colModel = $self.getGridParam('colModel');
            var env = SunGard.Bootstrap.GetPageSize();

            $(colModel).each(function (index, item) {
                if (item.sgHidden) {
                    var hidden = [];
                    if (typeof item.sgHidden == 'string') hidden.push(item.sgHidden);
                    else hidden = item.sgHidden;

                    if ($.inArray(env, hidden) >= 0) {
                        $self.jqGrid('hideCol', item.name);
                    } else {
                        $self.jqGrid('showCol', item.name);
                    }
                }
            });
        }
    },

    // Handles resizing the grid's width
    sgResizeGridWidth: function () {
        var _topScrollbarHeight = 16;
        var self = this;

        if (self.prop('id').indexOf('_frozen') > -1) {
            return;
        }

        var parent = self.closest('.ui-jqgrid')[0];
        var includePadding = false;

        $(".sg-panel-2 > div > .panel-body > .ui-jqgrid:first-child, .sg-panel-3 > div > .panel-body > .ui-jqgrid:first-child").each(function () {
            if (parent === this)
                includePadding = true;
        });

        // Get the width of the grid's parent container
        var gridParentWidth = SunGard.Common.GetElementWidth($("#gbox_" + self.attr('id')).parent(), includePadding, false, false);

        var fullGridWidth = gridParentWidth;
        // Determine if the grid should have the columns shrink to fit the size of the grid
        var shrinkToFit = self.jqGrid('getGridParam', 'shrinkToFit');

        // Determine if Sungard AutoWidth is enabled
        var sgAutoWidth = self.jqGrid('getGridParam', 'sg_autoWidth');

        // If it's not enabled
        if (!sgAutoWidth) {
            // Locate the column model
            var colModel = self.jqGrid('getGridParam', 'colModel');
            // If we have a column model
            if (colModel !== undefined && colModel !== null) {
                // Determine if the grid can be scrolled vertically
                // Set the initial width value.  If the grid is currently vertically scrollable, account for the scrollbar
                fullGridWidth = 0;
                var container = self.closest('.ui-jqgrid-bdiv');
                if (container[0].scrollHeight > container[0].clientHeight)
                    fullGridWidth = 17;
                // Loop through each column and add it's width;
                for (colCtr = 0; colCtr < colModel.length; colCtr++) {
                    if (!colModel[colCtr].hidden) {
                        var colWidth = parseInt(colModel[colCtr].width, 10);

                        if (colWidth !== undefined && colWidth !== null) fullGridWidth += colWidth;
                    }
                }
            }

            if (fullGridWidth < gridParentWidth)
                gridParentWidth = fullGridWidth;
        }

        // Set the grid's width to its parent container's width
        self.setGridWidth(gridParentWidth, shrinkToFit);

        // For some reason, jqGrid does not resize the footer/pager row when calling setGridWidth, so we do it manually
        var bdivWidth = self.closest('.ui-jqgrid-bdiv:not(.frozen-bdiv)').width();
        var $pager = $('.ui-jqgrid-pager', $(parent));
        if ($pager.length) {
            if (self.width() < bdivWidth)
                $pager.width(self.width());
            else
                $pager.width(bdivWidth);
        }

        // Do the same thing as above with the top pager
        var $toppager = $('.ui-jqgrid-toppager', $(parent));
        if ($toppager.length) {
            if (self.width() < bdivWidth)
                $toppager.width(self.width());
            else
                $toppager.width(bdivWidth);
        }

        // Do the same for the caption
        var $caption = $(".ui-jqgrid-titlebar", $(parent));
        if ($caption.length) {
            if (self.width() < bdivWidth) {
                $caption.width(self.width());
            } else {
                $caption.width(bdivWidth);
            }
        }

        //If exists, adjust top scrollbar to new width
        var $gridView = self.closest('.ui-jqgrid-view');
        var $topScrollWrapper = $('.sg-top-scroll-wrapper', $gridView);
        if ($topScrollWrapper.length) {

            //Set scrollbar wrapper to the visible width of the grid
            $topScrollWrapper.width($gridView.width());
            $('.sg-top-scroll-content', $topScrollWrapper).width(self.width());

            //If the visible width is greater than the content width of the grid, hide the top scrollbar and adjust position of frozen overlays
            if (self.width() <= $gridView.width()) {
                if ($topScrollWrapper.is(":visible")) {
                    $('.frozen-div.ui-jqgrid-hdiv, .frozen-bdiv.ui-jqgrid-bdiv', $gridView).css("top", "-=" + _topScrollbarHeight);
                    $topScrollWrapper.hide();
                }
            }
                //Show the top scrollbar and adjust position of frozen overlays
            else {
                if ($topScrollWrapper.is(":hidden")) {
                    $('.frozen-div.ui-jqgrid-hdiv, .frozen-bdiv.ui-jqgrid-bdiv', $gridView).css("top", "+=" + _topScrollbarHeight);
                    $topScrollWrapper.show();
                }
            }
        }

        var groupHeaders = self.getGridParam("groupHeader");
        if (groupHeaders != null) self.destroyGroupHeader().setGroupHeaders(groupHeaders);

    },

    // Handles resizing the grid's height
    sgResizeGridHeight: function () {

        // Reference to this object
        var self = this;

        // Determine if height resizing is enabled
        var sgHeightResizeEnabled = self.jqGrid('getGridParam', 'sg_enableHeightResize');

        // If height resizing is enabled
        if (sgHeightResizeEnabled) {
            // Determine if thiere is a custom calculation
            var customHeightCalc = self.jqGrid('getGridParam', 'sg_CustomHeightCalc');
            // Initialize the grid height variable
            var gridHeight;
            // If we have a custom height method
            if (customHeightCalc !== undefined && customHeightCalc !== null && typeof (customHeightCalc) === 'function') {
                // Call the custom method
                gridHeight = customHeightCalc.apply();
            } else {
                // Determine window height
                gridHeight = $(window).height();

                // Initialize the offset to 0
                var offset = 0;
                // For each banner being used
                $('.sg-banner-container, .sg-banner-container').each(function (idx, ele) {
                    // Increment the offset height
                    offset += $(ele).height();
                });

                // Remove the offset height
                gridHeight -= offset;

                // Determine the percentage of the remaining space that should be dedicated to the grid
                var sgPercentHeight = self.jqGrid('getGridParam', 'sg_percentGridHeight');
                // Detemine the space that should be dedicated to the grid
                gridHeight = gridHeight * (sgPercentHeight / 100);

                // Get the minimum height for this grid
                var sgMinHeight = self.jqGrid('getGridParam', 'sg_minGridHeight');

                // If the new height is less than the minimum, use the minimum
                if (gridHeight < sgMinHeight) gridHeight = sgMinHeight;
            }

            // Locate the grid container
            var gboxID = 'gbox_' + self.attr('id');
            var gbox = $('#' + gboxID);

            // Determine actual height if no scrolling
            var currentHeight = gbox.find('.ui-jqgrid-hdiv:first').height() + gbox.find('.ui-jqgrid-bdiv:first div').height();

            // Compare heights
            if (currentHeight < gridHeight)
                gridHeight = currentHeight;

            // Set the new height
            self.jqGrid('setGridHeight', gridHeight);
        }
    },

    configureArrowKeyNavigation: function () {
        var $grid = this;
        var useArrowKeyNavigation = $grid.jqGrid('getGridParam', 'sg_arrowKeyNavigation');

        if (typeof useArrowKeyNavigation === "boolean" && useArrowKeyNavigation) {
            var $frozenGrid = $("#" + $grid.attr("id") + "_frozen");

            $grid.on("keydown", "input, select, textarea", function (e) {
                var allowDefault = $grid.moveViaArrowKeys(e, this, $grid);
                return allowDefault;
            });

            $frozenGrid.on("keydown", "input, select, textarea", function (e) {
                var allowDefault = $grid.moveViaArrowKeys(e, this, $grid);
            });
        }
    },

    moveViaArrowKeys: function (e, element, $grid) {
        var ctrlKeyPressed = e.ctrlKey;

        if (ctrlKeyPressed) {
            var $element = $(element);
            var $currentCell = $element.closest("td");
            var $currentRow = $currentCell.closest("tr");

            switch (e.keyCode) {
                case 38:    // up arrow
                case 40:    // down arrow
                    $grid.verticalNavigation($element, $currentCell, $currentRow, $grid, e.keyCode === 40);
                    break;
            }
        }

        return true;
    },

    verticalNavigation: function ($element, $currentCell, $currentRow, $grid, moveDown) {
        var elementFound = false;
        var elementIndex = null;
        var cellIndex = $currentCell.index();
        var $newRow = null;
        var $newElement = null;
        var $newCell = null;
        var navigateToDisabled = $grid.jqGrid("getGridParam", "sg_arrowToDisabled");

        if (typeof navigateToDisabled !== "boolean") {
            navigateToDisabled = false;
        }

        $("input, select, textarea", $currentCell).filter(function (index, element) {
            var $element = $(element);
            if ($element.is(":visible")) {
                if ($element.hasClass("sg-select-box") && $element.hasClass("select2-offscreen")) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }).each(function (index, element) {
            if (element === $element[0]) {
                elementIndex = index;
                return false;
            }
        });

        if (elementIndex === null) {
            return;
        }

        while (!elementFound) {
            if (moveDown) {
                $newRow = $currentRow.next(".jqgrow");
                if ($newRow.length === 0) {
                    var $nextRows = $currentRow.nextUntil(".jqgrow");
                    if ($nextRows.length > 0) {
                        $newRow = $nextRows.last().next(".jqgrow");
                    }
                }
            } else {
                $newRow = $currentRow.prev(".jqgrow");
                if ($newRow.length === 0) {
                    var $prevRows = $currentRow.prevUntil(".jqgrow");
                    if ($prevRows.length > 0) {
                        $newRow = $prevRows.last().prev(".jqgrow");
                    }
                }
            }

            if ($newRow.length === 0) {
                elementFound = true;
            } else {
                $newCell = $("td", $newRow).eq(cellIndex);
                if ($newCell !== null && $newCell.length > 0) {
                    var $focusableElements = $("input, select, textarea", $newCell).filter(function (index, element) {
                        var $element = $(element);
                        if ($element.is(":visible")) {
                            if ($element.hasClass("sg-select-box") && $element.hasClass("select2-offscreen")) {
                                return false;
                            } else {
                                return true;
                            }
                        } else {
                            return false;
                        }
                    });
                    $newElement = $focusableElements.eq(elementIndex);

                    if ($newElement !== null && $newElement.length > 0) {
                        var applyFocus = true;
                        if (!navigateToDisabled) {
                            if ($newElement.is(":disabled")) {
                                applyFocus = false;
                            } else if ($newElement.hasClass("sg-text-readonly")) {
                                applyFocus = false;
                            } else if ($newElement.prop("readonly") === true) {
                                applyFocus = false;
                            } else if ($newElement.closest("td").children(".sg-deleted-cell-overlay").length > 0) {
                                applyFocus = false;
                            }
                        }

                        if (applyFocus) {
                            setTimeout(function () {
                                $newElement.focus();
                            }, 10);
                            elementFound = true;
                        }
                    }
                }
            }

            $currentRow = $newRow;
        }
    }
});


(function ($) {
    // Store reference to the base jqGrid method
    var basejqGrid = $.fn.jqGrid;
    var baseGridDestroy = $.fn.GridDestroy;
    var baseGridUnload = $.fn.GridUnload;
    var baseSortableRows = $.fn.sortableRows;
    var customGridComplete = null;
    // Override GridComplete method that contains the code we want executed for all grids
    var overrideGridComplete = function () {
        // Handle the delete trashcan icon if one exists
        var $grid = $(this);
        var $icon = $grid.closest('.ui-jqgrid').find('.sg-grid-header-delete-icon');
        var toggleMethod = function (e) {
            var checkboxes = $(".sg-delete-row:not(.sg-disable-validation-newrow)", $grid).not(":checked");
            var check = true;

            if (checkboxes.length === 0) {
                checkboxes = $(".sg-delete-row:not(.sg-disable-validation-newrow)", $grid);
                check = false;
            }

            checkboxes.each(function (index, checkbox) {
                var $checkbox = $(checkbox);

                if ($checkbox.hasClass("sg-suppress-strikeout")) {
                    $checkbox.prop("checked", check);
                    return;
                }
                if ((check && !$checkbox.is(":checked")) || (!check && $checkbox.is(":checked"))) {
                    $checkbox.trigger("click");
                }
            })
        };
        $icon.off('click.sg.headerdelete');
        $icon.on('click.sg.headerdelete', toggleMethod);

        var pin = $(this).jqGrid('getGridParam');
        if (pin.customGridComplete !== undefined && pin.customGridComplete !== null) {
            pin.customGridComplete.apply(this);
        }
    };

    // Override the base jqGrid method
    $.fn.jqGrid = function (pin) {
        var isMethodCall = (typeof pin === 'string');
        var returnValue;
        var args = Array.prototype.slice.call(arguments, 0);
        // If we're not dealing with a method
        if (!isMethodCall) {
            // hijack the gridComplete method if provided
            if (pin.gridComplete !== undefined && pin.gridComplete !== null) pin.customGridComplete = pin.gridComplete;
            pin.gridComplete = overrideGridComplete;
        }

        // Call the base method and store the return value
        returnValue = basejqGrid.apply(this, args);

        if (!isMethodCall) {
            // After parameter change events go here
            this.jqGrid('linkResize');
            this.jqGrid('configureNewRowOnAdd');
            this.jqGrid("configureArrowKeyNavigation");
        }

        // Return
        return returnValue;
    };

    $.jgrid.extend({
        GridDestroy: function () {
            var self = this;
            $(window).off('resize.' + self.attr('id'));

            // If the grid is inside any panels
            self.parents('.panel-collapse').each(function (idx, ele) {
                // When the panel is shown, resize the grid
                $(ele).off('shown.bs.collapse.' + self.attr('id'));
            });

            var args = Array.prototype.slice.call(arguments, 0);
            return baseGridDestroy.apply(this, args);
        },
        GridUnload: function () {
            var self = this;
            $(window).off('resize.' + self.attr('id'));

            // If the grid is inside any panels
            self.parents('.panel-collapse').each(function (idx, ele) {
                // When the panel is shown, resize the grid
                $(ele).off('shown.bs.collapse.' + self.attr('id'));
            });

            var args = Array.prototype.slice.call(arguments, 0);
            return baseGridUnload.apply(this, args);
        },
        sortableRows: function (opts) {
            baseSortableRows.apply(this, [opts]);
            return this.each(function () {
                var $t = this;
                $("tbody:first", $t).enableSelection();
            });
        }
    });
})(jQuery);
