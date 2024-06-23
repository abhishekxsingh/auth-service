# auth-service

auth-service.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them

```
Node@16.x.x
```
### Environment variable used in application.

| Variable            | Description                                           | Example                                             | 
| ------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| SERVER_PORT         | Set this variable to run your app on this port        | 3002                                                |
| DB_CONNECTION_STRING| This variable is used to connect with database        | dialect://username:password@host:port/database_name |

### Installing

A step by step series that will tell you how to get a development env running

```
$ cd server
```

```
$ npm ci
```

## Installing via using docker-compose

A step by step series to run application via using docker-compose command

- Use the following link to setup `docker-compose` on different operating system
[click here to check docker-compose installation commands for your operating system](https://docs.docker.com/compose/install/#install-compose)

- Run the following command to build a docker image for application

```bash
#!/bin/bash
cd ops/local
sudo chmod a+x build.sh
./build.sh
```

## Use the following commands to check/start/stop running docker containers/images on your local machine

### List all containers (only IDs)

```bash
#!/bin/bash
docker ps -aq
```

### Stop all running containers

```bash
#!/bin/bash
docker stop $(docker ps -aq)

docker stop <container-id> --- stop single running container
```

### Remove all containers

```bash
#!/bin/bash
docker rm $(docker ps -aq)

docker rm <container-id> --- remove single stopped container
```

### Remove all images

```bash
#!/bin/bash
docker rmi $(docker images -q)

docker rmi <image-id> --- remove single docker image
```

### check running docker-compose services

```bash
#!/bin/bash
docker-compose ps
```

### check status of running particular docker-compose services

```bash
#!/bin/bash
docker-compose ps -q <service_name>
```

### kill running docker-compose services

```bash
#!/bin/bash
docker-compose kill
```

## Run the Server
```
$ npm run start
```
## Run the test cases

```
$ npm run test
```
# auth-service
