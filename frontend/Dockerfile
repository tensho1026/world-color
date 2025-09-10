FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install && npm install lightningcss --save-dev

COPY . .

CMD ["npm", "run", "dev"]
EXPOSE 3000
