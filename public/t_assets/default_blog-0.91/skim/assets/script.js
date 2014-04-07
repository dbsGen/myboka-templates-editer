/**
 * Created with JetBrains RubyMine.
 * User: gen
 * Date: 13-6-25
 * Time: 下午6:26
 */
(function(){
    var CachedHTML = {};
    function pushState(new_url) {
        CachedHTML[new_url] = document.getElementById('content-field');
        history.pushState({url : new_url}, $('title').text(), new_url);
    }

    window.onpopstate = function(e){
        var html = CachedHTML[e.state.url];
        $(html).replaceAll('#content-field')
    };
    $(document).ready(function(){
        pushState(window.location.pathname + window.location.search);
        $(document).delegate('.pagination a[href]', 'click', function(){
            var url = $(this).attr('href');
            if(history.pushState){
                var buttons = $('.pagination a[href]');
                buttons.attr('disabled', true);
                $.ajax({
                    url: url,
                    type: 'post',
                    success: function(data){
                        try{
                            eval(data);
                            $.scrollTo(5,300);
                            pushState(url);
                        }catch(e) {
                            console.log('Load : (' + url + ') failed.');
                            buttons.removeAttr('disabled')
                        }
                    },
                    error: function(){
                        buttons.removeAttr('disabled')
                    }
                });
                return false;
            }
            return true;
        });
        // 搜索结果内容初始化
        var search = $('[search]');

        search.on('resultInit', function(e, result){
            $(result).appendTo('.search .result');
        });
        search.on('resultShow', function(){
            $('.search .result').slideDown();
        });
        search.on('resultHide', function(){
            $('.search .result').slideUp();
        });
    });
})();

