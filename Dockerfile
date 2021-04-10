FROM node:14.7.0-alpine as build

RUN rm -rf /app && mkdir /app
WORKDIR /app

COPY . /app

RUN npm config set registry https://registry.npm.taobao.org && yarn --frozen-lockfile --check-files

RUN yarn run build

CMD ["yarn", "start", "-p", "9000"]

# FROM nginx

# COPY --from=build /app/build /app
# COPY --from=build /app/nginx/default.conf /etc/nginx/conf.d/default.conf