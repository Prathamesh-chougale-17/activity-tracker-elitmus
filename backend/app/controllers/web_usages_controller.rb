class WebUsagesController < ApplicationController 
# app/controllers/web_usages_controller.rb
def create
    @web_usage = WebUsage.new(web_usage_params)
  
    if @web_usage.save
      render json: @web_usage, status: :created
    else
      render json: @web_usage.errors, status: :unprocessable_entity
    end
  end
  
end