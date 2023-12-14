Rails.application.routes.draw do
  resources :games, only: [:create]
  post 'chatgpt/explain', to: 'chatgpt#explain'
  mount ActionCable.server => '/cable'
end

