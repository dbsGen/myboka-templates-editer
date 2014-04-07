class ApplicationController < ActionController::Base
  protect_from_forgery

  helper_method :bk_template_path
  def bk_template_path(path)
    "#{@template.dynamic_path}#{path}"
  end
end
