FROM ruby:3.2.2

RUN apt-get update -qq && apt-get install -y nodejs npm
RUN npm install --global yarn
RUN mkdir /shogi-api
WORKDIR /shogi-api

COPY Gemfile /shogi-api/Gemfile
COPY Gemfile.lock /shogi-api/Gemfile.lock
RUN bundle install

COPY . /shogi-api

CMD ["rails", "server", "-b", "0.0.0.0"]
