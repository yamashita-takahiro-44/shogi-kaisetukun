#!/bin/sh

# Start Nginx in the background
nginx -g 'daemon off;' &

# Update PATH to include bundler
export PATH="/app/api/vendor/bundle/ruby/3.2.0/bin:/usr/local/bin:$PATH"

# Debug: Print the environment variables
echo "GEM_HOME: $GEM_HOME"
echo "GEM_PATH: $GEM_PATH"
echo "PATH: $PATH"

# Debug: Check where bundle is located
which bundle

# Check if bundle is available
if ! which bundle > /dev/null; then
    echo "Error: Bundler not found."
    exit 1
fi

# Start the Rails API
cd /app/api && bundle exec puma -C config/puma.rb
