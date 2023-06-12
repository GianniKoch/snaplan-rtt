FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run check
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app/package.json .
COPY --from=build /app/build .
COPY --from=build /app/server .
RUN npm install --only=production

EXPOSE 3000
EXPOSE 3001

RUN npm install -g pm2
COPY --from=build /app/pm2.config.cjs .
CMD ["pm2-runtime", "start", "pm2.config.cjs"]