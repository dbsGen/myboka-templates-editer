module ApplicationHelper
  def static_file_url(path)
    "/t_assets/#{@template.name}-#{@template.version}/#{path}"
  end
end
