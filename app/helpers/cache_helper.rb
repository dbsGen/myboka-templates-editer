module CacheHelper

  def cache_article_item(article, keys = [], &block)
    keys = [keys] unless keys.is_a?(Array)
    _cache(['article', 'item', @template, article].concat(keys), &block)
  end

  def cache_article_content(article, keys = [], &block)
    keys = [keys] unless keys.is_a?(Array)
    _cache(['article', 'content', @template, article].concat(keys), &block)
  end

  private
  def _cache(key, options = {}, &block)
    key = [key] unless key.is_a?(Array)
    cache(['views'].concat(key), options, &block)
  end
end