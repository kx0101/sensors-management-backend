FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --force --verbose

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "build/index.js"]
