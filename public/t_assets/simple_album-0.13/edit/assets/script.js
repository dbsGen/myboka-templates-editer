/**
 * Created by gen on 14-3-2.
 */

(function(){
    function Album($elem) {
        var pictureClass = 'simple-album-edit-picture';
        this.$elem = $elem;
        this.createImage = function(image_src){
            var div = document.createElement('div');
            div.className = pictureClass;
            var img = document.createElement('img');
            img.onload = function(){
                this.width = div.clientWidth;
                if(this.height < div.clientHeight) {
                    var th = this.height;
                    this.height = div.clientHeight;
                    this.width = div.clientHeight * this.width / th;
                }
            };
            img.src = image_src + '?s=80';
            div.appendChild(img);
            var cover = document.createElement('div');
            cover.className = 'simple-album-edit-picture-cover';
            cover.innerHTML = '<span class="icon-close"/>';
            div.appendChild(cover);
            $(div).insertBefore(this.$elem.find('.simple-album-edit-add-picture'))
        };
        this.insertImage = function(image_src) {
            this.createImage(image_src);
            this.changeValue(function(value){
                value.pic.push(image_src);
                $elem.find('.simple-album-edit-count').text(value.pic.length);
                return value;
            });
        };
        this.reloadPictures = function(){
            this.$elem.find('.' + pictureClass).each(function(){$(this).remove()});
            var value = this.getValue();
            for(var n = 0, t = value.pic.length; n < t; n++) {
                var p = value.pic[n];
                this.createImage(p)
            }
        };
        this.removeImage = function($object) {
            var $pics = this.$elem.find('.' + pictureClass);
            var index = 0, test = $object[0];
            $pics.each(function(i){
                if (this == test) {
                    index = i;
                    return false;
                }
                return true;
            });
            $object.remove();
            this.changeValue(function(value){
                value.pic.splice(index, 1);
                $elem.find('.simple-album-edit-count').text(value.pic.length);
                return value
            })
        };
        this.getValue = function(){
            var value = $elem.data('value');
            var json = {pic: []};
            try {
                json = JSON.parse(value)
            } catch(e) {
                console.warn(e)
            }
            return json;
        };
        this.changeValue = function(handle){
            var newValue = handle.call(this, this.getValue());
            $elem.data('value', JSON.stringify(newValue));
        };
        this.setProgress = function(text) {
            if(text == 'over' || text == null) {
                if(text.toString()=='100') text = '...'
                $elem.find('.simple-album-edit-progress').css('display', 'none');
                $elem.find('#simple-album-edit-new').css('display', 'inline')
            }else {
                var add = $elem.find('.simple-album-edit-progress');
                add.text(text);
                add.css('display', 'inline');
                $elem.find('#simple-album-edit-new').css('display', 'none')
            }
        };
        var that = this;
        $elem.find('[upload]').on('upload:success', function(e, data){
            var result = JSON.parse(data.jqXHR.responseText);
            that.insertImage(result.url);
            that.setProgress('over');
        });

        $elem.find('[upload]').on('upload:error', function(e, data){
            that.setProgress('over');
        });
        $elem.find('[upload]').on('upload:progress', function(_, data){
            that.setProgress(parseInt(data.loaded / data.total * 100, 10));
        });
        $elem.find('[upload]').on('upload:check', function(){
            that.setProgress('...');
        });
        $elem.delegate('.' + pictureClass, 'click', function(){
            that.removeImage($(this));
        });
        $elem.data('simple-album', this);
    }
    $(document).ready(function(){
        $('.simple-album-edit').each(function(){
            new Album($(this));
        });
        window.simpleAlbum = {
            reloadAlbum: function($elem) {
                var album = $elem.data('simple-album');
                if (!album) album = new Album($elem);
                album.reloadPictures();
            }
        }
    })
})();