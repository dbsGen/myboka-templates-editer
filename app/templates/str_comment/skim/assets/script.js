(function() {

    this.onSelect = function(t, e) {
        var $this = $(t), comment = $this.parent('.s_comment_skim'), input = comment.children('.s_comment');
        var selection = rangy123.getSelection();
        var ser_s = serializeSelection(selection, t);
        input.data('select-data', ser_s);
        var commentOffset = comment.offset();
        input.css({
            left: e.pageX - commentOffset.left - 10 + 'px',
            top: e.pageY - commentOffset.top + 10 + 'px'
        });
        showInput(input, selection, ser_s);
    };
    this.initCommentingString = function(id) {
        var $this = $('#' + id);
        $this.children('.s_shower').attr('select-callback',  'onSelect(this, event)');
        $.ajax({
            url: $this.attr('src'),
            success: function(data) {
                var params = data;
                if (typeof data == 'string')
                    params = JSON.parse(data);
                for (var n = 0, t = params.comments.length; n < t; n++) {
                    try{
                        var content = params.comments[n].content;
                        var text = content.comment;
                        addSelection($this.children('.s_shower'), content, text);
                    }catch(e){
                        console.log(['Can not parse comment', e]);
                    }
                }
            },
            error: function(r){
                console.error(r);
                alert('获得评论失败');
            }
        });
    };


    function inputClicked(e){
        e.stopImmediatePropagation();
    }
    function bodyClicked(e) {
        var input = e.data;
        input.fadeOut(200);
        var body = $('body');
        missSelection(input.parent().children('.s_shower'));
        body.unbind('mousedown', bodyClicked);
        input.unbind('mousedown', inputClicked);
    }

    function getTexts(node){
        if (node instanceof Text) {
            return [node];
        }else {
            var res = [];
            for (var n = 0 , t = node.childNodes.length; n < t ; n++) {
                res = res.concat(getTexts(node.childNodes[n]));
            }
            return res;
        }
    }

    var serializeSelection = function(selection, rootNote) {
        var range = selection.getAllRanges()[0],
            textList = getTexts(rootNote),
            before = 0,
            left = -1,
            right = -1;

        for(var n = 0 , t = textList.length; n < t; n++) {
            var node = textList[n];
            if (node == range.startContainer) {
                left = before + range.startOffset;
            }
            if (node == range.endContainer) {
                right = before + range.endOffset;
            }
            before += node.data.length;
        }

        if (left > right) {
            var tmp = left;
            left = right;
            right = tmp;
        }

        return {
            start: left,
            end: right
        };
    };

    var showInput = function(input, selection, ser_s) {
        if (input.css('display') == 'none')  {
            input.fadeIn(200);
            input.mousedown(inputClicked);
            setTimeout(function(){
                $('body').bind('mousedown', input, bodyClicked);
            }, 10);
            showSelection(input.parents('.s_comment_skim').children('.s_shower'), ser_s);
        }
        input.children('input').focus();
    };
    var missInput = function(input) {
        var comment = input.parents('.s_comment_skim');
        input.fadeOut();
        comment.children();
        $('body').unbind('mousedown', bodyClicked);
        input.unbind('mousedown', inputClicked);
        missSelection(comment.children('.s_shower'));
    };
    var showSelection = function(shower, ser_s) {
        var cssApplier = rangy123.createCssClassApplier("s_selected", {normalize: true}),
            $shower = shower.parent().children('#selection_shower'),
            range = rangy123.createRange();
        $shower.text(shower.text());
        shower.hide();
        $shower.show();
        var textNode = $shower[0];
        while(!(textNode instanceof Text)) {
            textNode = textNode.childNodes[0];
        }

        range.setStart(textNode, ser_s.start);
        range.setEnd(textNode, ser_s.end);
        var sel = rangy123.getSelection();
        sel.setSingleRange(range);
        cssApplier.applyToSelection();
    };
    var missSelection = function(shower) {
        shower.show();
        shower.parent().children('#selection_shower').hide();
    };
    var addSelection = function(shower, ser_s, text){
        var count = parseInt(shower.data('commentCount')) || 0,
            className = 's_commented' + count,
            cssApplier = rangy123.createCssClassApplier(className),
            nodeList = getTexts(shower[0]),
            before = 0,
            startNode = null,
            startOffset = 0,
            endNode = null,
            endOffset = 0;
        for(var n = 0 ,t = nodeList.length; n < t; n++) {
            var node = nodeList[n],
                length = node.data.length;
            if (startNode == null && before + length > ser_s.start) {
                startNode = node;
                startOffset = ser_s.start - before;
            }
            if (endNode == null && before + length > ser_s.end) {
                endNode = node;
                endOffset = ser_s.end - before;
            }
            before += length;
        }
        var range = rangy123.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        var sel = rangy123.getSelection();
        sel.setSingleRange(range);
        cssApplier.applyToSelection();
        shower.data('commentCount', count + 1);
        var params = shower.data('commentDatas') || {};
        params[className] = text;
        shower.data('commentDatas', params);
    };

    var showComment = function($this, texts){
        var offset = $this.offset(),
            content = $this.parents('.s_comment_skim'),
            c_off = content.offset(),
            left = offset.left - c_off.left,
            top = offset.top - c_off.top,
            center_x = left + $this.width() / 2,
            display = content.children('#comment_display');

        function setComment() {
            display.text(texts.join(','));
            display.css({
                top: top - 35 + 'px',
                left: center_x - 40 + 'px'
            });
            display.fadeIn(200);
            setTimeout(function(){
                var offset = content.offset(),
                    width = content.width(),
                    height = content.height();
                var handle = function(event){
                    if (event.pageX < offset.left ||
                        event.pageX > offset.left + width ||
                        event.pageY < offset.top ||
                        event.pageY > offset.top + height){

                        display.fadeOut(200);
                        $('body').unbind('mousemove', handle);
                    }
                };
                $('body').mousemove(handle);
            }, 10);
        }
        if ($this.css('display') == 'none') {
            setComment();
        }else {
            display.fadeOut(200, function(){
                setComment();
            });
        }
    };
    $(document).delegate('.s_comment_skim .s_shower [class^=s_commented]', 'mouseover', function(event){
        var $this = $(this),
            shower = $this.parents('.s_shower'),
            datas = shower.data('commentDatas'),
            e = $this.parent(),
            classes = $this.attr('class').split(/ +/),
            texts = [];
        function pushTextWithClass(classes) {
            for(var n = 0 , length = classes.length; n < length; n++) {
                var c = classes[n];
                texts.push(datas[c]);
            }
        }
        pushTextWithClass(classes);
        while(!e.hasClass('s_shower')){
            var cn = e.attr('class').split(/ +/);
            pushTextWithClass(cn);
            e = e.parent();
        }
        showComment($this, texts);
        event.stopImmediatePropagation();
    });
    $(document).delegate('.s_comment_skim .s_comment button', 'click', function(){
        var $this = $(this),
            $s_comment = $this.parent(),
            offset = $s_comment.data('select-data'),
            helper = $s_comment.children('#s_helper'),
            input = $s_comment.children('input');
        var comment = input.val();
        helper.text('');
        if(comment.length == 0) {
            helper.text('评论不能为空');
            return;
        }
        $this.attr('disabled', true);
        $.ajax({
            url: $this.attr('url'),
            type: 'post',
            data: {
                'content[start]': offset.start,
                'content[end]': offset.end,
                'content[comment]': comment
            },
            success: function(){
                helper.text('');
                addSelection($s_comment.parent().children('.s_shower'), offset, comment);
                input.val('');
                missInput($s_comment);
            },
            error: function(){
                helper.text('发送失败');
            },
            complete: function(){
                $this.removeAttr('disabled');
            }
        })
    });
})();