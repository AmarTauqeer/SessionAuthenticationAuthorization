FROM node:18-alpine

WORKDIR /frontend

# COPY next.config.js ./next.config.js

# COPY pages ./pages

# COPY public ./public

# COPY styles ./styles
COPY package.json ./

RUN npm install --production --ignore-scripts

COPY . .
RUN npm run build
CMD ["npm", "start"]
