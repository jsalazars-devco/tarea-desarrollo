FROM node:18.14.0-alpine

RUN groupadd -r user && useradd -r -g user user

WORKDIR /dist

COPY package*.json ./

RUN npm install --omit=dev --ignore-scripts

RUN chown -R user:user /dist

USER user

COPY . ./dist

CMD ["node", "./dist/src/index.js"]
