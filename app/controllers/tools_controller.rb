class ToolsController < ApplicationController
  def search
    render layout: nil
  end

  def search_api
    @articles = Article.default_articles
    @template = Template.template(params)
    search_path = Dir[@template.dynamic_path + 'skim/view/search.*'].first
    if search_path
      render file: search_path, layout: nil
    else
      render layout: nil
    end
  end
end
