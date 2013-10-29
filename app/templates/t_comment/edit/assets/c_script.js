(function(){
    $(document).delegate('.edit_element', 'comment:success', function(){
        var $this = $(this), target = $this.find('#' + $this.attr('for'));
        target.data('wysihtml5').clear();
        target.val('');
    });
    this.show_avatars = function(that) {
        var $this = $(that);
        $this.parents('.c_content').find('.c_groups').slideToggle();
    };
    this.select_avatar = function(that, exp) {
        var $this = $(that);
        var $comment = $this.parents('.c_content');
        var $avatar = $comment.find('.c_avatar.big_avatar');
        $avatar.attr('data-exp', exp);
        $avatar.children('img').attr('src', $this.attr('src'));
        $comment.val(JSON.stringify({exp: exp, content: $comment.find('.c_input textarea').val()}));
    };
    this.set_avatar = function(comment, url, exp) {
        comment.find('.c_avatar.big_avatar img').attr('src', url);
        comment.val(JSON.stringify({exp: exp, content: comment.find('.c_input textarea').val()}));
        comment.find('.c_avatar.big_avatar').attr('data-exp', exp);
    };
    this.send_click = function(that) {
        sendContent(that);
    };
    this.color_click = function(that) {
        var $this = $(that);
        $this.parents('.c_content').find('ul#color-area').slideToggle();
    };
})();