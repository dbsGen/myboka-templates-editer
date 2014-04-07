/**
 * Created by gen on 14-2-12.
 * The script on main page, such as Search.
 */
(function(){
    $(document).ready(function(){
        Messenger.options = {
            extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
            theme: 'flat'
        };
        $('#navbar-collapse-1 .search').click(function(){
            var $input = $('#search-input');
            if ($input.val().length == 0) {
                Messenger().post({type: 'error', message: '请输入搜索内容'})
            }else {
                $('[search]').mybokaSearch('search', $input.val())
            }
        });
        $('[search]').on('resultShow', function(){
            $('.search-result').css({top: $('#search-input').offset().top + 40})
        });
        $(window).resize(function(){
            $('[search]').mybokaSearch('hideResult')
        })
    })
})();
