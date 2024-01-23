FROM node:18
COPY ./ /app
WORKDIR /app
RUN npm install && npm run build
ENV PORT 3000
EXPOSE 3000
CMD [ "node", "/app/dist/app.js" ]
