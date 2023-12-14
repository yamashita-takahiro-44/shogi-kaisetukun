# Stage 1: Build the Rails API
FROM ruby:3.2.2 AS api-builder
WORKDIR /app

# Install system dependencies
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs

# Set bundle path
ENV BUNDLE_PATH /usr/local/bundle

# Copy Gemfile and Gemfile.lock
COPY shogi-api/Gemfile shogi-api/Gemfile.lock ./

# Install gems
RUN gem install bundler && bundle install --deployment

# Copy the rest of the Rails app
COPY shogi-api .

# Stage 2: Build the React Frontend
FROM node:20.5.1 AS frontend-builder
WORKDIR /frontend

# Copy Frontend files
COPY shogi-frontend/package.json shogi-frontend/package-lock.json ./
RUN npm install
COPY shogi-frontend .
RUN npm run build

# Stage 3: Final Image
FROM ruby:3.2.2
WORKDIR /app

# Set bundle path and add /usr/local/bundle/bin to PATH
ENV BUNDLE_PATH /usr/local/bundle
ENV PATH /usr/local/bundle/bin:$PATH

# Install system dependencies
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs npm
RUN npm install --global yarn

# Copy API from api-builder
COPY --from=api-builder /app /app

# Install gems
RUN bundle install

# Copy built frontend assets
COPY --from=frontend-builder /frontend/build /app/public

# Set the startup command
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "8080"]
