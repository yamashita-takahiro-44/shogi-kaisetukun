class GamesController < ApplicationController
  # POST /games
  def create
    # 新しいGameインスタンスを作成し、リクエストからのパラメータで初期化
    game = Game.new(game_params)

    # Gameインスタンスをデータベースに保存
    if game.save
      # ChatGptServiceを使用して、盤面情報に基づいて解説を取得
      response_text = ChatGptService.get_response(game.board)

      # 正常なレスポンスとして、ゲームのデータと解説のテキストを返す
      render json: { game: game, response: response_text }, status: :created
    else
      # エラーがあれば、エラーメッセージを含むレスポンスを返す
      render json: { errors: game.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  # Strong Parametersを使用して、許可されたパラメータのみを取得
  def game_params
    params.require(:game).permit(:board, :moves)
  end
end
