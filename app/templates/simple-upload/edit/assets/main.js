/**
 * Created by gen on 14-3-9.
 */

(function(){
    window.uploadIframe = function(key) {
        $('#' + key).data('value', '');
        $('.simple-upload-picture iframe').css({
            width: '300px',
            height: '80px'
        })
    };
    window.getResource = function(key, src) {
        $('#' + key).data('value', JSON.stringify({pic: src}));
        $('.simple-upload-picture iframe').css({
            width: '300px',
            height: '280px'
        })
    }
})();