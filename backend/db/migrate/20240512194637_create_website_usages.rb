class CreateWebsiteUsages < ActiveRecord::Migration[7.1]
  def change
    create_table :website_usages do |t|
      t.string :email
      t.string :domain
      t.integer :time_spent
      t.timestamps
    end
  end
end
