class CreateWebUsages < ActiveRecord::Migration[7.1]
  def change
    create_table :web_usages do |t|
      t.string :email
      t.string :domain
      t.integer :time_spent
      t.string :category      
      t.date :date_visited 
      t.timestamps
    end
  end
end
