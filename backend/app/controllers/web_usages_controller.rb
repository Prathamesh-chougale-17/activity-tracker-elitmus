# app/controllers/web_usages_controller.rb
class WebUsagesController < ApplicationController
    skip_before_action :verify_authenticity_token  # Skip CSRF token verification for simplicity
  
    def create
      @web_usage = WebUsage.new(web_usage_params)
  
      if @web_usage.save
        render json: @web_usage, status: :created
      else
        render json: @web_usage.errors, status: :unprocessable_entity
      end
    end
  
    private
  
    def web_usage_params
      params.require(:web_usage).permit(:email, :domain, :time_spent, :category, :date_visited)
    end
  end
  