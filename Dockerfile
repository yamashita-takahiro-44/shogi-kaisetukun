# Stage 1: Build the Rails API

FROM ruby:3.2.2 AS api-builder

WORKDIR /app

# Copy API files
COPY shogi-api/Gemfile shogi-api/Gemfile.lock ./
RUN bundle install

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

# Copy API from api-builder
COPY --from=api-builder /app /app

# Install Node.js and Yarn for the frontend assets
RUN apt-get update -qq && apt-get install -y nodejs npm && npm install --global yarn

# Copy built frontend assets
COPY --from=frontend-builder /frontend/build /app/public

# Set the startup command
CMD ["rails", "server", "-b", "0.0.0.0"]
