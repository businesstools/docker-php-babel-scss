#!/bin/sh

if [ "$NODE_ENV" = "development" ]; then
    echo "Running in development mode"
    cd /var/www && yarn build && exec yarn watch
else
    echo "Running in production mode"
fi

if [ "$VIRTUAL_HOST" ]; then
    echo "Listening on $VIRTUAL_HOST"
fi
