/**
 * Created with JetBrains RubyMine.
 * User: gen
 * Date: 13-6-25
 * Time: 下午6:26
 */
$(document).ready(function(){
    var more = $('#more').find('a');
    var articles = $('#articles');
    articles.data('data-start', function(){
        more.html('读取中...');
    });
    articles.data('data-success', function(data){
        eval(data);
    });
    articles.data('data-over', function(){
        more.html('没有更多。');
        articles.stopScrollPagination();
    });
    articles.data('data-error', function(){
        more.html('读取失败,请稍后。');
    });
    $('[search]').on('resultInit', function(e, result){
        $(result).appendTo('#wrapper #inner');
    });
});