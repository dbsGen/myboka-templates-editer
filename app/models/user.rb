class User
  attr_accessor :name, :email, :summary, :followers, :following, :blog_setting

  def initialize(params)
    @name = params['name']
    @email = params['email']
    @summary = params['summary']
    @followers = []
  end

  def self.default_user
    self.new(
        'name' => 'user1',
        'email' => '233221@163.com',
        'summary' => '这个人很2什么都没有留下',
        'blog_title' => 'default blog',
        'blog_sign' => 'default sign'
    )
  end
end