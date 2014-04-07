class Article
  attr_accessor :id, :title, :content, :created_at, :creater, :edited_at
  attr_accessor :comments, :like_count, :summary

  def self.default_articles
    articles = []
    self.all_data.each do |v|
      articles << self.new(v)
    end
    articles
  end

  def initialize(params)
    @id = params['id']
    @title = params['title']
    @content = params['content']
    @created_at = params['created_at']
    @creater = User.new params['user']
    @edited_at = params['edited_at']
    @comments = params['comments'] || []
    @like_count = params['like_count'] || 0
    @summary = params['summary']
  end

  def self.find_by_id(id)
    article = nil
    self.all_data.each do |v|
      if v['id'].to_s == id.to_s
        article = self.new(v)
        break
      end
    end
    article
  end

  def summary
    return @content unless @summary
    @summary
  end

  private
  ARTICLE_FILE = "#{Rails.root}/app/models/articles.yml"

  def self.all_data
    YAML.load File.open(ARTICLE_FILE)
  end
end