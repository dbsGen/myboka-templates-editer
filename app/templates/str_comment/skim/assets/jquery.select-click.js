(function ($) {
    var DefaultTolerance = 2,
        ToleranceAttr = 'select-tolerance',
        SelectAttr = 'select-callback',
        ClickAttr = 'click-callback',
        SelectClickKey = 'selectClick';

    $.fn.selectClick = function (selectCallback, clickCallback, clickTolerance) {
        var h = {};
        h[SelectAttr] = selectCallback;
        h[ClickAttr] = clickCallback;
        h[ToleranceAttr] = clickTolerance;
        new SelectClick(this, h)
    };
    var SelectClick = function(element, ops){
        var $element;
        if(element instanceof jQuery) {
            $element = element;
        }else {
            $element = $($element);
        }
        if (!ops) ops = {};
        $element.data(SelectClickKey, this);
        this.prevX = ops['prevX'] || 0;
        this.prevY = ops['prevY'] || 0;
        this.clicked = ops['clicked'] || false;
        var that = this;
        var mousedown = function(e) {
            that.prevX = e.pageX;
            that.prevY = e.pageY;
            that.clicked = true;
            $('body').mouseup(function clickHandle(){
                that.clicked = false;
                $('body').unbind('mouseup', clickHandle);
            });
        };
        var mouseup = function(event) {
            if(that.clicked) {
                var tolerance = parseInt($element.attr(ToleranceAttr) || ops[ToleranceAttr]);
                tolerance = isNaN(tolerance) ? 2 : tolerance;
                var dx = Math.abs(event.pageX - that.prevX);
                var dy = Math.abs(event.pageY - that.prevY);
                if (dx < tolerance && dy < tolerance) {
                    var click = $element.attr(ClickAttr) || ops[ClickAttr];
                    if (typeof click == 'string') {
                        eval(click);
                    }else if (typeof click == 'function') {
                        click();
                    }
                }else {
                    var select = $element.attr(SelectAttr) || ops[SelectAttr];
                    if (typeof select == 'string') {
                        eval(select);
                    }else if (typeof select == 'function') {
                        select();
                    }
                }
            }
        };
        $element.each(function(){
            this.onmousedown = mousedown;
            this.onmouseup = mouseup;
        });
    };

    // Add html5 support
    $(document).delegate('[' + SelectAttr + ']', 'mousedown', function(e){
        checkSelectClick($(this), {prevX: e.pageX, prevY: e.pageY, clicked: true})
    });

    var checkSelectClick = function(element, ops) {
        var sc = element.data(SelectClickKey);
        if(!sc) new SelectClick(element, ops);
    };
})(jQuery);
