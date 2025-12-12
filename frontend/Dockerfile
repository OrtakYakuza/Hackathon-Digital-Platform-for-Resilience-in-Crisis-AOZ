FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Dev server
CMD ["npm", "start"]
