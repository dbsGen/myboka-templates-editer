/**
 * Created by gen on 14-2-8.
 * Script on roll page
 */

(function(){
    $(document).ready(function(){
        var content = $('#content-field');
        content.attr('pagination-key', content.find('.item').last().attr('pagination-key'));

        content.gridalicious({
            gutter: 10,
            width: 200,
            animate: true,
            animationOptions: {
                speed: 150,
                duration: 300
            }
        });
        var Loading = false,
            loadHD = function(){
                Loading = true;
                $('#bottom').text('Loading...');
                var success = function(data) {
                    console.log($(data));
                    var obj = content.data('gridalicious'),
                        items = $(data).filter('.item');
                    content.attr('pagination-key', items.last().attr('pagination-key'));
                    obj.append(items);
                    Loading = false;
                    $('#bottom').text('Over');
                };
                $.ajax({
                    url: content.attr('pagination-url'),
                    data: {last: content.attr('pagination-key')},
                    type: 'post',
                    error: function(r){
                        if (r.status == 403) {
                            $('#bottom').text('Over');
                            Loading = true;
                        }else if (r.status == 200) {
                            success(r.responseText)
                        }else Loading = false;
                    },
                    success: success
                })
            };

        loadHD();
        $(this).scroll(function(){
            if (!Loading && $(window).height() + $(this).scrollTop() > $(this).height() - 50) {
                loadHD();
            }
        });
    })
})();
