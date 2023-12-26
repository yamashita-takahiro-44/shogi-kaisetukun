# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://shogikaisetukun.com','https://shogikaisetukun.fly.dev','shogikaisetukun-front-ym3b.vercel.app' # フロントエンドのURL

    resource '*',
      headers: :any,
      methods: [:get, :post, :patch, :put, :delete, :options, :head],
      credentials: true
  end
end
