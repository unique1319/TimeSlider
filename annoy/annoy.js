/**
 * @author wrh
 * @create 2018-02-02 15:10
 **/


;(function ($, window, document, undefined) {

    var Annoy = function (parent, options, callback) {
        this.parentId = parent.attr('id');
        this.params = {};
        this.params.slider = {};
        this.params.step = null;
        this.params.index = 3;
        this.params.index02 = 1;
        this.elements = {};
        this.elements.parent = parent;
        this.elements.control = {};
        this.defaults = {
            'width': 800,
            'height': 15,
            'scale_big': 5,
            'scale_small': 8,
            'scaleValueArray': ['2月2日', '2月3日', '2月4日', '2月5日', '2月6日', '2月7日'],
            'type': 1,
            'startDate': new Date(),
            'scale_small_time': 3,
            'scale_type': 'hh'
        };
        this.options = $.extend({}, this.defaults, options);
        this.callback = callback;
    }

    Annoy.prototype = {

        _init: function () {

            this.params.axle_radius = this.options.height;
            this.params.axle_radius_half = this.options.height / 2;

            this.params.slider.sizeExpan = 4;
            this.params.control_width = 30;
            this.params.control_width_half = this.params.control_width / 2;

            this.params.slider.radius = this.params.axle_radius_half + this.params.slider.sizeExpan;

            this.params.step = this.options.width * 0.98 / this.options.scale_big / this.options.scale_small;
            // this.params.slideStep = (this.options.width - this.params.slider.radius) / this.options.scale_big / this.options.scale_small;
            this.params.cell_num = this.options.scale_small * this.options.scale_big;

            this.elements.parent.css('position', 'absolute');


            this._createAxle();
            this._createSlider();
            this._createControl();
            this._createRuler();
            this._createSection();
            this._createScaleValue();
            this._createTip();

            if (this.options.type === 1) {
                this._createSlider02();
                this._createTip02();
            }

            if (this.options.type === 1) {
                this._initControlEventInType1();
            } else {
                this._initControlEvent();
            }

            this._sliderSlide();

            if (this.options.type === 1) {
                this._sliderSlide02();
            }
        },

        _createAxle: function () {
            this.elements.axle = $("<div class='annoy-axle'></div>");
            this.elements.axle.css({
                'width': this.options.width,
                'height': this.options.height
            })
            this.elements.parent.append(this.elements.axle);
        },

        _createControl: function () {
            this.elements.control.left = $("<div class='annoy-control-left'><div></div><div></div></div>");
            this.elements.control.right = $("<div class='annoy-control-right'><div></div><div></div></div>");
            this.elements.parent.append(this.elements.control.left);
            this.elements.parent.append(this.elements.control.right);

            this.elements.control.left.css({
                'width': this.params.control_width,
                'height': this.options.height + this.params.slider.sizeExpan * 2,
                'position': 'absolute',
                'top': 0 - this.params.slider.sizeExpan,
                'left': 0 - this.params.control_width - this.params.slider.sizeExpan,
                'z-index': 1000
            });
            this.elements.control.right.css({
                'width': this.params.control_width,
                'height': this.options.height + this.params.slider.sizeExpan * 2,
                'position': 'absolute',
                'top': 0 - this.params.slider.sizeExpan,
                'left': this.options.width + this.params.slider.sizeExpan,
                'z-index': 1000
            });

            var triangle_Width = this.params.axle_radius_half + this.params.slider.sizeExpan;

            $('.annoy-control-left div').css({
                'float': 'left',
                'width': '0',
                'height': '0',
                'border-top': triangle_Width + 'px solid transparent',
                'border-right': this.params.control_width_half + 'px solid rgba(42, 228, 255, 0.8)',
                'border-bottom': triangle_Width + 'px solid transparent'
            });
            $('.annoy-control-right div').css({
                'float': 'right',
                'width': '0',
                'height': '0',
                'border-top': triangle_Width + 'px solid transparent',
                'border-left': this.params.control_width_half + 'px solid rgba(42, 228, 255, 0.8)',
                'border-bottom': triangle_Width + 'px solid transparent'
            })
            ;
        },

        _initControlEventInType1: function () {
            var stepWidth = this.params.step;
            var $this = this;
            var num = this.params.cell_num;
            var sizeExpan = this.params.slider.sizeExpan;

            this.elements.control.left.click(function () {

                if ($this.params.index02 <= 0) {
                    return
                }

                $this.params.index--;
                $this.params.index = $this.params.index < 0 ? 0 : ($this.params.index > num ? num : $this.params.index);
                $this.params.index02--;
                $this.params.index02 = $this.params.index02 < 0 ? 0 : ($this.params.index02 > num ? num : $this.params.index02);

                $this._getTipText($this.params.index, $this, $('.annoy-tip .annoy-tip-text'));
                $this._getTipText($this.params.index02, $this, $('.annoy-tip02 .annoy-tip02-text'));

                var width = stepWidth * $this.params.index
                var left = width - sizeExpan;
                var width02 = stepWidth * $this.params.index02
                var left02 = width02 - sizeExpan;

                $('.annoy-section-active').animate({
                    left: left02
                }, 100);
                $('.annoy-slider').animate({
                    left: left
                }, 100);
                $('.annoy-slider02').animate({
                    left: left02
                }, 100)

            });
            this.elements.control.right.click(function () {

                if ($this.params.index >= num) {
                    return
                }


                $this.params.index++;
                $this.params.index = $this.params.index < 0 ? 0 : ($this.params.index > num ? num : $this.params.index);
                $this.params.index02++;
                $this.params.index02 = $this.params.index02 < 0 ? 0 : ($this.params.index02 > num ? num : $this.params.index02);

                $this._getTipText($this.params.index, $this, $('.annoy-tip .annoy-tip-text'));
                $this._getTipText($this.params.index02, $this, $('.annoy-tip02 .annoy-tip02-text'));

                var width = stepWidth * $this.params.index;
                var left = width - sizeExpan;
                var width02 = stepWidth * $this.params.index02;
                var left02 = width02 - sizeExpan;

                $('.annoy-section-active').animate({
                    left: left02
                }, 100);
                $('.annoy-slider').animate({
                    left: left
                }, 100);
                $('.annoy-slider02').animate({
                    left: left02
                }, 100)

            })
        },

        // _initControlEvent: function () {
        //
        //     var stepWidth = this.params.step;
        //     var slideStepWidth = this.params.slideStep;
        //     var position_Min = 0 - this.params.slider.sizeExpan;
        //     var position_Max = this.options.width - this.params.axle_radius - this.params.slider.sizeExpan;
        //
        //     var left_Min = 0 - this.params.slider.sizeExpan;
        //     var left_Max = this.options.width - this.params.axle_radius - this.params.slider.sizeExpan;
        //
        //     this.elements.control.left.click(function () {
        //         var width = $('.annoy-section-active').width() - stepWidth;
        //         width = width <= position_Min ? position_Min : (width >= position_Max ? position_Max : width);
        //         var left = parseInt($('.annoy-slider').css('left')) - slideStepWidth;
        //         left = left <= left_Min ? left_Min : (left >= left_Max ? left_Max : left);
        //
        //         $('.annoy-section-active').animate({
        //             width: width
        //         }, 100);
        //         $('.annoy-slider').animate({
        //             left: left
        //         }, 100)
        //
        //     });
        //     this.elements.control.right.click(function () {
        //         var width = $('.annoy-section-active').width() + stepWidth;
        //         width = width <= position_Min ? position_Min : (width >= position_Max ? position_Max : width);
        //         var left = parseInt($('.annoy-slider').css('left')) + slideStepWidth;
        //         left = left <= left_Min ? left_Min : (left >= left_Max ? left_Max : left);
        //
        //         $('.annoy-section-active').animate({
        //             width: width
        //         }, 100);
        //         $('.annoy-slider').animate({
        //             left: left
        //         }, 100)
        //
        //     })
        // },

        _initControlEvent: function () {
            var stepWidth = this.params.step;
            var $this = this;
            var num = this.params.cell_num;
            var sizeExpan = this.params.slider.sizeExpan;

            this.elements.control.left.click(function () {
                $this.params.index--;
                $this.params.index = $this.params.index < 0 ? 0 : ($this.params.index > num ? num : $this.params.index);

                var width = stepWidth * $this.params.index
                var left = width - sizeExpan;

                $('.annoy-section-active').animate({
                    width: width
                }, 100);
                $('.annoy-slider').animate({
                    left: left
                }, 100);
                $('.annoy-slider02').animate({
                    left: left
                }, 100);

            });
            this.elements.control.right.click(function () {
                $this.params.index++;
                $this.params.index = $this.params.index < 0 ? 0 : ($this.params.index > num ? num : $this.params.index);

                var width = stepWidth * $this.params.index;
                var left = width - sizeExpan;

                $('.annoy-section-active').animate({
                    width: width
                }, 100);
                $('.annoy-slider').animate({
                    left: left
                }, 100);
                $('.annoy-slider02').animate({
                    left: left
                }, 100);

            })
        },

        _createSlider: function () {
            this.elements.slider = $("<div class='annoy-slider'></div>");
            this.elements.slider.css({
                'width': this.options.height,
                'height': this.options.height,
                'border-radius': this.params.slider.radius,
                'position': 'absolute',
                'border': 'solid 4px white',
                'top': 0 - this.params.slider.sizeExpan,
                'left': this.params.index * this.params.step - this.params.slider.sizeExpan,
                'z-index': 999
            })
            this.elements.parent.append(this.elements.slider);
        },

        _createSlider02: function () {
            this.elements.slider_02 = $("<div class='annoy-slider02'></div>");
            this.elements.slider_02.css({
                'width': this.options.height,
                'height': this.options.height,
                'border-radius': this.params.slider.radius,
                'position': 'absolute',
                'border': 'solid 4px white',
                'top': 0 - this.params.slider.sizeExpan,
                'left': this.params.index02 * this.params.step - this.params.slider.sizeExpan,
                'z-index': 999
            })
            this.elements.parent.append(this.elements.slider_02);
        },

        _createTip: function () {
            this.elements.tip = $("<div class='annoy-tip'>" +
                "<div class='annoy-tip-text'><span></span></div>" +
                "<div class='annoy-tip-triangle'></div>" +
                "</div>");
            this.elements.slider.append(this.elements.tip);

            this.elements.tip.css({
                'height': this.options.height * 2,
                'border-radius': 3,
                'position': 'absolute',
                'top': 0 - this.params.slider.sizeExpan - this.options.height * 2,
                'z-index': 999
            });
            this._getTipText(this.params.index, this, $('.annoy-tip .annoy-tip-text'));
        },

        _createTip02: function () {
            this.elements.tip_02 = $("<div class='annoy-tip02'>" +
                "<div class='annoy-tip02-text'><span></span></div>" +
                "<div class='annoy-tip02-triangle'></div>" +
                "</div>");
            this.elements.slider_02.append(this.elements.tip_02);

            this.elements.tip_02.css({
                'height': this.options.height * 2,
                'border-radius': 3,
                'position': 'absolute',
                'top': 0 - this.params.slider.sizeExpan - this.options.height * 2,
                'right': 0,
                'z-index': 999
            });
            this._getTipText(this.params.index02, this, $('.annoy-tip02 .annoy-tip02-text'));
        },

        _createRuler: function () {
            this.elements.ruler = $("<div class='annoy-ruler'></div>");
            this.elements.ruler.css({
                'width': this.options.width - this.params.axle_radius,
                'height': this.options.height,
                'margin': '0 ' + this.params.axle_radius_half,
                'position': 'absolute',
                'z-index': 997,
                'top': this.params.axle_radius * 1.2
            });
            var createBigCell = this._createBigCell;
            for (var i = 0; i < this.options.scale_big; i++) {
                this.elements.ruler.append(createBigCell(this.options.scale_small))
            }

            this.elements.parent.append(this.elements.ruler);

            var bigCell_width = (this.options.width - this.options.scale_big - 1 - this.params.axle_radius) / this.options.scale_big;
            /* 1 指 border 1px*/

            $('.annoy-ruler-bigCell').css({
                'width': bigCell_width,
                'height': this.params.axle_radius_half
            })

            $('.annoy-ruler-smallCell').css({
                'width': (bigCell_width - this.options.scale_small) / this.options.scale_small,
                'height': this.params.axle_radius_half * 0.5
            })

        },

        _createBigCell: function (scale_small) {
            var bigCell = $("<div class='annoy-ruler-bigCell'></div>");

            function createSmallCell() {
                var smallCell = $("<div class='annoy-ruler-smallCell'></div>");
                return smallCell;
            }

            for (var i = 0; i < scale_small; i++) {
                bigCell.append(createSmallCell())
            }

            return bigCell;
        },

        _createSection: function () {
            this.elements.section = $("<div class='annoy-section'><div class='annoy-section-active'></div></div>");
            this.elements.parent.append(this.elements.section);

            this.elements.section.css({
                'clear': 'both',
                'width': this.options.width * 0.98,
                'height': this.options.height * 0.5,
                'margin': '0 ' + this.options.width * 0.01,
                'border-radius': this.options.height * 0.5 * 0.5,
                'position': 'absolute',
                'top': this.params.axle_radius_half / 2,
                'z-index': 998
            });

            $('.annoy-section-active').css({
                'position': 'relative',
                'height': 'inherit',
                'left': this.params.index02 * this.params.step,
                'width': (this.params.index - this.params.index02) * this.params.step
            });
        },

        _createScaleValue: function () {
            this.elements.scaleValue = $("<div class='annoy-scaleValue'></div>");
            var scaleValueDivs = this.options.scale_big + 1;  //
            this.elements.scaleValue.css({
                'width': this.options.width / this.options.scale_big * (scaleValueDivs),
                'height': this.options.height,
                'position': 'absolute',
                'left': 0 - (this.options.width / this.options.scale_big) / 2,
                'z-index': 996,
                'top': this.params.axle_radius * 1.2 + this.params.axle_radius_half
            })
            this.elements.parent.append(this.elements.scaleValue);

            for (var i = 0; i < scaleValueDivs; i++) {
                this.elements.scaleValue.append("<span class='annoy-scaleValue-cell'>" + this.options.scaleValueArray[i] + "</span>");
            }

            $('.annoy-scaleValue-cell').css({
                'width': (this.options.width - this.params.axle_radius) / this.options.scale_big,
                'display': 'inline-block'
            })
        },

        _sliderSlide: function () {
            var slider = {};
            var $slider = this.elements.slider;
            var position;
            var position_Min = 0 - this.params.slider.sizeExpan;
            var position_Max = this.options.width - this.params.axle_radius - this.params.slider.sizeExpan;
            var step = this.params.step;
            slider.mousePress = false;
            slider.stage = false;
            slider.Rx = null;
            var slider02_Rx = null;

            var checkSlider = this._checkSlider;
            var $this = this;

            $slider.mousedown(function (event) {
                // alert(slider.Rx);
                slider02_Rx = parseInt($('.annoy-slider02').css("left"));
                slider.Rx = event.pageX - (parseInt($slider.css("left")) || this.params.slider.sizeExpan);
                $slider.css("position", "absolute").fadeTo(20, 0.8);
                slider.mousePress = true;
                slider.stage = true;
            }).mouseenter(function () {
                $slider.css('cursor', 'pointer');
            });

            $(document).mouseup(function (event) {
                slider.mousePress = false;
                $slider.fadeTo(20, 1);

                var y = parseInt($slider.css('left')) - position_Min;
                y = checkSlider(y, step, $this);

                if (slider.stage) {

                    $slider.animate({
                        left: y + position_Min
                    }, 100);
                    $('.annoy-section-active').animate({
                        width: y - slider02_Rx
                    }, 100);

                    slider.stage = false;
                }
            });

            $(document).mousemove(function (event) {
                if (slider.mousePress) {

                    var x = event.pageX - slider.Rx;
                    x = (x - step) >= slider02_Rx ? x : (slider02_Rx + step);  // 让滑块01始终在滑块02右边

                    position = x <= position_Min ? position_Min : (x >= position_Max ? position_Max : x);  //滑块位置
                    $slider.css({left: position});

                    x = x <= $('.annoy-section').width() ? x : $('.annoy-section').width();
                    $('.annoy-section-active').css({width: x-slider02_Rx})

                    $this._getTipText(Math.round(x / step), $this, $('.annoy-tip .annoy-tip-text'));
                }
            });

        },

        _sliderSlide02: function () {
            var slider02 = {};
            var $slider02 = this.elements.slider_02;
            var position;
            var position_Min = 0 - this.params.slider.sizeExpan;
            var position_Max = this.options.width - this.params.axle_radius - this.params.slider.sizeExpan;
            var step = this.params.step;
            slider02.mousePress = false;
            slider02.stage = false;
            slider02.Rx = null;

            var slider01_Rx = null;

            var checkSlider02 = this._checkSlider02;
            var $this = this;

            $slider02.mousedown(function (event) {
                // alert(slider02.Rx);
                slider01_Rx = parseInt($('.annoy-slider').css("left"));
                slider02.Rx = event.pageX - (parseInt($slider02.css("left")) || this.params.slider.sizeExpan);
                $slider02.css("position", "absolute").fadeTo(20, 0.8);
                slider02.mousePress = true;
                slider02.stage = true;
            }).mouseenter(function () {
                $slider02.css('cursor', 'pointer');
            });

            $(document).mouseup(function (event) {
                slider02.mousePress = false;
                $slider02.fadeTo(20, 1);

                var y = parseInt($slider02.css('left')) - position_Min;
                y = checkSlider02(y, step, $this);

                if (slider02.stage) {

                    $slider02.animate({
                        left: y + position_Min
                    }, 100);
                    $('.annoy-section-active').animate({
                        width: slider01_Rx - (y + position_Min)
                    }, 100);

                    slider02.stage = false;
                }
            });

            $(document).mousemove(function (event) {
                if (slider02.mousePress) {
                    var sectionActiveWidth = $('.annoy-section-active').width();
                    var x = event.pageX - slider02.Rx;
                    x = (x + step) <= slider01_Rx ? x : (slider01_Rx - step);   // 让滑块02始终在滑块01左边
                    position = x <= position_Min ? position_Min : (x >= position_Max ? position_Max : x);
                    $slider02.css({left: position});
                    $('.annoy-section-active').css({left: position});
                    $('.annoy-section-active').css({width: slider01_Rx - position});
                    $this._getTipText(Math.round(x / step), $this, $('.annoy-tip02 .annoy-tip02-text'));
                }
            });

        },

        _checkSlider: function (y, step, $this) {
            $this.params.index = Math.round(y / step);
            y = $this.params.index * step;
            return y;
        },

        _checkSlider02: function (y, step, $this) {
            $this.params.index02 = Math.round(y / step);
            y = $this.params.index02 * step;
            return y;
        },

        _getTipText: function (index, $this, $textDiv) {

            if (index < 0) index = 0;
            if (index > $this.params.cell_num) index = $this.params.cell_num;

            var date = $this.options.startDate;
            var type = $this.options.scale_type;
            var num = index * $this.options.scale_small_time;
            var fmt = "yyyy-MM-dd HH:mm";
            date = $this._calculateDate(date, type, num);
            var timeStr = ($this._formatDate(date, fmt));
            $textDiv.empty().append(timeStr);
        },

        _calculateDate: function (date, type, num) {
            date = date == undefined ? new Date() : date;
            date = typeof date == 'number' ? new Date(date) : date;
            var tiems = date.getTime();
            switch (type) {
                case 'dd':
                    tiems = tiems + num * 24 * 60 * 60 * 1000;
                    break;
                case 'hh':
                    tiems = tiems + num * 60 * 60 * 1000;
                    break;
                case 'mm':
                    tiems = tiems + num * 60 * 1000;
                    break;
                case 'ss':
                    tiems = tiems + num * 1000;
                    break;
                default:
                    tiems = tiems;
            }
            return new Date(tiems);
        },

        _formatDate: function (date, fmt) {
            date = date == undefined ? new Date() : date;
            date = typeof date == 'number' ? new Date(date) : date;
            fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
            var obj =
                {
                    'y': date.getFullYear(),
                    'M': date.getMonth() + 1,
                    'd': date.getDate(),
                    'q': Math.floor((date.getMonth() + 3) / 3),
                    'w': date.getDay(),
                    'H': date.getHours(),
                    'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
                    'm': date.getMinutes(),
                    's': date.getSeconds(),
                    'S': date.getMilliseconds()
                };
            var week = ['天', '一', '二', '三', '四', '五', '六'];
            for (var i in obj) {
                fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
                    var val = obj[i] + '';
                    if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val];
                    for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
                    return m.length == 1 ? val : val.substring(val.length - m.length);
                });
            }
            return fmt;
        }


    }

    $.fn.Annoy = function (options, callback) {

        return this.each(function () {
            var annoy = new Annoy($(this), options, callback);
            annoy._init();
        })
    }


})(jQuery, window, document);