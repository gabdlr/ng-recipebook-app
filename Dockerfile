FROM node:16.16
RUN mkdir /home/node/node_modules && chown node:node /home/node/node_modules
WORKDIR  /home/node/
RUN npm install -g @angular/cli
USER node
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --quiet
COPY --chown=node:node . .
