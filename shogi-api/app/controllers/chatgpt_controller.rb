class ChatgptController < ApplicationController
  require 'net/http'
  require 'uri'
  require 'json'

  def explain
    # パラメータの確認
    Rails.logger.info "Received params: #{params.inspect}"
    moves = params[:moves]
    board = params[:board] # 追加されたboardパラメータ

    # 解説者（システム）のプロンプトを決定
    system_prompt = if board.present?
                      "現在の将棋の盤面はSFEN形式で以下の通りです。\n#{board}\nこれに対して解説者っぽく解説してください。"
                    else
                      "初期盤面からの将棋の手順は以下の通りです: #{moves}。これに対して解説者っぽく解説してください。"
                    end

    # 視聴者（ユーザー）のメッセージ
    user_message = "解説者さん、この局面の分析と次の一手を300文字以内で教えてください。"

    # APIリクエストの設定
    uri = URI('https://api.openai.com/v1/chat/completions')
    request = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json', 'Authorization' => "Bearer #{ENV['OPENAI_API_KEY']}")
    request.body = {
      model: "gpt-4-1106-preview",
      messages: [
        { "role": "system", "content": system_prompt },
        { "role": "user", "content": user_message }
      ]
    }.to_json

    # APIリクエストの実行
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
      http.request(request)
    end

    Rails.logger.info "API Response: #{response.body}"
    render json: response.body
  end
end
