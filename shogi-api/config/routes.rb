Rails.application.routes.draw do
  get 'frontend/index'

  # 既存のルート
  resources :games, only: [:create]
  post 'chatgpt/explain', to: 'chatgpt#explain'
  resources :images, only: [:create, :index] do
    member do
      post :like
    end
    collection do
      get :ranking
    end
  end
  mount ActionCable.server => '/cable'

  # 管理者用のルート
  namespace :admin do
    resources :images, only: [:destroy]
  end

  # React Routerが管理するフロントエンドのルートのための設定
  # これにより、/adminなどのフロントエンドのパスに対するリクエストはリダイレクトされなくなります。
  get '/(*path)', to: 'frontend#index'

end
