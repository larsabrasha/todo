# Stage 0, based on Node.js, to build and compile Angular
FROM node:8.15-jessie-slim as node
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build -- --prod

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15-alpine
COPY --from=node /app/dist/client /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD find /usr/share/nginx/html/main.*.js -type f -exec \
  sed -i -e 's,$OKTA_ISSUER,'"$OKTA_ISSUER"',' -e 's,$OKTA_REDIRECT_URI,'"$OKTA_REDIRECT_URI"',' -e 's,$OKTA_CLIENT,'"$OKTA_CLIENT"',' \
  {} \; && nginx -g 'daemon off;'
