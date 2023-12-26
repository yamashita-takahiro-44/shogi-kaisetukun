module Api
  class CommentsController < ApplicationController
    def create
      comment = Comment.new(comment_params)
      if comment.save
        render json: comment, status: :created
      else
        render json: comment.errors, status: :unprocessable_entity
      end
    end

    def index
      comments = Comment.where(image_id: params[:image_id])
      render json: comments
    end

    private

    def comment_params
      params.require(:comment).permit(:content, :image_id)
    end
  end
end
