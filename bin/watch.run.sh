#!/bin/sh

if [ "$NODE_ENV" = "development" ]; then
    echo "Running in development mode"
    cd /var/www && npm run build && exec npm run watch
else
    echo "Running in production mode"
fi
