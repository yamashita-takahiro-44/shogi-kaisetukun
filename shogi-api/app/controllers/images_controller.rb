require 'aws-sdk-s3'

class ImagesController < ApplicationController
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

    render json: { imageUrl: obj.public_url }
  end
end
