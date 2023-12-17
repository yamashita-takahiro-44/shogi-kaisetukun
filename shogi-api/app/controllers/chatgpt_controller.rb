class ChatgptController < ApplicationController
  require 'net/http'
  require 'uri'
  require 'json'

  def explain
    # パラメータの確認
    Rails.logger.info "Received params: #{params.inspect}"
    moves = params[:moves]
    board = params[:board] # 追加されたboardパラメータ

    # GPTに送るプロンプトを決定
    prompt = if board.present?
               "あなたは将棋の解説者です。現在の盤面はSFEN形式で以下の通りです。\n#{board}\nこれに対して解説者っぽく解説をしてください。解説する内容は、現在の盤面の状況分析と次の手の予想です。回答は400字以内でお願いします。"
             else
               "あなたは将棋の解説者です。初期盤面からの将棋の手順は以下の通り。: #{moves}。これに対して解説者っぽく解説をしてください。解説する内容は、戦型と囲いの名前と最後の手の解説と次の手の予想です。回答は400字以内でお願いします。"
             end

    # APIリクエストの設定
    uri = URI('https://api.openai.com/v1/completions')
    request = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json', 'Authorization' => "Bearer #{ENV['OPENAI_API_KEY']}")
    request.body = {
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt,
      max_tokens: 400
    }.to_json

    # APIリクエストの実行
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
      http.request(request)
    end

    Rails.logger.info "API Response: #{response.body}"
    render json: response.body
  end
end
