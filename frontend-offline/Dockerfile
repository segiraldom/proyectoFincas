FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY vite.config.js ./
COPY package*.json ./
RUN npm install
EXPOSE 5175
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5175"]