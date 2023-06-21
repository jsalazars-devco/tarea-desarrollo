FROM node:18.14.0

RUN groupadd -r user && useradd -r -g user user

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev --ignore-scripts

RUN chown -R user:user /app

USER user

COPY dist ./dist

CMD ["node", "./dist/src/index.js"]
