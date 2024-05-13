class VisitsController < ApplicationController
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
