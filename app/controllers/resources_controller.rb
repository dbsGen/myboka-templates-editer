class ResourcesController < ApplicationController
  def create
    redirect = params[:redirect]
    if redirect
      uri = URI(redirect)
      query = Hash[URI::decode_www_form(uri.query || '')]
      query['url'] = '/images/logo1.png'
      q_str = URI::encode_www_form(query)
      uri.query = q_str.size == 0 ? nil : q_str
      redirect_to uri.to_s
    else
      render json: {status: 200, url: '/images/logo1.png'}
    end
  end
end
