$(document).delegate('.t_video input', 'change', function(){
    check_url(this)
});

var check_url = function(that){
    var $this = $(that);
    if($this.val().trim() == '') {
        failed($this, '请输入视频地址');
        return ;
    }
    $.ajax({
        url: $this.attr('src'),
        data:{url: $this.val()},
        success:function(data){
            if(typeof data == 'string') data = JSON.parse(data);
            if('miss' == data.results) {
                failed($this);
            }else {
                var display = $this.parents('.t_video').find('#display'), results = data.results;
                if(results.type == 'media') {
                    failed($this, '这是一个Flash媒体资源,我们不能解析其中的内容,你可以把他插入到博客中.');
                    $('#'+$this.attr('for')).val(JSON.stringify(results));
                }else {
                    display.show();
                    $this.parents('.t_video').find('#message').hide();
                    display.find('.v_image img').attr('src', results.pic);
                    display.find('.v_title').text(results.title);
                    display.find('.v_desc').text(results.desc);
                    $('#'+$this.attr('for')).val(JSON.stringify(results));
                }
            }
        },
        error: function(){
            failed($this);
        }
    });
};

var failed = function($this, val){
    if (val == null) val = '不能解析这个网址,如果网址没问题请稍后重试.';
    var message = $this.parents('.t_video').find('#message');
    message.show();
    message.html(val);
    $this.parents('.t_video').find('#display').hide();
};