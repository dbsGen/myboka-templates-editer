def a_tag(disabled, url, content)
  html = "<a #{disabled ? "class=\"disabled\"" : "href=\"#{url}\""}>"
  html << content
  html << '</a>'
  raw html
end