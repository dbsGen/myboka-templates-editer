def self.colors
  colors = []
  16.times do |x|
    colors << gray_color(x)
  end
  15.times do |x|
    16.times do |y|
      colors << color(x, y)
    end
  end
  16.times do |y|
    16.times do |x|
      colors << pink_color(x, y )
    end
  end
  colors
end

def self.color(x, y)
  a = 15 - x
  c = 15 - y
  b = 15 - (x - y).abs
  "#{a.to_s(16)}#{b.to_s(16)}#{c.to_s(16)}"
end

def self.gray_color(x)
  a = (15 - x).to_s(16)
  "#{a}#{a}#{a}"
end

def self.pink_color(x,y)
  a = x
  c = y
  b = 15 - (x - y).abs
  "#{c.to_s(16)}#{a.to_s(16)}#{b.to_s(16)}"
end

def self.output_css(path)
  File.open(path, 'wb') do |file|
    colors.each do |color|
      file.write(".wysiwyg-color-#{color}{color: ##{color}}\r\n")
    end
  end
end