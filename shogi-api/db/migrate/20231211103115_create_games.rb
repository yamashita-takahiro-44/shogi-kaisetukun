class CreateGames < ActiveRecord::Migration[7.1]
  def change
    create_table :games do |t|
      t.text :board
      t.text :moves

      t.timestamps
    end
  end
end
