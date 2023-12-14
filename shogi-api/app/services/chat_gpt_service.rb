require 'net/http'
require 'uri'
require 'json'


class ChatGptService
  def self.get_response(input_text)
    uri = URI("https://api.openai.com/v1/engines/davinci-codex/completions") # ChatGPTのAPIエンドポイント
    request = Net::HTTP::Post.new(uri)
    request["Authorization"] = "Bearer #{ENV['OPENAI_API_KEY']}" # 環境変数からAPIキーを取得
    request["Content-Type"] = "application/json"
    request.body = JSON.dump({
      "prompt" => input_text,
      "max_tokens" => 150
    })

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
      http.request(request)
    end

    JSON.parse(response.body)["choices"].first["text"].strip
  end
end
