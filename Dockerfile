
###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18.9.0-alpine3.15 As development

WORKDIR /usr/src/app
RUN apk add --no-cache g++ make python3
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18.9.0-alpine3.15 As build

WORKDIR /usr/src/app
RUN apk add --no-cache g++ make python3
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build
RUN npm ci --only=production && npm cache clean --force
USER node

###################
# PRODUCTION
###################

FROM node:18.9.0-alpine3.15 As production
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
CMD [ "node", "dist/src/main.js" ]