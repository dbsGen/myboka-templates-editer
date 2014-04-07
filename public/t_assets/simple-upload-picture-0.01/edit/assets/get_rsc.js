(function(){
    window.onload = function(){
        window.parent.getResource(document.getElementById('key').innerHTML.trim(), document.getElementsByTagName('img')[0].src);
    }
})();