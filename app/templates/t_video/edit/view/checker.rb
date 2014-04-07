require 'net/http'

url = params[:url]
def match_content(str, key)
  (str[/#{key} *: *'.+(?=')|#{key} *: *".+(?=")/] || '').gsub(/#{key} *: *'|#{key} *: *"/, '')
end
begin
  def get_url(url)
    client = HTTPClient.new
    client.get(url, :follow_redirect => true).body
  end

  case
    when URI(url).path[/.swf$/]
      {type: 'media', player: url, source: url, content: '媒体资源'}
    when url[/^http:\/\/www.tudou.com\//]
      response = get_url url
      result = {}

      coder = HTMLEntities.new
      result[:icode] = match_content(response, 'icode')
      result[:title] = coder.decode(match_content(response, 'kw'))
      p coder.decode(match_content(response, 'kw'))
      result[:desc] = match_content(response, 'desc')
      result[:pic] = match_content(response, 'pic')
      result[:player] = "http://www.tudou.com/v/#{result[:icode]}/v.swf"
      result[:type] = 'tudou'
      result[:source] = url
      result
    when url[/^http:\/\/v.youku.com\//]
      response = get_url url
      result = {}

      doc = Nokogiri.parse response
      result[:icode] = response[/videoId2 *= *'[^']*|videoId2 *= *"[^"]*/].gsub(/videoId2 *= *'|videoId2 *= *"/, '')
      result[:title] = doc.css('meta[name="title"]').first['content']
      result[:desc] = doc.css('meta[name="description"]').first['content']
      result[:pic] = doc.css('#s_qq_haoyou').first['href'][/(?<=pics\=)[^&]*/]
      result[:player] = "http://player.youku.com/embed/#{result[:icode]}"
      result[:type] = 'youku'
      result[:source] = url
      result
    when url[/^http:\/\/www.bilibili.tv\//]
      response = Net::HTTP.get(URI(url))
      result = {}

      doc = Nokogiri.parse response

      result[:icode] = response[/aid *= *'[^']*|aid *= *"[^"]*/].gsub(/aid *= *'|aid *= *"/, '')
      result[:title] = doc.css('meta[name="title"]').first['content']
      result[:desc] = doc.css('meta[name="description"]').first['content']
      result[:pic] = doc.css('[itemprop="thumbnailUrl"]').first['content']
      result[:player] = doc.css('[itemprop="embedURL"]').first['content']
      result[:type] = 'bilibili'
      result[:source] = url
      result
    when url[/^http:\/\/www.acfun.com\//]
      response = Net::HTTP.get(URI(url))
      result = {}

      doc = Nokogiri.parse response
      result[:icode] = url[/(?<=^http:\/\/www.acfun.com\/v\/ac)\d+/]
      result[:title] = doc.css('#txt-title-view').first.inner_text
      result[:desc] = doc.css('#block-info-view .desc').first.inner_text
      result[:pic] = doc.css
    else
      return 'miss'
  end
rescue StandardError => e
  logger.info "#### Net error in t_video checker! #{e}"
  'miss'
end
