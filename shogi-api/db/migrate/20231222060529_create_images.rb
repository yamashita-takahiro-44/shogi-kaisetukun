class CreateImages < ActiveRecord::Migration[7.1]
  def change
    create_table :images do |t|
      t.string :url
      t.integer :likes

      t.timestamps
    end
  end
end
