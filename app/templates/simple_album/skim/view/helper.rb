require 'uri'
module SimpleAlbumHelper
  def self.gallery_tag(element)
    begin
      pics = JSON(element.content)['pic']
      html = ''
      pics.each_index do |i|
        p = pics[i]
        uri = URI(p)
        h = Hash[URI::decode_www_form(uri.query || '')]
        h['s'] = 80
        uri.query = URI::encode_www_form(h)
        html << "<div class=\"skim-album-edit-item\"><a href=\"#{pics[i]}\"><img src=\"#{uri.to_s}\" alt=\"图片 #{i}\" /></a></div>"
      end
      html
    rescue StandardError => _
      '没有发现图片'
    end
  end
end