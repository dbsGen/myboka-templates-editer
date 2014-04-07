# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

@skim_click = ->
  value = $('#id_1').val()
  if typeof value != 'string' or value.length == 0
    value = $('#id_1').data('value')
  $('#content').val(value)
  yes

@formSubmit = (that) ->
  try
    al = null
    $(that).find('[check]').each(->
      $this = $(this)
      type = $this.attr('check')
      switch type.toLowerCase()
        when 'string'
          minimum = $this.attr('minimum')
          minimum = 0 if typeof(minimum) == 'undefined'
          maximum = $this.attr('maximum')
          maximum = 999 if typeof(maximum) == 'undefined'
          val = $this.val()
          if val.length > maximum or val.length < minimum
            al = "#{$this.parent().children('h4').text()} - #{$this.attr('placeholder')}"
        else
    )
    if al
      alert(al)
      no
    else
      yes
  catch e
    console.log(e)
    no

@sendContent = ->
  $('#bk_send_button').click()
