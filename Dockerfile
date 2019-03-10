FROM node:10.15.2

WORKDIR /usr/src/app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]