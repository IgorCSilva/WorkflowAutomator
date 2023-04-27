# develop stage
FROM node:14.18.0 as develop-stage

WORKDIR /app

RUN npm install --global gulp-cli

COPY package*.json ./

RUN npm install

COPY . .

RUN npm link

CMD ["tail", "-f", "/dev/null"]