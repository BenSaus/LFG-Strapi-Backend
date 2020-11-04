FROM strapi/base:alpine

WORKDIR /usr/src/app
# change working directory 

COPY ./package.json ./
COPY ./package-lock.json ./
# copy files into the work directory

RUN npm install
# install dependancies

COPY . .
# copy local source code into the work directory

ENV NODE_ENV production
# set the node environment variable

RUN npm run build
# build the source

EXPOSE 1337
# expose these ports on the docker virtual network
# you still need to use -p or -P to open/forward these ports on the host

CMD ["npm", "run", "start"]
# required: run this command when container is launched
# only one CMD allowed, 