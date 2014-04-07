(function(){
    var nowCity = null;
    $(document).delegate('.gen-map input.city', 'keyup', function(e){
        if (e.which == 13) {
            var $this = $(this),
                mapC = $this.parents('.gen-map').find('.map-container'),
                m = mapC.data('b-map');
            if (m) {
                searchCity(m, $this.val());
            }
        }
    });


    $(document).delegate('.gen-map button#search', 'click', function(){
        var $this = $(this),
            map = $this.parents('.gen-map'),
            mapC = map.find('.map-container'),
            input = map.find('input#label'),
            m = mapC.data('b-map');
        if (m) {
            searchCity(m, input.val());
        }
    });
    $(document).delegate('.gen-map button#clear', 'click', function(){
        var $this = $(this),
            map = $this.parents('.gen-map'),
            mapC = map.find('.map-container'),
            m = mapC.data('b-map');
        m.clearOverlays();
        mapC.data('markers', []);
        mapC.data('paths', []);
    });

    $(document).delegate('.gen-map .map-container', 'url:make', function(){
        var $this = $(this),
            m = $this.data('b-map'),
            map = $this.parents('.gen-map');
        var markers = $this.data('markers'),
            paths = $this.data('paths'),
            size = m.getSize(),
            center = m.getCenter(),
            zoom = m.getZoom();

        var url = 'http://api.map.baidu.com/staticimage?width='
            + size.width +
            '&height='
            + size.height +
            '&center='
            + center.lng + ',' + center.lat +
            '&zoom=' + zoom;
        if(markers && markers.length > 0) {
            url += '&markers=';
            for(var n = 0; n < markers.length; n ++) {
                if(n != 0) url += '|';
                url += markers[n];
            }
            url += '&markerStyles=l,A,0xff0000';
        }
        if(paths && paths.length > 0) {
            url += '&paths=';
            for (n = 0; n < paths.length; n++) {
                if(n != 0) url += '|';
                url += paths[n];
            }
            url += '&pathStyles=0x000fff,5,0.5,0xff0000'
        }
        map.data('value', JSON.stringify({pic: url}));
    });

    function searchCity(map, city) {
        var citySearcher =new BMap.LocalSearch(map,{renderOptions:{map:map,autoViewport:true}});
        nowCity = city;
        citySearcher.search(city);
    }

    var styleOptions = {
        strokeColor:"blue", //边线颜色。
        fillColor:"red", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    };

    document.mapDrawingLoaded = function(obj){
        var map = obj.data('b-map');

        var drawingManager = new BMapLib.DrawingManager(map, {
            isOpen: false, //是否开启绘制模式
            enableDrawingTool: true, //是否显示工具栏
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                offset: new BMap.Size(5, 5), //偏离值
                scale: 0.8,                  //工具栏缩放比例
                drawingModes : [
                    BMAP_DRAWING_MARKER,
                    BMAP_DRAWING_POLYGON,
                    BMAP_DRAWING_POLYLINE
                ]
            },
            circleOptions: styleOptions, //圆的样式
            polylineOptions: styleOptions, //线的样式
            polygonOptions: styleOptions, //多边形的样式
            rectangleOptions: styleOptions //矩形的样式
        });
        drawingManager.addEventListener('markercomplete', function(e, o) {
            var markers = obj.data('markers') || [],
                position = e.getPosition();
            markers.push(position.lng + ',' + position.lat);
            obj.data('markers', markers);
            obj.trigger('url:make');
        });
        drawingManager.addEventListener('polygoncomplete', function(e, o) {
            var paths = obj.data('paths') || [],
                path = e.getPath(),
                str = '';
            for(var n = 0; n < path.length; n++) {
                var p = path[n];
                str += p.lng + ',' + p.lat + ';';
            }
            paths.push(str);
            obj.data('paths', paths);
            obj.trigger('url:make');
        });
        drawingManager.addEventListener('polylinecomplete', function(e) {
            var paths = obj.data('paths') || [],
                path = e.getPath(),
                arr = [];
            for (var n = 1; n < path.length; n++) {
                var p1 = path[n - 1],
                    p2 = path[n];
                arr.push(p1.lng + ',' + p1.lat + ';' + p2.lng + ',' + p2.lat);
            }
            paths = paths.concat(arr);
            obj.data('paths', paths);
            obj.trigger('url:make');
        });
    };
})();
window.loadOver = false;
function initialize(){
    window.loadOver = true;
}