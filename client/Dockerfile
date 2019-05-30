# Stage 0, based on Node.js, to build and compile Angular
FROM node:10.16.0-jessie as node
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build -- --prod

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15-alpine
COPY --from=node /app/robots.txt /usr/share/nginx/html
COPY --from=node /app/dist/client /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD find /usr/share/nginx/html/main*.js -type f -exec \
  sed -i \
  -e 's,$SSO_URL,'"$SSO_URL"',' \
  -e 's,$SSO_IFRAME_URL,'"$SSO_IFRAME_URL"',' \
  -e 's,$SSO_CALLBACK_URL,'"$SSO_CALLBACK_URL"',' \
  -e 's,$SSO_AUD,'"$SSO_AUD"',' \
  {} \; \
  && nginx -g 'daemon off;'

