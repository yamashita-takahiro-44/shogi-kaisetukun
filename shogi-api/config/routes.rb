Rails.application.routes.draw do
  resources :games, only: [:create]
  post 'chatgpt/explain', to: 'chatgpt#explain'
  post 'images', to: 'images#create'
  mount ActionCable.server => '/cable'
end

