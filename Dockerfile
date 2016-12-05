FROM leyyinad/nginx-php
MAINTAINER Daniel Haus <daniel.haus@businesstools.de>

ADD ./bin/watch.setup.sh /usr/local/bin/
ADD ./bin/watch.run.sh /usr/local/bin/

RUN ln -s /usr/local/bin/watch.setup.sh /etc/my_init.d/watch.setup.sh

WORKDIR /var/www
ADD ./package.json /var/www
ADD ./.babelrc /var/www/.babelrc

RUN npm install

ADD ./tasks /var/www/tasks
ADD ./assets/src/index.js /var/www/assets/src/index.js

RUN npm run build
