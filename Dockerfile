FROM node:18.14.0

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY dist ./dist

CMD ["node", "./dist/src/index.js"]
