#!/bin/sh

if [ "$NODE_ENV" = "development" ]; then
    echo "Running in development mode"
    echo "Installing watchers"
    mkdir -p /etc/service/watch
    ln -sf /usr/local/bin/watch.run.sh /etc/service/watch/run
else
    echo "Running in production mode"
fi
