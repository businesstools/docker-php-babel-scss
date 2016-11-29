#!/bin/sh

if [ "$NODE_ENV" = "development" ]; then
    echo "Running in development mode"
    echo "Installing watchers"
    mkdir -p /etc/service/watch
    ln -sf /usr/local/bin/watch.run.sh /etc/service/watch/run

    if [ ! -f /.development ]; then
        touch /.development
        sed -i '/robots/a\
            location /__webpack_hmr { \
                proxy_pass http://127.0.0.1:8080/__webpack_hmr; \
                proxy_http_version 1.1; \
                proxy_set_header Upgrade $http_upgrade; \
                proxy_set_header Connection "upgrade"; \
            }
        ' /etc/nginx/sites-available/default
    fi
else
    echo "Running in production mode"
fi
