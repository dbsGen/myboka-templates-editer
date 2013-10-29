class Element
  attr_accessor :content, :quote_info, :creater, :created_at

  def self.default_element
    element = self.new
    element.content = '测试'
    element.quote_info = {}
    element.creater = User.default_user
    element.created_at = Time.now
    element
  end

  def initialize(params = nil)
    unless params.nil?
      self.content = params[:content]
    end
  end
end