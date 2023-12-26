Rails.application.routes.draw do
  get 'frontend/index'

  # API関連のルート
  namespace :api, defaults: { format: :json } do
    resources :games, only: [:create]
    post 'chatgpt/explain', to: 'chatgpt#explain' # この行を修正
    resources :images, only: [:create, :index] do
      resources :comments, only: [:create, :index]
      member do
        post :like
      end
      collection do
        get :ranking
      end
    end
  end

  # ActionCable
  mount ActionCable.server => '/cable'

  # 管理者用のルート
  namespace :admin do
    resources :images, only: [:destroy]
  end

  # React Routerが管理するフロントエンドのルートのための設定
  get '/(*path)', to: 'frontend#index'
end
