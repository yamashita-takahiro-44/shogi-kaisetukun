class ImagesController < ApplicationController
  # POST /images
  def create
    image_data = params[:image]
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
    image.likes += 1
    image.save
    render json: { status: 'success', likes: image.likes }
  end
end
