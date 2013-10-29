class Comment
  attr_accessor :created_at, :flood

  def self.default_comment
    c = self.new
    c.created_at = Time.now
    c.flood = 1
    c
  end
end