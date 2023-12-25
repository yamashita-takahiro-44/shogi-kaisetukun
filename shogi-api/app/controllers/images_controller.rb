class ImagesController < ApplicationController
  before_action :authenticate, only: [:destroy]

  # POST /images
  def create
    image_data = params[:image]

    if image_data.start_with?('http')
      # URLが送信された場合、S3へのアップロードはスキップ
      image = Image.new(url: image_data)
    else
      # Base64エンコードされたデータの場合、S3へアップロード
      content_type = 'image/png'
      filename = "shogi-board-#{Time.now.to_i}.png"

      s3 = Aws::S3::Resource.new(
        region: ENV['AWS_REGION'],
        access_key_id: ENV['AWS_ACCESS_KEY_ID'],
        secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
      )
      obj = s3.bucket(ENV['S3_BUCKET_NAME']).object(filename)
      decoded_image = Base64.decode64(image_data.split(',')[1])
      obj.put(body: decoded_image, content_type: content_type, acl: 'public-read')

      image = Image.new(url: obj.public_url)
    end

    if image.save
      render json: { imageUrl: image.url }
    else
      render json: { error: '画像の保存に失敗しました' }, status: :unprocessable_entity
    end
  end

  # GET /images
  def index
    images = Image.all
    render json: images
  end

  # POST /images/:id/like
  def like
    image = Image.find(params[:id])
    image.likes = (image.likes || 0) + 1
    image.save
    render json: { status: 'success', likes: image.likes }
  end

  def ranking
    ranked_images = Image.order(likes: :desc).limit(10) # 例: トップ10を取得
    render json: ranked_images
  end
 
  def destroy
    image = Image.find(params[:id])
    if image.destroy
      head :no_content
    else
      render json: { error: '画像の削除に失敗しました' }, status: :unprocessable_entity
    end
  end

  private

  def authenticate
    token = request.headers['Authorization']
    unless token && ActiveSupport::SecurityUtils.secure_compare(token, ENV['ADMIN_TOKEN'])
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
end
