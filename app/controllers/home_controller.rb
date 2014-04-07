require 'zip/zip'
class HomeController < ApplicationController
  helper_method :current_user

  def index
    @templates = Template.reload_templates
  end

  def template
    @template = Template.template params
  end

  def skim
    @template = Template.template params
    if @template.type == 'content' or @template.type == 'comment'
        @element = params[:content].nil? ? Element.default_element : Element.new(params)
        @element.creater = User.default_user
      @content_path = "#{@template.dynamic_path}/skim/view/content"
    elsif @template.type == 'blog'
      type = params[:type]
      proc = Proc.new do
        @articles = Article.default_articles
        if @articles.nil? or @articles.size == 0
          render status: 403, json: {code: 403, msg: '没有更多..'}
        else
          render file: "#{@template.dynamic_path}/skim/view/#{type.nil? ? 'content.js':"#{type}.js"}", layout: nil
        end
      end
      respond_to do |format|
        format.html do
          if request.method == 'POST'
            proc.call
          else
            @content_path = "#{@template.dynamic_path}/skim/view/#{type}"
            @content_path = "#{@template.dynamic_path}/skim/view/content" if type.nil? or !File.exist?(@content_path)
            @articles = Article.default_articles
            @user = User.default_user
            @user.blog_setting = Hashie::Mash.new(
                @template.name => @template.settings{params[:setting]},
                public_settings: {
                    title: '标题',
                    description: '简介',
                    pages: [{id: 'p1', title: '第一页'}, {id: 'p2', title: '第二页'}]
                }
            )
            render file: "#{@template.dynamic_path}/skim/view/layout", layout: 'blog'
          end
        end
        format.js &proc
      end
    end
  end

  def edit
    @template = Template.template params
    if @template.type == 'content' or @template.type == 'comment'
      @content_path = "#{@template.dynamic_path}/edit/view/content"
    elsif @template.type == 'blog'
      @user = User.default_user
      @user.blog_setting = Hashie::Mash.new(
          @template.name => @template.settings{params[:settings]},
          public_settings: {
              title: '标题',
              description: '简介'
          }
      )
      @settings = []
      @template.description['settings'].each do |v|
        @settings << Hashie::Mash.new(v)
      end
      render template: 'home/blog_edit'
    end
  end

  def api
    @template = Template.template params
    path = "#{@template.dynamic_path}/#{params[:type] || 'skim'}/view/#{params[:id]}.rb"
    return render(status: 404, json: {code: 404, msg: '没有这个命令'}) unless File.exist?(path)

    results = ''
    File.open path, 'r' do |file|
      code = file.read
      results = progress_code(code)
    end
    render json: {code:200, results: results} unless self.response_body
  end

  def upload

  end

  def zip
    @template = Template.template params
    zip_path = "#{Rails.root}/public/templates/#{@template.folder_name}.zip"
    unless File.exist? zip_path
      dir = @template.dynamic_path
      Zip::ZipFile.open(zip_path, Zip::ZipFile::CREATE) do |zipfile|
        Dir[File.join(dir, '**', '**')].each do |file|
          zipfile.add(file.sub(dir, ''), file)
        end
      end
    end
    redirect_to "/templates/#{@template.folder_name}.zip"
  end

  def static_file
    template = Template.template(params)
    path = "#{template.dynamic_path}#{params[:path]}"
    send_file path
  end

  def article
    @template = Template.template params
    @article = Article.find_by_id params[:id]
    @content_path = "#{@template.dynamic_path}/skim/view/article"
    @user = User.default_user
    @user.blog_setting = Hashie::Mash.new(
        @template.name => @template.settings{params[:setting]},
        public_settings: {
            title: '标题',
            description: '简介',
            pages: [{id: 'p1', title: '第一页'}, {id: 'p2', title: '第二页'}]
        }
    )
    render file: "#{@template.dynamic_path}/skim/view/layout", layout: 'blog'
  end

  def current_user
    @current_user = User.default_user if @current_user.nil?
    @current_user
  end

  def element_comment
    case
      when request.post?
        render json: {status: 200, msg: '成功'}
      when request.get?
        render json: {comments: []}
      when request.delete?
        render json: {status: 200, msg: '成功'}
      else
        render status: 500
    end
  end

  protected
  def _traversal_from_path(path)
    files = []
    Dir.foreach path do |file_name|
      file_path = "#{path}#{file_name}"
      if File.directory?(file_path)
        files.concat _traversal_from_path(file_path)
      else
        files << file_path
      end
    end
    files
  end

  def _zip_form_path(path)
    files = _traversal_from_path path
    Zip::File.open('filename.zip', Zip::File::CREATE) do |ar|

    end
  end

  def progress_code(code)
    eval(code)
  end
end
