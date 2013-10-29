module HomeHelper
  ID_REGEXP = /@[\w.]+/

  #读取代码
  def load_script(path)
    File.open path do |file|
      eval file.read
    end
  end

  #添加@引用显示
  def add_quote(element, quote_info = {})
    if element.is_a?(Element)
      content = element.content
      quote_info = element.quote_info
    else
      content = element
    end
    nc = String.new(content)
    content.scan(ID_REGEXP) do |match|
      name = match[1..-1]
      id = quote_info[name]
      unless id.nil?
        #这里需要补全地址
        html = link_to(match, '#')
        nc.sub!(match, html)
      end
    end
    nc
  end

  def time_progress(time)
    str = time.strftime('%Y-%m-%d')
    if str == Time.now.strftime('%Y-%m-%d')
      str = time.strftime('%H:%M')
    end
    str
  end

  #检测check_code当不成立时 才会执行path的代码
  def javascript_defer_tag(check_code, path, ops = {})
    render partial: 'home/script', locals: {
        options:ops,
        insert_content_path:path,
        check_code:check_code
    }
  end

  def bk_javascript_include_tag(*sources)
    insert_path sources
    javascript_include_tag *sources
  end

  def bk_stylesheet_link_tag(*sources)
    insert_path sources
    stylesheet_link_tag *sources
  end

  def render_content
    render file: @content_path
  end

  def render_object(path, header, object)
    h = {:locals => {:header => header, :object => object}}
    if path[/^\//].nil?
      h[:partial] = path
    else
      h[:file] = path
    end

    render h
  end

  def bk_template_path(path)
    "#{@template.dynamic_path}/#{path}"
  end

  def article_path(article)
    article_item_path(article.id, name: params[:name], version: params[:version])
  end

  def text_clip(content, limit = 250)
    content ||= ''
    content = replace_tp_tag(content)
    doc = Nokogiri::HTML(content)
    images = []
    doc.css('img').each do |img|
      images << img.to_s
    end
    c = strip_tags(content)
    text = c.length > limit ? "#{c[0..limit]}..." : c
    if block_given?
      yield text, images
    else
      raw "#{text.nil? or text.length == 0 ? '' : "#{text} <br/>"} #{images.join('')}"
    end
  end

  def replace_tp_tag(content)
    content.gsub(/<img[^>]+data-tp=[^>]+>/) do |_|
      ''
    end
  end

  def name_tag(user, ops = {})
    return '没有这个用户' if user.nil?
    hash = {}
    hash.merge!(ops)
    link_to(user.name, '#', hash)
  end

  def comment_action_tag(comment)
    html = '['
    html << link_to('回复', '#')
    html << ']'
    raw html
  end

  def avatar_url(user, expression = nil)
    h = {email:user.email}
    h[:expression] = expression unless expression.nil?
    "#{'http://www.mingp.net/'}public/avatar?#{ URI.encode_www_form(h) }"
  end

  def render_article_content
    raw @article.content
  end

  def render_comments
    html = ''
    html << '<div class="article-comment" style="height: 150px">'
    html << '<div style="border:5px dashed #cccccc; height: 80%; margin: 20px;text-align: center; vertical-align:middle;border-radius:20px">'
    html << '<div style="margin-top:45px"><span style="font-size: 40px; color: #cccccc">评论信息</span></div>'
    html << '</div>'
    html << '</div>'
    raw html
  end

  def render_add_comment
    raw '<div>添加评论</div>'
  end

  def follow_button_tag(user)
    raw "<button class='btn btn-mini btn-info'>关注</button>"
  end

  def root_path
    skim_template_path(name: @template.name, version: @template.version)
  end

  def root_url
    skim_template_url(name: @template.name, version: @template.version)
  end

  def api_path(source, ops = {})
    m_api_path(source, ops.merge(name: @template.name, version: @template.version))
  end

  def edit_setting_tag(setting)
    html = '<div class="clearfix">'
    html << "<h4>#{setting.name}</h4>"
    case setting.type.downcase
      when 'string'
        html << text_field_tag("setting[#{setting.id}]",
                               @user.blog_setting[setting.id],
                               string_params(setting))
      else

    end
    html << '</div>'
    raw html
  end

  def string_params(setting)
    hash = {}
    length = setting['length']
    unless length.nil?
      if !length.minimum.nil? and !length.maximum.nil?
        hash[:check] = setting.type
        hash[:placeholder] = "长度必须在#{length.minimum.to_i}~#{length.maximum.to_i}之间。"
        hash[:minimum] = length.minimum
        hash[:maximum] = length.maximum
      elsif length.minimum.nil?
        hash[:check] = setting.type
        hash[:placeholder] = "必须少于或等于#{length.maximum.to_i}个字符。"
        hash[:maximum] = length.maximum
      elsif length.maximum.nil?
        hash[:check] = setting.type
        hash[:placeholder] = "必须大于或等于#{length.minimum.to_i}个字符。"
        hash[:minimum] = length.minimum
      end
    end
    hash
  end

  def assets_path(template, path = nil)
    if template.is_a? String and path.nil?
      path = template
      template = @template
    end
    static_file_url(name: template.name, version: template.version, path: path)
  end

  #博客主
  def blog_master
    @user
  end

  #Blog settings
  def public_settings
    Hashie::Mash.new blog_master.blog_setting.public_settings
  end

  def template_settings
    blog_master.blog_setting[@template.name]
  end

  def pagination_url(ops = {})
    uri = URI(request.env['REQUEST_URI'])
    prototype = Hash[URI.decode_www_form(uri.query)]
    prototype.delete_if{|k| ops[k.to_sym] || ops[k.to_s]}
    uri.query = URI.encode_www_form(prototype.merge(ops))
    uri.to_s
  end

  #分页标签
  # options属性
  # url: 请求更多的网址
  # item: 单个文章元素的模板 只需要写view一下的位置，例如:article_item
  # scrollTarget: 相对滚动的对象默认'window'
  # objects: 默认显示的对象
  # 其他属性会作为标签的属性写入到页面中,如:id,class
  # data数据,通过$.fn.data设置:
  # data-start: 开始请求
  # data-success: 请求成功
  # data-over: 没有更多
  # data-fail: 请求失败
  def auto_pagination_tag(options)
    url = options.delete(:url) || options.delete('url') || pagination_url
    item = options.delete(:item) || options.delete('item')
    scroll_target = options.delete(:scrollTarget) || options.delete('scrollTarget') || 'window'
    objects = options.delete(:objects) || options.delete('objects') || []
    id = options[:id] || options['id']
    options[:id] = id = 'content-field' if id.nil?
    html = ''
    html << render(:partial => 'layouts/div_content',
                   :locals => {:partial => bk_template_path("skim/view/#{item}"),
                               :objects => objects,
                               :options => options})
    html << javascript_include_tag('scrollpagination')
    scr = <<-script
$(document).ready(function(){
    document.last = $('[pagination-key]').last().attr('pagination-key');
    var that =  $('##{id}');
    that.scrollPagination({
        'contentPage': '#{url}',
        'contentData': {
            last: document.last
        },
        'scrollTarget': $(#{scroll_target}),
        'heightOffset': 10,
        'beforeLoad': function(){
            console.log(that.data('data-start'));
            that.data('data-start')();
        },
        'afterLoad': function(data){
            if (data.length == 0) {
                that.data('data-over')();
                that.stopScrollPagination();
            }else {
                that.data('data-success')(data);
                document.last = $('[pagination-key]').last().attr('pagination-key');
            }
        },
        'loadError': function(request){
            try {
                if(request.status == 403 && eval('('+request.responseText+')').code == 403) {
                    that.data('data-over')();
                }else
                    that.data('data-fail')(request);
            }catch(e) {
                console.error(e);
                that.data('data-fail')(request);
            }
        }
    });
});
    script
    html << (javascript_tag{ raw scr })
    raw html
  end

  def blog_pagination_path(options = {})
    options[:name] = params[:name]
    options[:version] = params[:version]
    options[:type] = params[:type]
    skim_template_path('js', options)
  end

  def dynamic_path
    @template.dynamic_path
  end

  protected
  def insert_path(*sources)
    url = sources.first.shift
    url = static_file_url(name: @template.name, version: @template.version, path: url) if url[/^\w+:\/\//].nil?
    sources.first.unshift url
    sources
  end
end
