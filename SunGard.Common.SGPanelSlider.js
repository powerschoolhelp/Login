(function ($, window, document, undefined) {
    $.widget("SunGard.sgpanelslider",
        {
            // Options
            options: {
                triggerSelector: '',
                hideSelector: '',
                cssClass: '',
                width: 'auto',
                beforeOpen: function () { return true; },
                afterOpen: function () { },
                beforeClose: function () { return true; },
                afterClose: function () { }
            },
            // Method: _create
            //  Method used to create the widget
            _create: function () {
                var self = this;
                $element = $(this.element);
                // Locate the parent panel
                var $panel = $element.parents('.panel');
                // Locate the collapsible area of the panel
                var $panelCollapse = $element.parents('.panel-collapse');
                // Locate the toggle used to collapse the panel
                var $panelToggle = $panel.find('a[href="#' + $panel.attr('id') + '-collapsible"]');
                // Locate the trigger and hider for the slider
                var $trigger = $(this.options.triggerSelector);
                var $hider = $(this.options.hideSelector);
                var $panelSliderInner = $('<div>', {
                    'class': 'panel-slider-inner'
                });
                var $panelSliderContents = $('<div>', {
                    'class': 'panel-slider-contents ' + this.options.cssClass,
                    'width': this.options.width
                });
                var hideSlider = $.proxy(function (e) {
                    var self = this;
                    var hideIt = true;

                    if (typeof (self.options.beforeClose) === 'function') {
                        hideIt = self.options.beforeClose.apply(self, [e]);
                    }
                    if (hideIt) {
                        $panelSliderInner.slideUp('fast', function () {
                            $panelSliderInner.hide(0);
                            if (typeof (self.options.afterClose) === 'function')
                                self.options.afterClose.apply();
                        });
                    }
                }, self);
                var showSlider = $.proxy(function () {
                    var self = this;
                    $panelSliderInner.slideDown('fast', function () {
                        if (typeof (self.options.afterOpen) === 'function')
                            self.options.afterOpen.apply();
                    });
                }, self);

                $element.addClass('panel-slider')
                    .contents().wrapAll($panelSliderContents)
                    .end()
                    .contents().wrapAll($panelSliderInner);

                $panelSliderInner = $('.panel-slider-inner', $element);
                $panelSliderContents = $('.panel-slider-contents', $panelSliderInner);

                // Create the trigger method for showing/hiding the slider
                var sliderTrigger = function (e) {
                    if ($panelSliderInner.is(':visible')) {
                        hideSlider(e);
                    } else {
                        if (typeof (self.options.beforeOpen) === 'function') {
                            if (self.options.beforeOpen.apply(self,[e])) {
                                showSlider();
                            }
                        } else {
                            showSlider();
                        }
                    }

                    e.preventDefault();
                };

                // Create the event on the trigger element
                $trigger.on('click', function (e) {
                    if (!$panelCollapse.hasClass('in')) {
                        $panelToggle.trigger('click');
                        window.setTimeout(sliderTrigger, 300, e);
                    } else {
                        sliderTrigger(e);
                    }
                });

                // If a hide selector exists
                if (this.options.hideSelector) {
                    // add the event to hide the element
                    $element.on('click', this.options.hideSelector, hideSlider);
                }

                // Add an event to the body that will close the slider if a click anywhere else is fired
                $('body').on('click', function (e) {
                    var $target = $(e.target);
                    if (
                        $panelSliderInner.is(':visible')
                            && !$target.is($panelSliderContents)
                            && !$.contains($panelSliderContents[0], $target[0])
                            && !$target.is($trigger)
                            && $trigger.length > 0
                            && !$.contains($trigger[0], $target[0])) {
                        sliderTrigger(e);
                    }
                });

                // Show the element
                $element.removeClass('hidden');
            }
        });
})(jQuery, window, document);
