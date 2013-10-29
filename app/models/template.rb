class Template
  attr_accessor :name, :version, :is_quote, :type, :screen_name, :dynamic_path, :static_path
  attr_accessor :description, :options

  INDEX_FILE_PATH = "#{Rails.root}/app/templates/index.yml"

  def self.reload_templates
    h = {}
    tps = []
    templates_folder = "#{Rails.root}/app/templates/"
    Dir.foreach(templates_folder) do |filename|
      file_path = "#{templates_folder}#{filename}/"
      if File.directory? file_path and File.exist? "#{file_path}/template.yml"
        t = self.new(file_path)
        tps << t
        h["#{t.name}_#{t.version}"] = file_path
      end
    end
    p h.to_yaml
    File.open INDEX_FILE_PATH, 'wb' do |file|
      file.write h.to_yaml
    end
    tps
  end

  def self.saved_data
    f = File.open(INDEX_FILE_PATH)
    h = YAML.load(f)
    f.close
    h
  rescue Exception => e
    nil
  end

  def self.all_templates
    data = self.saved_data
    if data.nil?
      self.reload_templates
    else
      tps = []
      data.each do |_, v|
        tps << self.new(v)
      end
      tps
    end
  end

  def self.template(params)
    data = self.saved_data
    if data.nil?
      self.reload_templates
      data = self.saved_data
    end
    p "#{params['name']}_#{params['version']}"
    self.new data["#{params['name']}_#{params['version']}"]
  end

  def initialize(path)
    template_info = YAML.load(File.open("#{path}/template.yml"))
    template = template_info['template']
    self.name = template['name']
    self.version = template['version']
    self.is_quote = template['is_quote']
    self.type = template['type']
    self.screen_name = template['screen_name']
    self.dynamic_path = path
    self.description = template
  end

  def paths(key = 'edit_path')
    if block_given?
      ps = description[key]
      js = []
      css = []
      ps.each do |v|
        p = Path.new v
        if p.type == 'css'
          css << p
        elsif p.type == 'js'
          js << p
        end
      end unless ps.nil?
      yield js, css
    else
      ps = description[key]
      s = []
      ps.each do |v|
        p = Path.new v
        s << p
      end
      s
    end
  end

  def settings
    default_hash = {}
    (@description['settings'] || {}).each do |setting|
      default_hash[setting['id']] = setting['default']
    end
    if block_given?
      r = yield
      default_hash.merge!(yield) if r.is_a?(Hash)
    end
    Hashie::Mash.new default_hash
  end

  def folder_name
    "#{name}-#{version}"
  end
end