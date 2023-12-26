module Api
class ChatgptController < ApplicationController
  require 'net/http'
  require 'uri'
  require 'json'

  def explain
    moves = params[:moves]
    board = params[:board]
    model = params[:model]
    selected_prompt_type = params[:selectedPromptType]

    # プロンプトとロールの条件分岐
  system_prompt = case selected_prompt_type
                               when "解説者"
                                 if board.present?
                                   ["現在の将棋の盤面はSFEN形式で以下の通りです。\n#{board}\nこれに対して解説者っぽく解説してください。指手はKIF形式で回答してください。"]
                                 else
                                   ["初期盤面からの将棋の手順は以下の通りです: #{moves}。これに対して解説者っぽく解説してください。"]
                                 end
                                when "豊川先生風"
                                  if board.present?
                                    ["あなたは将棋棋士の豊川孝弘七段です。\
                                      豊川孝弘七段は、将棋に絡めた駄洒落が好きな棋士です。\
                                      よく使う駄洒落は以下の通りです。これに合わせた感じで必ず駄洒落を含めた解説をしてください。\
                                      両取りヘップバーン、同飛車大学、飛車をキリマンジャロ、局面は難解ホークス\
                                      現在の将棋の盤面はSFEN形式で以下の通りです。\n#{board}\nこれに対して豊川孝弘七段っぽく解説してください。指手はKIF形式で回答してください。"]
                                  else
                                    ["あなたは将棋棋士の豊川孝弘七段です。\
                                      豊川孝弘七段は、将棋に絡めた駄洒落が好きな棋士です。\
                                      よく使う駄洒落は以下のようなものです。これに合わせた感じで必ず駄洒落を含めて解説をしてください。\
                                      両取りヘップバーン、同飛車大学、飛車をキリマンジャロ、局面は難解ホークス\
                                      初期盤面からの将棋の手順は以下の通りです: #{moves}。これに対して豊川孝弘七段っぽく解説してください。"]
                                  end
                                when "格ゲー実況風"
                                  if board.present?
                                    ["あなたは格闘ゲーム実況者のアールさんです。\
                                      アールさんは、テンションの高い実況をする実況者です。\
                                      よく使う言葉は以下のようなものです。これに合わせた感じの口調で実況をしてください。\
                                      行ってみましょー！青写真を描けるか！さぁ、〇〇して！\
                                      現在の将棋の盤面はSFEN形式で以下の通りです。\n#{board}\nこれに対してアールさんっぽくテンション高く実況してください。指手はKIF形式で回答してください。"]
                                  else
                                    ["あなたは格闘ゲーム実況者のアールさんです。\
                                      アールさんは、テンションの高い実況をする実況者です。\
                                      よく使う言葉は以下のようなものです。これに合わせた感じの口調で実況をしてください。\
                                      行ってみましょー！青写真を描けるか！さぁ、〇〇して！\
                                      初期盤面からの将棋の手順は以下の通りです: #{moves}。これに対してアールさんっぽくテンション高く実況してください。"]
                                  end
                                when "知ったかぶり実況"
                                  if board.present?
                                    ["あなたは将棋のことは何も知りませんが、精一杯知ったかぶりをして実況をします。\
                                      現在の将棋の盤面はSFEN形式で以下の通りです。\n#{board}\nこれに対して将棋やチェスなどのボードゲームではないものに例えながら実況してください。\
                                      指手はKIF形式で回答してください。"]
                                  else
                                    ["あなたは将棋のことは何も知りませんが、精一杯知ったかぶりをして解説をします。\
                                      初期盤面からの将棋の手順は以下の通りです: #{moves}。これに対して将棋やチェスなどのボードゲームではないものに例えながら実況してください。"]
                                  end
                               else
                                if board.present?
                                  ["現在の将棋の盤面はSFEN形式で以下の通りです。\n#{board}\nこれに対してデーモン小暮っぽく解説してください。指手はKIF形式で回答してください。"]
                                else
                                  ["初期盤面からの将棋の手順は以下の通りです: #{moves}。これに対してデーモン小暮っぽく解説してください。"]
                               end
                              end.join(" ") 

    # リクエストボディの構築
    request_body = {
      model: model,
      messages: [
        { "role": "system", "content": system_prompt },
        { "role": "user", "content": "この局面の分析と次の一手を300文字以内で教えてください。" }
      ]
    }.to_json

    # リクエストボディのログ出力
Rails.logger.info "OpenAI APIリクエストボディ: #{request_body}"

    begin
      # OpenAI APIへのリクエスト
      response = Net::HTTP.post(
        URI('https://api.openai.com/v1/chat/completions'),
        request_body,
        'Content-Type' => 'application/json',
        'Authorization' => "Bearer #{ENV['OPENAI_API_KEY']}"
      )
      # レスポンスのログ出力
Rails.logger.info "API Response: #{response.body}"
    
      # 応答のレンダリング
      render json: response.body
    rescue => e
      render json: { error: e.message }, status: :internal_server_error
    end
  end
end
end
