# app/models/web_usage.rb
class WebUsage < ApplicationRecord
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :domain, presence: true
  validates :time_spent, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :category, presence: true
  validates :date_visited, presence: true
end
