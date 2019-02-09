FROM node:8.15-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN mv src/environments/environment.prod.ts src/environments/environment.ts && \
    npm run build
EXPOSE 3000
CMD sed -i -e 's,$ISS,'"$ISS"',' -e 's,$AUD,'"$AUD"',' -e 's,$SECRET,'"$SECRET"',' dist/environments/environment.js \
    && node dist/main.js
