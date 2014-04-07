$(document).ready(function(){
    $('.simple-text-content .font').children('div').click(function(e){
        var $this = $(this);
        $this.parent().children('.font-group').slideDown();
        var f = function(){
            $this.parent().children('.font-group').slideUp();
            $('body').unbind('click', f);
        };
        $('body').unbind('click', f);
        setTimeout(function(){
            $('body').bind('click', f);
        }, 0);
        e.stopImmediatePropagation();
    });
    $('.simple-text-content .color').children('div').click(function(e){
        var $this = $(this);
        $this.parent().children('.color-group').slideDown();
        var f = function(){
            $this.parent().children('.color-group').slideUp();
            $('body').unbind('click', f);
        };
        $('body').unbind('click', f);
        setTimeout(function(){
            $('body').bind('click', f);
        }, 0);
        e.stopImmediatePropagation();
    });
    var body = $('body');
    body.delegate('.image-add input[data-wysihtml5-dialog-field="src"]', 'change', function(){
        checkImage(this);
    });
    body.delegate('.simple-text-content [data-wysihtml5-command="insertImage"]', 'click', function(){
        var $this = $(this),
            collection = $this.parents('.simple-text-content').find('.image-add'),
            input = collection.find('input[data-wysihtml5-dialog-field="src"]'),
            display = collection.find('#display');
        input.val(null);
        input.show();
        display.hide();
        checkImage(input.first());
    });
    body.delegate('.simple-text-content [upload]', 'upload:success', function(e, data){
        var collection = $(this).parents('.image-add'),
            input = collection.find('input[data-wysihtml5-dialog-field="src"]'),
            display = collection.find('#display'),
            progress = collection.find('#progress-s');
        var result = JSON.parse(data.jqXHR.responseText);
        input.val(result.url);
        input.hide();
        display.show();
        progress.text('');
        checkImage(input.first());
    });
    body.delegate('.simple-text-content [upload]', 'upload:error', function(e, data){
        var collection = $(this).parents('.image-add'),
            progress = collection.find('#progress-s');
        progress.text('');
    });
    body.delegate('.simple-text-content [upload]', 'upload:progress', function(_, data){
        var collection = $(this).parents('.image-add'),
            imgShower = collection.find('#simple-text-image'),
            progress = collection.find('#progress-s');
        imgShower.removeAttr('src');
        progress.text(parseInt(data.loaded / data.total * 100, 10) + '%');
    });
    body.delegate('.simple-text-content .image-add #display .icon-cancel-2', 'click', function(){
        var $this = $(this),
            collection = $this.parents('.image-add'),
            input = collection.find('input[data-wysihtml5-dialog-field="src"]'),
            display = collection.find('#display');
        input.show();
        display.hide();
        input.val(null);
        checkImage(input.first());
    });

    window.checkImage = function(input){
        var $this = $(input), src = $this.val(),
            collection = $this.parents('.image-add'),
            imgItem = collection.find('.show-image img#simple-text-image'),
            background = collection.find('.show-image .image-background'),
            okButton = collection.find('button[data-wysihtml5-dialog-action="save"]');
        if(imgItem.attr('src') == src) return;
        if(src && src.length != 0) {
            var image = new Image();
            image.src = src;
            imgItem.attr('src', imgItem.attr('loading'));
            background.show();
            image.onload = function(){
                imgItem.attr('src', src);
                background.hide();
                okButton.removeAttr('disabled');
            };
            image.onerror =  function(){
                console.log('load2', this);
                imgItem.attr('src', null);
                background.show();
                okButton.attr('disabled', true);
            }
        }else {
            imgItem.attr('src', null);
            background.show();
            okButton.attr('disabled', true);
        }
    };
});