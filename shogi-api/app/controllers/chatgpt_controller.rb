class ChatgptController < ApplicationController
  require 'net/http'
  require 'uri'
  require 'json'

  def explain
    # パラメータの確認
    Rails.logger.info "Received params: #{params.inspect}"
    moves = params[:moves]

    # GPT-4のモデル名に変更（具体的なモデル名は確認が必要）
    uri = URI('https://api.openai.com/v1/engines/text-davinci-003/completions')

    request = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json', 'Authorization' => "Bearer #{ENV['OPENAI_API_KEY']}")

    request.body = {
      prompt: "あなたは将棋の解説者です。将棋の手順は以下の通り。: #{moves}。これに対して解説者っぽく解説をしてください。解説する内容は、戦型と囲いの名前と最後の手の解説と次の手の予想です。",
      max_tokens: 400
    }.to_json

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
      http.request(request)
    end

    Rails.logger.info "API Response: #{response.body}"

    render json: response.body
  end
end
