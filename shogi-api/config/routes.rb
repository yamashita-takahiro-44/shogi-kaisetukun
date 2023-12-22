Rails.application.routes.draw do
  resources :games, only: [:create]
  post 'chatgpt/explain', to: 'chatgpt#explain'
  post 'images', to: 'images#create'
  resources :images, only: [:create, :index] do
    member do
      post :like
    end
  end
  mount ActionCable.server => '/cable'
end

