FROM node:10

# Create app directory
WORKDIR /usr/src/app

# I can't remember if this even worked
ARG AWS_ACCESS_KEY_ID=something
ARG AWS_SECRET_ACCESS_KEY=something

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package.json_docker ./package.json
#COPY package-lock.json ./
COPY package*.json ./

#RUN mkdir ~/.aws/
#COPY "./.aws/config" "~/.aws/config"
#COPY "./.aws/credentials" "~/.aws/credentials"

RUN npm install --production
# If you are building your code for production
#RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 80
CMD [ "node", "--experimental-modules", "app.mjs"]
